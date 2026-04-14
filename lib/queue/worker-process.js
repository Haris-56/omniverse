import { Worker } from 'bullmq';
import { redisConnection } from './redis.js';
import { emailQueue } from './email-queue.js';
import { MongoClient, ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';

import { logSystemEvent } from '../logger.js';
import { isGlobalKillSwitchActive } from '../safety/kill-switch.js';
import { checkSafetyGovernor } from '../safety/governor.js';
import { processEmailContent, replaceVariables } from '../automation/email-utils.js';
import { decrypt } from '../encryption.js';

dotenv.config({ path: '/var/www/omniverse/.env' });
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

/**
 * Calculates true random delay in milliseconds (with fractional precision)
 * Requirement: 2.3435 sec, 46.656, 143sec etc.
 */
function getRandomDelayMs(minSeconds = 30, maxSeconds = 120) {
    const minMs = minSeconds * 1000;
    const maxMs = maxSeconds * 1000;
    // True random float between min and max
    return (Math.random() * (maxMs - minMs)) + minMs;
}

async function processCampaignJob(job) {
    const { campaignId } = job.data;
    let client;

    try {
        if (await isGlobalKillSwitchActive()) {
            console.log("Global Kill-switch active. Skipping.");
            return;
        }

        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB || 'omniverse');

        const campaign = await db.collection('email_campaigns').findOne({ _id: new ObjectId(campaignId) });
        if (!campaign || campaign.status !== 'Active') return;

        // Fetch Accounts (Supporting Multiple Accounts / Round Robin)
        let accountIds = campaign.accountIds || [];
        if (accountIds.length === 0 && campaign.accountId) accountIds.push(campaign.accountId);
        if (accountIds.length === 0) throw new Error("No accounts assigned to campaign.");

        // Check global window limits for the campaign
        const zone = campaign.timezone || 'UTC';
        const now = DateTime.now().setZone(zone);

        if (campaign.settings?.businessHoursOnly && now.weekday > 5) {
            console.log(`[Campaign ${campaign.name}] Paused for weekend.`);
            const delayToMondayMs = now.plus({ days: 8 - now.weekday }).startOf('day').plus({ hours: 9 }).diff(now).as('milliseconds');
            await db.collection('email_campaigns').updateOne({ _id: campaign._id }, { $set: { nextRunAt: new Date(Date.now() + Math.max(delayToMondayMs, 60000)) } });
            return;
        }

        const startStr = campaign.hours?.start || '09:00';
        const endStr = campaign.hours?.end || '17:00';
        const startTime = DateTime.fromFormat(startStr, 'HH:mm', { zone }).set({ year: now.year, month: now.month, day: now.day });
        const endTime = DateTime.fromFormat(endStr, 'HH:mm', { zone }).set({ year: now.year, month: now.month, day: now.day });

        if (now < startTime || now > endTime) {
            console.log(`[Campaign ${campaign.name}] Outside sending window.`);
            const waitTimeMs = now < startTime ? startTime.diff(now).as('milliseconds') : startTime.plus({ days: 1 }).diff(now).as('milliseconds');
            await db.collection('email_campaigns').updateOne({ _id: campaign._id }, { $set: { nextRunAt: new Date(Date.now() + waitTimeMs) } });
            return;
        }

        // Daily Limit Check
        const startOfDay = now.startOf('day').toJSDate();
        const sentToday = await db.collection('email_logs').countDocuments({
            campaignId: campaign._id,
            sentAt: { $gte: startOfDay }
        });

        const dailyLimit = parseInt(campaign.settings?.dailyLimit || campaign.dailyLimit) || 50;
        if (sentToday >= dailyLimit) {
            console.log(`[Campaign ${campaign.name}] Reached daily limit (${sentToday}/${dailyLimit}).`);
            const waitTimeMs = startTime.plus({ days: 1 }).diff(now).as('milliseconds');
            await db.collection('email_campaigns').updateOne({ _id: campaign._id }, { $set: { nextRunAt: new Date(Date.now() + waitTimeMs) } });
            return;
        }

        // --- ACCOUNT SELECTION & HOURLY RATE LIMITING (Round-Robin) ---
        let selectedAccount = null;
        let rateLimitDelayMs = null;
        const totalSentFromCampaign = campaign.sentCount || 0;

        for (let i = 0; i < accountIds.length; i++) {
            const accIndex = (totalSentFromCampaign + i) % accountIds.length;
            const accId = accountIds[accIndex];

            const oneHourAgo = new Date(Date.now() - 3600000);
            const sentLastHour = await db.collection('email_logs').countDocuments({
                accountId: new ObjectId(accId),
                sentAt: { $gte: oneHourAgo }
            });

            const limit = campaign.settings?.maxPerHour || 15;
            if (sentLastHour < limit) {
                const acc = await db.collection('email_accounts').findOne({ _id: new ObjectId(accId) });
                if (acc) {
                    const safety = await checkSafetyGovernor(acc._id, 'email');
                    if (safety.safe) {
                        selectedAccount = acc;
                        break;
                    }
                }
            }
        }

        if (!selectedAccount) {
            console.log(`[Campaign ${campaign.name}] All accounts hit hourly rate limit or safety blocked. Retrying in 10 mins.`);
            await db.collection('email_campaigns').updateOne({ _id: campaign._id }, { $set: { nextRunAt: new Date(Date.now() + (10 * 60 * 1000)) } });
            return;
        }

        // --- FIND NEXT CONTACT ---
        let targetContact = null;
        let isFollowup = false;
        let currentStepIndex = 0;
        let progressDocId = null;

        const inProgress = await db.collection('campaign_progress').find({
            campaignId: campaign._id,
            status: { $in: ['sent', 'active', 'queued', 'processing-initial', 'processing-followup', 'retry'] },
            currentStep: { $lt: (campaign.sequences?.length || 0) + 1 } // +1 because step 0 is the start
        }).sort({ lastSentAt: 1 }).toArray();

        for (let p of inProgress) {
            const nextStepIndex = p.currentStep || 0;
            
            // Special Case: Stuck or Queued Initial Send
            if (nextStepIndex === 0 && !p.lastSentAt) {
                targetContact = await db.collection('contacts').findOne({ _id: p.contactId });
                if (targetContact) {
                    isFollowup = false; // It's the first email
                    currentStepIndex = 0;
                    progressDocId = p._id;
                    break;
                }
            }

            const seq = campaign.sequences && campaign.sequences[nextStepIndex - 1]; // -1 because progress.currentStep 1 means seq[0]
            if (nextStepIndex > 0 && !seq) continue;
            
            if (nextStepIndex > 0) {
                const daysSince = (new Date() - new Date(p.lastSentAt)) / (1000 * 60 * 60 * 24);
                if (daysSince >= seq.delayDays) {
                    targetContact = await db.collection('contacts').findOne({ _id: p.contactId });
                    if (targetContact) {
                        isFollowup = true;
                        currentStepIndex = nextStepIndex;
                        progressDocId = p._id;
                        break;
                    }
                }
            }
        }

        if (!targetContact) {
            const existingProgressIds = await db.collection('campaign_progress')
                .find({ campaignId: campaign._id })
                .project({ contactId: 1 })
                .toArray()
                .then(arr => arr.map(x => x.contactId));
                
            const listIds = [
                campaign.listId, 
                campaign.listId.toString(), 
                ObjectId.isValid(campaign.listId) ? new ObjectId(campaign.listId) : null
            ].filter(Boolean);
            targetContact = await db.collection('contacts').findOne({
                listId: { $in: listIds },
                _id: { $nin: existingProgressIds }
            });

            if (targetContact) {
                const inserted = await db.collection('campaign_progress').insertOne({
                    campaignId: campaign._id,
                    contactId: targetContact._id,
                    status: 'processing-initial',
                    currentStep: 0,
                    createdAt: new Date()
                });
                progressDocId = inserted.insertedId;
            }
        }

        if (!targetContact) {
            console.log(`[Campaign ${campaign.name}] COMPLETED. No more contacts or follow-ups.`);
            await db.collection('email_campaigns').updateOne(
                { _id: campaign._id }, 
                { $set: { status: 'Completed', completedAt: new Date() } }
            );
            return; 
        }

        if (isFollowup) {
            await db.collection('campaign_progress').updateOne(
                { _id: progressDocId },
                { $set: { status: 'processing-followup' } }
            );
        }

        // --- PREPARE EMAIL ---
        const password = decrypt(selectedAccount.password);

        const transporter = nodemailer.createTransport({
            host: selectedAccount.smtpConfig.host || 'smtp.gmail.com',
            port: selectedAccount.smtpConfig.port || 465,
            secure: selectedAccount.smtpConfig.secure !== false,
            auth: { user: selectedAccount.smtpConfig.user || selectedAccount.email, pass: password },
            tls: { rejectUnauthorized: false },
            connectionTimeout: 15000,
            socketTimeout: 15000
        });

        let subject, message, variant = 'A';
        if (isFollowup) {
            const followUp = campaign.sequences[currentStepIndex]; 
            subject = followUp.subject;
            message = followUp.message;
        } else {
            const useB = campaign.variants?.active && campaign.variants.b?.subject && Math.random() > 0.5;
            variant = useB ? 'B' : 'A';
            const v = useB ? campaign.variants.b : campaign.variants.a;

            if (!v?.subject || !v?.message) throw new Error("Missing variant content.");
            subject = v.subject;
            message = v.message;
        }

        const finalSub = replaceVariables(subject, targetContact);
        const finalMsg = processEmailContent(message, targetContact, campaign.settings);
        const recipientEmail = targetContact.email || targetContact.Email || targetContact.EMAIL;
        
        // --- EXECUTE SEND ---
        try {
            await transporter.sendMail({
                from: `"${selectedAccount.name || ''}" <${selectedAccount.email}>`,
                to: recipientEmail,
                subject: finalSub,
                html: finalMsg,
            });

            await db.collection('email_logs').insertOne({
                accountId: selectedAccount._id,
                campaignId: campaign._id,
                contactId: targetContact._id,
                sentAt: new Date(),
                type: isFollowup ? 'followup' : 'initial',
                step: currentStepIndex,
                variant,
                status: 'sent'
            });

            await db.collection('email_campaigns').updateOne({ _id: campaign._id }, { $inc: { sentCount: 1 } });
            
            await db.collection('campaign_progress').updateOne(
                { _id: progressDocId },
                { $set: { status: 'sent', currentStep: currentStepIndex + 1, lastSentAt: new Date(), variant } }
            );

            await logSystemEvent('INFO', 'email-worker', `Sent ${isFollowup ? 'followup' : 'initial'} to ${recipientEmail} via ${selectedAccount.email}`);
            
            // Generate True Random Delay for NEXT mail in campaign
            const minSecs = campaign.delays?.min || 30;
            const maxSecs = campaign.delays?.max || 120;
            const delayMs = getRandomDelayMs(minSecs, maxSecs);

            console.log(`[Worker] Mail sent to ${recipientEmail} for '${campaign.name}'. Next email in ${(delayMs/1000).toFixed(3)}s.`);
            await db.collection('email_campaigns').updateOne({ _id: campaign._id }, { $set: { nextRunAt: new Date(Date.now() + delayMs) } });

        } catch (sendErr) {
            console.error(`Send failed for ${recipientEmail}:`, sendErr.message);
            await db.collection('campaign_progress').updateOne(
                { _id: progressDocId },
                { $set: { status: isFollowup ? 'sent' : 'pending' } } 
            );
            await logSystemEvent('ERROR', 'email-worker', `Send failed to ${recipientEmail}: ${sendErr.message}`);
            await db.collection('email_campaigns').updateOne({ _id: campaign._id }, { $set: { nextRunAt: new Date(Date.now() + (5 * 60 * 1000)) } });
        }

    } catch (err) {
        console.error(`[Worker Error] Campaign ${campaignId}:`, err);
        // Fallback delay on error
        if (client) {
            try {
                const db = client.db(process.env.MONGODB_DB || 'omniverse');
                await db.collection('email_campaigns').updateOne({ _id: new ObjectId(campaignId) }, { $set: { nextRunAt: new Date(Date.now() + 60000) } });
            } catch (e) {}
        }
    } finally {
        if (client) await client.close();
    }
}

const worker = new Worker('email-sending', processCampaignJob, {
    connection: redisConnection,
    concurrency: 5 // Process up to 5 unique campaigns in parallel stably
});

console.log("Email Worker Process Started (Queue-Based)");

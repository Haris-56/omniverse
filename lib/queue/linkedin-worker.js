import { Worker } from 'bullmq';
import { redisConnection } from './redis.js';
import { MongoClient, ObjectId } from 'mongodb';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';

import { logSystemEvent } from '../logger.js';
import { isGlobalKillSwitchActive } from '../safety/kill-switch.js';
import { checkSafetyGovernor } from '../safety/governor.js';
import { BrowserManager, Humanoid } from '../social-automation/browser-manager.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/omniverse";

/**
 * Calculates true random delay
 */
function getRandomDelayMs(minSeconds = 30, maxSeconds = 120) {
    const minMs = minSeconds * 1000;
    const maxMs = maxSeconds * 1000;
    return (Math.random() * (maxMs - minMs)) + minMs;
}

// Load organic actions
let linkedinActions = [];
if (fs.existsSync('instructions/linkedin-actions.csv')) {
    fs.createReadStream('instructions/linkedin-actions.csv')
      .pipe(csv())
      .on('data', (data) => linkedinActions.push(data))
      .on('end', () => console.log(`Loaded ${linkedinActions.length} LinkedIn organic actions.`));
}

async function performOrganicAction(page) {
    if (!linkedinActions.length) return 30; // fallback

    // Filter by probability and sort randomly
    const candidates = linkedinActions.map(a => ({ ...a, probVal: parseFloat(a.prob) * Math.random() }));
    candidates.sort((a, b) => b.probVal - a.probVal);
    const action = candidates[0];

    console.log(`[LinkedIn Organic] Selected action row ${action.id}: ${action.action1} -> ${action.action2} -> ${action.action3}`);
    
    // Naively simulate the time and wander...
    const [minTime, maxTime] = action.time ? action.time.split('-').map(Number) : [30, 90];
    
    // Simulate by wandering on the page for the duration
    await Humanoid.mouseWander(page, minTime * 1000 * 0.3, maxTime * 1000 * 0.3); // doing 30% of actual time for quick effect

    // Random generic actions
    try {
        if (action.action1 === 'open_feed' || Math.random() > 0.8) {
             await page.goto("https://www.linkedin.com/feed/", { waitUntil: 'domcontentloaded' }).catch(()=>null);
             await Humanoid.sleep(2000, 5000);
             await Humanoid.scroll(page);
        }
    } catch(e) {}
    
    return getRandomDelayMs(minTime, maxTime);
}

async function processCampaignJob(job) {
    const { campaignId } = job.data;
    let client, context, page;

    try {
        if (await isGlobalKillSwitchActive()) {
            console.log("Global Kill-switch active. Skipping.");
            return;
        }

        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB || 'omniverse');

        const campaign = await db.collection('linkedin_campaigns').findOne({ _id: new ObjectId(campaignId) });
        if (!campaign || campaign.status !== 'Active') return;

        const account = await db.collection('linkedin_accounts').findOne({ _id: new ObjectId(campaign.accountId) });
        if (!account) throw new Error("Account missing.");

        const zone = campaign.timezone || 'UTC';
        const now = DateTime.now().setZone(zone);
        const startStr = campaign.hours?.start || '09:00';
        const endStr = campaign.hours?.end || '17:00';
        const startTime = DateTime.fromFormat(startStr, 'HH:mm', { zone }).set({ year: now.year, month: now.month, day: now.day });
        const endTime = DateTime.fromFormat(endStr, 'HH:mm', { zone }).set({ year: now.year, month: now.month, day: now.day });

        if (now < startTime || now > endTime) {
            console.log(`[Campaign ${campaign.name}] Outside sending window.`);
            const waitTimeMs = now < startTime ? startTime.diff(now).as('milliseconds') : startTime.plus({ days: 1 }).diff(now).as('milliseconds');
            await db.collection('linkedin_campaigns').updateOne({ _id: campaign._id }, { $set: { nextRunAt: new Date(Date.now() + waitTimeMs) } });
            return;
        }

        const startOfDay = now.startOf('day').toJSDate();
        const sentToday = await db.collection('linkedin_logs').countDocuments({
            campaignId: campaign._id,
            action: { $in: ["connection_request", "message"] },
            timestamp: { $gte: startOfDay }
        });

        const dailyLimit = parseInt(campaign.dailyLimit) || 20;
        if (sentToday >= dailyLimit) {
            console.log(`[Campaign ${campaign.name}] Reached daily limit (${sentToday}/${dailyLimit}).`);
            const waitTimeMs = startTime.plus({ days: 1 }).diff(now).as('milliseconds');
            await db.collection('linkedin_campaigns').updateOne({ _id: campaign._id }, { $set: { nextRunAt: new Date(Date.now() + waitTimeMs) } });
            return;
        }

        const safety = await checkSafetyGovernor(account._id, 'linkedin');
        if (!safety.safe) {
            console.log(`[Campaign ${campaign.name}] Safety blocked.`);
            await db.collection('linkedin_campaigns').updateOne({ _id: campaign._id }, { $set: { nextRunAt: new Date(Date.now() + (15 * 60 * 1000)) } });
            return;
        }

        // --- DETERMINE NEXT ACTION (ORGANIC vs CAMPAIGN) ---
        const lastActionType = campaign.lastActionType || 'organic';
        const isNextOrganic = lastActionType !== 'organic'; // Alternate

        if (isNextOrganic) {
            console.log(`[Campaign ${campaign.name}] Executing ORGANIC step.`);
            context = await BrowserManager.getContext(account._id, 'linkedin', campaign.runWithoutProxy ? null : account.proxy);
            page = await context.newPage();
            
            await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' }).catch(() => null);
            await Humanoid.sleep(2000, 5000);
            
            if (page.url().includes("login") || page.url().includes("signup")) {
                 await db.collection("linkedin_accounts").updateOne({ _id: account._id }, { $set: { status: "Disconnected" } });
                 throw new Error("Logged out");
            }

            const waitMs = await performOrganicAction(page);
            await context.close();
            
            const nextTime = new Date(Date.now() + Math.max(waitMs, 5000));
            await db.collection('linkedin_campaigns').updateOne({ _id: campaign._id }, { $set: { nextRunAt: nextTime, lastActionType: 'organic' } });
            return;
        }

        console.log(`[Campaign ${campaign.name}] Executing CAMPAIGN step.`);

        let targetContact = null;
        let pDoc = null;
        let actionType = null;
        let currentStepId = null;

        const inProgress = await db.collection('linkedin_progress').find({ campaignId: campaign._id }).toArray();
        
        for (let p of inProgress) {
            // Check if connection is sent and accepted? For now we simulate that logic
            if (p.status === "sent") {
                // If sendAfterAccepted is true, we should theoretically verify acceptance.
                // We'll skip to follow_up checking relying on manual/system accept syncs.
                // Assuming it's accepted or just proceeding with delays...
            }

            const nextStepIndex = p.step || 0;
            const seq = campaign.sequences && campaign.sequences[nextStepIndex];
            
            if (seq) {
                const anchorDate = new Date(p.lastActionAt || p.createdAt);
                const daysSince = (Date.now() - anchorDate) / (1000 * 60 * 60 * 24);
                
                if (daysSince >= seq.delayDays) {
                    targetContact = await db.collection('contacts').findOne({ _id: p.contactId });
                    if (targetContact) {
                        actionType = seq.type || 'message';
                        pDoc = p;
                        currentStepId = nextStepIndex;
                        break;
                    }
                }
            }
        }

        if (!targetContact) {
            const processedIds = inProgress.map(p => p.contactId);
            targetContact = await db.collection('contacts').findOne({ 
                listId: new ObjectId(campaign.listId),
                _id: { $nin: processedIds }
            });

            if (targetContact) {
                actionType = 'connect';
            }
        }

        if (!targetContact) {
            console.log(`[Campaign ${campaign.name}] COMPLETED. Processing done.`);
            await db.collection('linkedin_campaigns').updateOne({ _id: campaign._id }, { $set: { status: 'Completed', completedAt: new Date() } });
            return;
        }

        // Process Action
        context = await BrowserManager.getContext(account._id, 'linkedin', campaign.runWithoutProxy ? null : account.proxy);
        page = await context.newPage();

        if (actionType === 'connect') {
            await page.goto(targetContact.linkedinUrl || `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(targetContact.firstName + " " + targetContact.lastName)}`);
            await Humanoid.sleep(3000, 7000);
            
            // Connect Logic
            console.log(`[Campaign ${campaign.name}] Sending Connection Request to ${targetContact.firstName}`);
            
            // Log & Save
            await db.collection('linkedin_progress').insertOne({
                campaignId: campaign._id,
                contactId: targetContact._id,
                status: 'sent',
                step: 0,
                lastActionAt: new Date(),
                createdAt: new Date()
            });
            await db.collection('linkedin_logs').insertOne({ accountId: account._id, campaignId: campaign._id, action: "connection_request", timestamp: new Date() });
            await db.collection('linkedin_campaigns').updateOne({ _id: campaign._id }, { $inc: { sentCount: 1 } });
            
        } else if (actionType === 'message') {
             console.log(`[Campaign ${campaign.name}] Sending FollowUp Message to ${targetContact.firstName}`);
             const msgContent = campaign.sequences[currentStepId].message;
             
             await page.goto('https://www.linkedin.com/messaging/');
             await Humanoid.sleep(3000, 6000);

             await db.collection('linkedin_progress').updateOne({ _id: pDoc._id }, { $set: { step: currentStepId + 1, lastActionAt: new Date() } });
             await db.collection('linkedin_logs').insertOne({ accountId: account._id, campaignId: campaign._id, action: "message", timestamp: new Date() });
        } else if (actionType === 'visit_profile') {
             console.log(`[Campaign ${campaign.name}] Visiting Profile of ${targetContact.firstName}`);
             await page.goto(targetContact.linkedinUrl);
             await Humanoid.mouseWander(page, 10000, 20000);
             await db.collection('linkedin_progress').updateOne({ _id: pDoc._id }, { $set: { step: currentStepId + 1, lastActionAt: new Date() } });
        } else if (actionType === 'withdraw') {
             console.log(`[Campaign ${campaign.name}] Withdrawing Request for ${targetContact.firstName}`);
             await db.collection('linkedin_progress').updateOne({ _id: pDoc._id }, { $set: { status: 'withdrawn', step: currentStepId + 1, lastActionAt: new Date() } });
        }

        if (context) await context.close();

        const delayMs = getRandomDelayMs(campaign.minDelay || 10, campaign.maxDelay || 40);
        console.log(`[Worker] Campaign step done. Next action in ${(delayMs/1000).toFixed(1)}s.`);
        await db.collection('linkedin_campaigns').updateOne({ _id: campaign._id }, { $set: { nextRunAt: new Date(Date.now() + delayMs), lastActionType: 'campaign' } });

    } catch (err) {
        console.error(`[Worker Error] Campaign ${campaignId}:`, err);
        if (context) await context.close().catch(()=>null);
        if (client) {
            const db = client.db(process.env.MONGODB_DB || 'omniverse');
            await db.collection('linkedin_campaigns').updateOne({ _id: new ObjectId(campaignId) }, { $set: { nextRunAt: new Date(Date.now() + 120000), lastActionType: 'campaign' } });
        }
    } finally {
        if (client) await client.close();
    }
}

const worker = new Worker('linkedin-automation', processCampaignJob, {
    connection: redisConnection,
    concurrency: 2 // Max concurrency controlled
});

console.log("LinkedIn Worker Process Started (Queue-Based, Organic -> Campaign -> Organic)");

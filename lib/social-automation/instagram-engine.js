import { BrowserManager, Humanoid } from './browser-manager.js';
import { ObjectId } from 'mongodb';
import { loginToInstagram, executeOutreach } from '../automation/instagram.js';

export async function processInstagramCampaigns(db) {
    console.log("[Instagram] Starting cycle...");
    
    // 1. Get Active Campaigns
    const campaigns = await db.collection("instagram_campaigns").find({ status: "Active" }).toArray();
    console.log(`[Instagram] Found ${campaigns.length} active campaigns.`);

    for (const campaign of campaigns) {
        console.log(`[Instagram] Processing Campaign: ${campaign.name}`);
        
        // 2. Load Account
        const account = await db.collection("instagram_accounts").findOne({ _id: new ObjectId(campaign.accountId) });
        if (!account || account.status !== "Connected") {
            console.log(`  -> Account not connected or missing.`);
            continue;
        }

        // 3. Safety Checks & Date Boundaries strictly localized to Campaign Timezone
        const now = new Date();
        const tz = campaign.timezone || 'UTC';
        // 'en-CA' guarantees YYYY-MM-DD format dynamically mapped to the provided timezone
        const localNowString = now.toLocaleDateString('en-CA', { timeZone: tz });

        if (campaign.startDate && typeof campaign.startDate === 'string') {
            const startString = campaign.startDate.split('T')[0];
            if (localNowString < startString) {
                console.log(`  -> Campaign hasn't started yet (Local: ${localNowString} vs Target: ${startString}). Skipping.`);
                continue;
            }
        }
        
        if (campaign.endDate && typeof campaign.endDate === 'string') {
            const endString = campaign.endDate.split('T')[0];
            if (localNowString > endString) {
                console.log(`  -> Campaign expired (Local: ${localNowString} vs Target: ${endString}). Marking Completed.`);
                await db.collection("instagram_campaigns").updateOne({ _id: campaign._id }, { $set: { status: "Completed" } });
                continue;
            }
        }

        // 3.5 SMART SESSION SCHEDULING natively 
        if (campaign.nextSessionAt && now < new Date(campaign.nextSessionAt)) {
             console.log(`  -> Campaign is organically sleeping between sessions. Next session opens dynamically at: ${new Date(campaign.nextSessionAt).toLocaleTimeString()}`);
             continue;
        }

        // Zero out the time to check today limit
        const startOfDay = new Date(now);
        startOfDay.setHours(0,0,0,0);
        
        const dailyUsage = await db.collection("instagram_logs").countDocuments({
            accountId: account._id,
            action: { $in: ["message", "interaction"] },
            timestamp: { $gte: startOfDay }
        });

        const hourlyUsage = await db.collection("instagram_logs").countDocuments({
             accountId: account._id,
             action: { $in: ["message", "interaction"] },
             timestamp: { $gte: new Date(now.getTime() - 60*60*1000) }
        });

        const dailyLimit = campaign.dailyLimit || 40;
        const hourlyLimit = campaign.hourlyLimit || 10;
        
        if (dailyUsage >= dailyLimit) {
            console.log(`  -> Daily limit reached (${dailyUsage}/${dailyLimit})`);
            continue;
        }
        if (hourlyUsage >= hourlyLimit) {
            console.log(`  -> Hourly limit reached (${hourlyUsage}/${hourlyLimit})`);
            continue;
        }

        // Cap session leads iteratively to prevent blowing limits in a single tick
        const hourlyRemaining = hourlyLimit - hourlyUsage;
        
        // Smart Goal Calculation: Divide daily limit over an active 6-8 hour operating window
        // Example: 40 limit / 8 hours = 5 DMs per hour naturally.
        const idealSessionPace = Math.ceil(dailyLimit / 8); 
        const targetSessionLeads = Math.min(hourlyRemaining, Math.max(2, Math.floor(Math.random() * (idealSessionPace + 2)) + idealSessionPace - 1));
        
        console.log(`  -> Launching organic Bot Session natively locking Context for ~${targetSessionLeads} leads continuously...`);

        let igSession = null;
        let actualLeadsProcessed = 0;
        try {
            console.log(`  -> Restoring IG Native Headful Context for ${account.email || account.username}...`);
            const proxy = account.proxy || null;
            // Native function handles safe stealth headful operation, restored cookies seamlessly
            igSession = await loginToInstagram(account._id.toString(), account.email || account.username, account.password || "", proxy, false, null);

            if (!igSession || !igSession.success) {
                console.log(`  -> Login invalid/failed. Session might be expired.`);
                continue;
            }

            // ============================================
            // 1. WARMUP SESSION INJECTION natively reading CSV
            // ============================================
            const { executeWarmingAction } = await import('../automation/instagram-actions.js');
            console.log(`  -> [Scheduler] Executing pre-session CSV Warmup Action globally...`);
            await executeWarmingAction(igSession.page);

            for (let i = 0; i < targetSessionLeads; i++) {
                // 4. Fetch next lead sequentially
                const processedIds = (await db.collection("instagram_progress")
                    .find({ campaignId: campaign._id })
                    .project({ contactId: 1 })
                    .toArray()).map(p => p.contactId);
                
                const listIds = [
                    campaign.listId, 
                    campaign.listId.toString(), 
                    ObjectId.isValid(campaign.listId) ? new ObjectId(campaign.listId) : null
                ].filter(Boolean);

                const lead = await db.collection("contacts").findOne({ 
                    listId: { $in: listIds },
                    _id: { $nin: processedIds }
                });

                if (!lead) {
                    console.log(`  -> No more leads matched in list for this campaign.`);
                    if (campaign.endOnCompletion !== false) { // Default true
                        console.log(`  -> 'End on completion' is triggered. Marking campaign as Completed.`);
                        await db.collection("instagram_campaigns").updateOne({ _id: campaign._id }, { $set: { status: "Completed", updatedAt: new Date() } });
                    }
                    break;
                }

                const profileTarget = lead.instagramUrl || lead.instagram || lead.igUrl || lead.ig || lead.Instagram || lead.Account || lead.account;
                if (!profileTarget) {
                    console.log("    -> Skipped: No Instagram handle/URL found for lead.");
                    await db.collection("instagram_progress").insertOne({ campaignId: campaign._id, contactId: lead._id, status: "skipped", reason: "no_url" });
                    continue;
                }

                actualLeadsProcessed++;
                console.log(`  -> [Execution ${i+1}/${targetSessionLeads}] Processing target: ${profileTarget}`);

                let msg = campaign.message || '';
                
                // Dynamically replace mapped variables from the lead document!
                msg = msg.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, key) => {
                    const val = lead[key.trim()];
                    return (val !== undefined && val !== null) ? val : '';
                });
                
                // Fallback natively to support old variables if mistakenly typed:
                msg = msg.replace(/\{f_name\}/g, lead.firstName || '')
                         .replace(/\$\$f_name\$\$/g, lead.firstName || '')
                         .replace(/\$\$full_name\$\$/g, `${lead.firstName || ''} ${lead.lastName || ''}`.trim());

                const priorityOrder = campaign.executionPriority || ['story', 'highlight', 'message'];

                // 2. Main Payload Routine
                const result = await executeOutreach(igSession.page, profileTarget, msg, {
                    priorityOrder: priorityOrder,
                    mediaUrl: campaign.mediaUrl,
                    followBehavior: campaign.followBehavior || 'none',
                    likeBehavior: campaign.likeBehavior || 'none',
                    commentBehavior: campaign.commentBehavior || 'none'
                });

                if (result.success) {
                    console.log(`  -> Outreach Success via ${result.method}`);
                    await db.collection("instagram_logs").insertOne({
                        accountId: account._id,
                        campaignId: campaign._id,
                        contactId: lead._id,
                        action: "message",
                        method: result.method,
                        timestamp: new Date()
                    });
                    
                    await db.collection("instagram_progress").insertOne({
                        campaignId: campaign._id,
                        contactId: lead._id,
                        status: "sent",
                        method: result.method,
                        lastActionAt: new Date()
                    });
                    
                    await db.collection("instagram_campaigns").updateOne({ _id: campaign._id }, { $inc: { sentCount: 1 } });
                } else {
                    console.log(`  -> Outreach Failed: ${result.reason}`);
                    await db.collection("instagram_progress").insertOne({ campaignId: campaign._id, contactId: lead._id, status: "skipped", reason: result.reason });
                }

                // 3. Post-Action Cool down mapping sequentially CSV routines!
                if (i < targetSessionLeads - 1) { // If there's another lead coming up natively!
                     console.log(`  -> [Scheduler] Executing post-DM CSV Cooldown Action globally...`);
                     await executeWarmingAction(igSession.page);
                }
            } // END OF SESSION LOOP

        } catch (error) {
            console.error(`  -> execution session error: ${error.message}`);
        } finally {
            if (igSession && igSession.browser) {
                console.log(`  -> Terminating session window securely blocking repetition.`);
                await igSession.browser.close().catch(() => {});
            }
        }
        
        // SMART SCHEDULER: Schedule NEXT macro-session window iteratively mapped!
        if (actualLeadsProcessed > 0 && String(campaign.status).toLowerCase() !== "completed") {
            // Formula: 8 biological active hours over targeted hourly distribution mathematically
            const baseDelayMinutes = Math.floor((8 * 60) / (dailyLimit / Math.max(1, idealSessionPace)));
            const jitterMs = (Math.random() - 0.5) * 30 * 60000; // ± 15 mins scatter dynamically
            
            let nextSessionMs = Date.now() + (baseDelayMinutes * 60000) + jitterMs;
            if (nextSessionMs < Date.now() + (25 * 60000)) nextSessionMs = Date.now() + (25 * 60000); // 25 min minimum cool-down
            
            const nextDate = new Date(nextSessionMs);
            console.log(`  -> [Smart Scheduler] Macro-Session Concluded natively! Triggering biological cool-down. Next active session bound autonomously at: ${nextDate.toLocaleTimeString()}`);
            
            await db.collection("instagram_campaigns").updateOne(
                { _id: campaign._id },
                { $set: { nextSessionAt: nextDate } }
            );
        }
        
        console.log(`[Instagram] Waiting sequence delay...`);
        // Minimum delay between iterations natively
        await Humanoid.sleep(10000, 15000); 
    }
}

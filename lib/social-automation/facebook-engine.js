import { ObjectId } from 'mongodb';
import { loginToFacebook, executeOutreach } from '../automation/facebook.js';
import { Humanoid } from './browser-manager.js';

export async function processFacebookCampaigns(db) {
    console.log("[Facebook] Starting cycle...");
    
    // 1. Get Active Campaigns
    const campaigns = await db.collection("facebook_campaigns").find({ status: "Active" }).toArray();
    console.log(`[Facebook] Found ${campaigns.length} active campaigns.`);

    for (const campaign of campaigns) {
        console.log(`[Facebook] Processing Campaign: ${campaign.name}`);
        
        // 2. Load Account
        const account = await db.collection("facebook_accounts").findOne({ _id: new ObjectId(campaign.accountId) });
        if (!account || account.status !== "Connected") {
            console.log(`  -> Account not connected or missing.`);
            continue;
        }

        // 3. Date boundary and scheduler checks
        const now = new Date();
        const tz = campaign.timezone || 'UTC';
        const localNowString = now.toLocaleDateString('en-CA', { timeZone: tz });

        // Safe operational checks
        if (campaign.startDate && typeof campaign.startDate === 'string') {
            const startString = campaign.startDate.split('T')[0];
            if (localNowString < startString) {
                console.log(`  -> Campaign has not started yet. Skipping.`);
                continue;
            }
        }
        
        if (campaign.endDate && typeof campaign.endDate === 'string') {
            const endString = campaign.endDate.split('T')[0];
            if (localNowString > endString) {
                console.log(`  -> Campaign expired. Marking Completed.`);
                await db.collection("facebook_campaigns").updateOne({ _id: campaign._id }, { $set: { status: "Completed" } });
                continue;
            }
        }

        if (campaign.nextSessionAt && now < new Date(campaign.nextSessionAt)) {
             console.log(`  -> Campaign is sleeping. Next session dynamically starts at: ${new Date(campaign.nextSessionAt).toLocaleTimeString()}`);
             continue;
        }

        // Check daily limit
        const startOfDay = new Date(now);
        startOfDay.setHours(0,0,0,0);
        
        const dailyUsage = await db.collection("facebook_logs").countDocuments({
            accountId: account._id,
            action: { $in: ["message", "interaction"] },
            timestamp: { $gte: startOfDay }
        });

        const dailyLimit = campaign.dailyLimit || 30;
        if (dailyUsage >= dailyLimit) {
            console.log(`  -> Daily limit reached (${dailyUsage}/${dailyLimit})`);
            continue;
        }

        // Launch Browser Session
        let fbSession = null;
        let actualLeadsProcessed = 0;
        try {
            console.log(`  -> Connecting headful FB session for ${account.email || account.username}...`);
            const proxy = account.proxy || null;
            fbSession = await loginToFacebook(account._id.toString(), account.email || account.username, account.password || "", proxy, false, null);

            if (!fbSession || !fbSession.success) {
                console.log(`  -> FB Login invalid or failed.`);
                continue;
            }

            // ============================================
            // 0. RUN INBOX CLOSER DMs SCAN & REPLY
            // ============================================
            try {
                const { runInboxCloserSession } = await import('./closer-processor.js');
                await runInboxCloserSession(db, 'facebook', account, fbSession.page, campaign);
            } catch (closerErr) {
                console.error("  -> Inbox Closer Error:", closerErr);
            }

            // Target lead outreach loop
            const targetSessionLeads = Math.min(5, dailyLimit - dailyUsage); // Safe limit per execution cycle
            
            for (let i = 0; i < targetSessionLeads; i++) {
                // Fetch next lead
                const processedIds = (await db.collection("facebook_progress")
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
                    console.log(`  -> No more leads matched in campaign contacts.`);
                    if (campaign.endOnCompletion !== false) {
                        await db.collection("facebook_campaigns").updateOne({ _id: campaign._id }, { $set: { status: "Completed", updatedAt: new Date() } });
                    }
                    break;
                }

                const profileTarget = lead.facebookUrl || lead.facebook || lead.fbUrl || lead.fb || lead.Facebook || lead.profileUrl;
                if (!profileTarget) {
                    await db.collection("facebook_progress").insertOne({ campaignId: campaign._id, contactId: lead._id, status: "skipped", reason: "no_url" });
                    continue;
                }

                actualLeadsProcessed++;
                console.log(`  -> [FB Outreach ${i+1}/${targetSessionLeads}] Target: ${profileTarget}`);

                let msg = campaign.message || '';
                msg = msg.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, key) => {
                    const val = lead[key.trim()];
                    return (val !== undefined && val !== null) ? val : '';
                });

                const result = await executeOutreach(fbSession.page, profileTarget, msg);

                if (result.success) {
                    console.log(`  -> FB Outreach Success via ${result.method}`);
                    await db.collection("facebook_logs").insertOne({
                        accountId: account._id,
                        campaignId: campaign._id,
                        contactId: lead._id,
                        action: "message",
                        method: result.method,
                        timestamp: new Date()
                    });
                    
                    await db.collection("facebook_progress").insertOne({
                        campaignId: campaign._id,
                        contactId: lead._id,
                        status: "sent",
                        method: result.method,
                        lastActionAt: new Date()
                    });
                    
                    await db.collection("facebook_campaigns").updateOne({ _id: campaign._id }, { $inc: { sentCount: 1 } });
                } else {
                    console.log(`  -> FB Outreach Failed: ${result.reason}`);
                    await db.collection("facebook_progress").insertOne({ campaignId: campaign._id, contactId: lead._id, status: "skipped", reason: result.reason });
                }

                await Humanoid.sleep(12000, 25000); // Safe delay between lead actions
            }

        } catch (error) {
            console.error(`  -> Facebook engine session error: ${error.message}`);
        } finally {
            if (fbSession && fbSession.browser) {
                await fbSession.browser.close().catch(() => {});
            }
        }

        // Biological sleep scheduler
        if (actualLeadsProcessed > 0 && String(campaign.status).toLowerCase() !== "completed") {
            const nextSessionMs = Date.now() + 45 * 60000; // biological 45 min cool-down
            await db.collection("facebook_campaigns").updateOne(
                { _id: campaign._id },
                { $set: { nextSessionAt: new Date(nextSessionMs) } }
            );
        }
        
        await Humanoid.sleep(8000, 15000);
    }
}

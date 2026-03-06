
import { BrowserManager, Humanoid } from './browser-manager.js';
import { ObjectId } from 'mongodb';

export async function processLinkedInCampaigns(db) {
    console.log("[LinkedIn] Starting cycle...");
    
    // 1. Get Active Campaigns
    const campaigns = await db.collection("linkedin_campaigns").find({ status: "Active" }).toArray();
    console.log(`[LinkedIn] Found ${campaigns.length} active campaigns.`);

    for (const campaign of campaigns) {
        console.log(`[LinkedIn] Processing Campaign: ${campaign.name}`);
        
        // 2. Load Account
        const account = await db.collection("linkedin_accounts").findOne({ _id: new ObjectId(campaign.accountId) });
        if (!account || account.status !== "Connected") {
            console.log(`  -> Account not connected or missing.`);
            continue;
        }

        // 3. Safety Checks (Time window, Daily Limit)
        const now = new Date();
        const dailyUsage = await db.collection("linkedin_logs").countDocuments({
            accountId: account._id,
            action: { $in: ["connection_request", "message"] },
            timestamp: { $gte: new Date(now.setHours(0,0,0,0)) }
        });

        if (dailyUsage >= (campaign.dailyLimit || 20)) {
            console.log(`  -> Daily limit reached (${dailyUsage}/${campaign.dailyLimit || 20})`);
            continue;
        }

        // 4. Launch Capsule
        let context = null;
        try {
            context = await BrowserManager.getContext(account._id, 'linkedin', account.proxy);
            const page = await context.newPage();
            
            // Login Check / Restore
            console.log(`  -> Navigating to LinkedIn...`);
            await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' });
            await Humanoid.sleep(3000, 5000);

            if (page.url().includes("login") || page.url().includes("signup")) {
                console.log(`  -> Logged out. Attempting to restore cookies if implemented or fail.`);
                // In a real implementation, we would handle re-login here using decrypted credentials from DB
                // For now, we assume the persistent context keeps us logged in or we fail safely
                 console.log(`  -> Session invalid. Mark account as Disconnected.`);
                 await db.collection("linkedin_accounts").updateOne(
                     { _id: account._id }, 
                     { $set: { status: "Disconnected", failureReason: "Session expired during worker run" } }
                 );
                 await context.close();
                 continue;
            }

            // 5. Execute Campaign Step
            // Fetch next lead
            const processedIds = (await db.collection("linkedin_progress").find({ campaignId: campaign._id }).project({ contactId: 1 }).toArray()).map(p => p.contactId);
            const lead = await db.collection("contacts").findOne({ 
                listId: new ObjectId(campaign.listId),
                _id: { $nin: processedIds }
            });

            if (!lead) {
                console.log(`  -> No more leads in list.`);
                // Close context and continue to next campaign
                await context.close();
                continue;
            }

            // ... (rest of the logic remains same, just ensuring correct syntax) ...

            console.log(`  -> Processing Lead: ${lead.firstName} ${lead.lastName} (${lead.linkedinUrl || 'No URL'})`);

            if (!lead.linkedinUrl) {
                console.log("    -> Skipped: No LinkedIn URL");
                await db.collection("linkedin_progress").insertOne({ campaignId: campaign._id, contactId: lead._id, status: "skipped", reason: "no_url" });
                await context.close();
                continue;
            }

            // Navigate to Profile
            await page.goto(lead.linkedinUrl, { waitUntil: 'domcontentloaded' });
            await Humanoid.sleep(5000, 10000); // Random delay to mimic reading
            await Humanoid.scroll(page);

            // ACTION: Connect
            // Check if already connected
            const connectBtn = await page.$('button >> text="Connect"');
            const pendingBtn = await page.$('button >> text="Pending"');
            
            if (pendingBtn) {
                 console.log("    -> Already Pending.");
                 await db.collection("linkedin_progress").insertOne({ campaignId: campaign._id, contactId: lead._id, status: "skipped", reason: "pending" });
            } else if (connectBtn) {
                console.log("    -> Clicking Connect...");
                await connectBtn.click();
                await Humanoid.sleep(2000, 4000);
                
                // Modal
                if (campaign.connectionNote) {
                    const addNoteBtn = await page.$('button >> text="Add a note"');
                    if (addNoteBtn) {
                        await addNoteBtn.click();
                        await Humanoid.sleep(1000, 2000);
                        const note = campaign.connectionNote
                            .replace('$$f_name$$', lead.firstName || '')
                            .replace('$$full_name$$', `${lead.firstName || ''} ${lead.lastName || ''}`.trim());
                        
                        await Humanoid.type(page, 'textarea[name="message"]', note);
                        await Humanoid.sleep(2000, 3000);
                    }
                }

                const sendBtn = await page.$('button >> text="Send"');
                if (sendBtn) {
                    await sendBtn.click();
                    console.log("    -> Connection Request Sent.");
                    
                    // Log
                    await db.collection("linkedin_logs").insertOne({
                        accountId: account._id,
                        campaignId: campaign._id,
                        contactId: lead._id,
                        action: "connection_request",
                        timestamp: new Date()
                    });
                    
                    await db.collection("linkedin_progress").insertOne({
                        campaignId: campaign._id,
                        contactId: lead._id,
                        status: "sent",
                        step: 0,
                        lastActionAt: new Date()
                    });
                    
                    await db.collection("linkedin_campaigns").updateOne({ _id: campaign._id }, { $inc: { sentCount: 1 } });
                }
            } else {
                console.log("    -> Connect button not found (Already connected or locked).");
                // Verify if legitimate "Message" button exists (already connected)
                // If yes, maybe we can proceed to messaging if configured?
                // For now, skip.
                await db.collection("linkedin_progress").insertOne({ campaignId: campaign._id, contactId: lead._id, status: "skipped", reason: "check_profile" });
            }

            // Close context after single action (Sequential One-by-One isolation)
            await context.close();

        } catch (error) {
            console.error(`  -> execution error: ${error.message}`);
            if (context) await context.close();
        }
        
        // Wait between campaigns
        await Humanoid.sleep(5000, 10000);
    }
}

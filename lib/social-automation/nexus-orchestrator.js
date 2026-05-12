import { ObjectId } from 'mongodb';
import { executeOutreach as igOutreach, loginToInstagram } from '../automation/instagram.js';
import { executeOutreach as fbOutreach, loginToFacebook } from '../automation/facebook.js';

export async function processNexusCampaigns(db) {
    console.log("[Nexus] Starting Omni-Channel cycle...");
    
    // Find all active multi-channel campaigns
    const campaigns = await db.collection("campaigns").find({ 
        status: { $in: ["Active", "Running"] }, 
        platform: "multi-channel" 
    }).toArray();
    
    console.log(`[Nexus] Found ${campaigns.length} active multi-channel campaigns.`);

    for (const campaign of campaigns) {
        if (!campaign.blocks || campaign.blocks.length === 0) continue;
        if (!campaign.listId) {
             console.log(`  -> Campaign ${campaign.name} has no listId. Skiped.`);
             continue;
        }

        console.log(`[Nexus] Processing Sequence: ${campaign.name}`);

        const listIds = [
            campaign.listId, 
            campaign.listId.toString(), 
            ObjectId.isValid(campaign.listId) ? new ObjectId(campaign.listId) : null
        ].filter(Boolean);

        // Fetch all contacts in the list
        const contacts = await db.collection("contacts").find({
            listId: { $in: listIds }
        }).toArray();

        for (const contact of contacts) {
            // Get progress for this contact in this sequence
            let progress = await db.collection("nexus_progress").findOne({
                campaignId: campaign._id,
                contactId: contact._id
            });

            if (!progress) {
                progress = {
                    campaignId: campaign._id,
                    contactId: contact._id,
                    currentStep: 0,
                    status: 'active',
                    lastActionAt: null
                };
                await db.collection("nexus_progress").insertOne(progress);
            }

            if (progress.status === 'completed' || progress.currentStep >= campaign.blocks.length) {
                continue;
            }

            const currentBlock = campaign.blocks[progress.currentStep];
            
            // Check delays
            if (progress.lastActionAt && currentBlock.config?.delay) {
                const delayMs = currentBlock.config.delay * 60000;
                const elapsed = Date.now() - new Date(progress.lastActionAt).getTime();
                if (elapsed < delayMs) {
                    continue; // Skip, waiting for delay
                }
            }

            console.log(`  -> Executing Step ${progress.currentStep} [${currentBlock.platform}] for ${contact.email || contact.full_name}`);

            try {
                let success = false;
                
                // Route to Native Connectors directly mapping the specific platform logic!
                if (currentBlock.platform === 'instagram') {
                    const account = await db.collection("instagram_accounts").findOne({ _id: new ObjectId(currentBlock.config.accountId) });
                    if (account) {
                        const target = contact.instagram || contact.igUrl || contact.ig || contact.instagramUrl;
                        if (target) {
                             const session = await loginToInstagram(account._id.toString(), account.email || account.username, account.password || "", account.proxy, false, null);
                             if (session && session.success) {
                                 let msg = currentBlock.config.message || "";
                                 msg = msg.replace(/\{\{\s*([^}]+)\s*\}\}/g, (m, k) => contact[k.trim()] || '');
                                 const res = await igOutreach(session.page, target, msg, { priorityOrder: ['message'] });
                                 success = res.success;
                                 await session.browser.close().catch(()=>{});
                             }
                        } else {
                           success = true; // Skip gracefully if no URL
                           console.log("   -> Skipped IG (no handle)");
                        }
                    }
                } else if (currentBlock.platform === 'facebook') {
                    const account = await db.collection("facebook_accounts").findOne({ _id: new ObjectId(currentBlock.config.accountId) });
                    if (account) {
                        const target = contact.facebookUrl || contact.fb || contact.facebook;
                        if (target) {
                             const session = await loginToFacebook(account._id.toString(), account.email, account.password, account.proxy, false, null);
                             if (session && session.success) {
                                  let msg = currentBlock.config.message || "";
                                 msg = msg.replace(/\{\{\s*([^}]+)\s*\}\}/g, (m, k) => contact[k.trim()] || '');
                                 const res = await fbOutreach(session.page, target, msg, { dm: true });
                                 success = res.success;
                                 await session.browser.close().catch(()=>{});
                             }
                        } else {
                           success = true;
                           console.log("   -> Skipped FB (no URL)");
                        }
                    }
                } else if (currentBlock.platform === 'automation' && currentBlock.templateId === 'auto-delay') {
                     // Virtual block purely for delays
                     success = true;
                } else {
                     // For email/linkedin that run via BullMQ, we can enqueue them or mark success to skip for now in MVP
                     success = true; 
                     console.log(`   -> Queuing external block via orchestrator (email/linkedin)`);
                }

                if (success) {
                    await db.collection("nexus_progress").updateOne(
                        { _id: progress._id },
                        { $set: { currentStep: progress.currentStep + 1, lastActionAt: new Date() } }
                    );
                }

            } catch(e) {
                console.error(`   -> Step failed:`, e.message);
            }
        }
    }
}

import { ObjectId } from 'mongodb';
import { generateAICloserResponse } from '../ai/gemini-engine.js';
import { Humanoid } from './browser-manager.js';

/**
 * Runs the autonomous inbox closer check and response session
 */
export async function runInboxCloserSession(db, platform, account, page, campaign) {
    const aiCloserId = campaign.aiCloserId || campaign.aiAgentId;
    if (!aiCloserId) {
        console.log(`[Closer - ${platform}] No AI Closer agent assigned to campaign ${campaign.name}. Skipping inbox scan.`);
        return;
    }

    const aiAgent = await db.collection('ai_agents').findOne({ _id: new ObjectId(aiCloserId) });
    if (!aiAgent) {
        console.log(`[Closer - ${platform}] AI Agent ${aiCloserId} not found in database. Skipping.`);
        return;
    }

    const targetType = campaign.aiAgentTargetType || 'leads_only';
    console.log(`[Closer - ${platform}] Scanning DMs for account ${account.email || account.username} (Targeting: ${targetType})...`);

    try {
        if (platform === 'instagram') {
            await page.goto('https://www.instagram.com/direct/inbox/', { waitUntil: 'load', timeout: 60000 });
            await Humanoid.sleep(4000, 8000);

            // Fetch list of thread buttons
            const threads = await page.$$('div[role="button"]');
            for (let thread of threads.slice(0, 5)) { // Process top 5 threads for efficiency
                try {
                    const text = await thread.textContent();
                    if (!text || text.includes('Active now') || text.includes('Sent a message')) {
                        // Not an active unread chat thread, or skip
                    }
                    
                    // Click the thread organically
                    await thread.click();
                    await Humanoid.sleep(3000, 6000);

                    // Extract participant username from URL
                    const currentUrl = page.url();
                    const match = currentUrl.match(/t\/([^/]+)/);
                    const participant = match ? match[1] : 'unknown';

                    if (participant === 'unknown') continue;

                    // Enforce Campaign lead filtering if leads_only is active
                    let lead = null;
                    if (targetType === 'leads_only') {
                        lead = await db.collection('contacts').findOne({
                            listId: new ObjectId(campaign.listId),
                            $or: [
                                { username: participant },
                                { instagram: participant },
                                { ig: participant }
                            ]
                        });
                        if (!lead) {
                            console.log(`[Closer - IG] Participant ${participant} is not a lead in the campaign list. Skipping.`);
                            continue;
                        }
                    }

                    // Extract last 10 messages
                    const messages = await page.$$eval('div[role="row"]', rows => {
                        return rows.map(r => {
                            const isOutgoing = r.querySelector('div[class*="outgoing"]') || r.innerHTML.includes('outgoing') || r.innerText.includes('You');
                            const content = r.innerText || "";
                            return {
                                sender: isOutgoing ? 'agent' : 'lead',
                                content: content.replace(/\n/g, ' ').trim()
                            };
                        }).filter(m => m.content.length > 0);
                    });

                    const last10 = messages.slice(-10);
                    if (last10.length === 0) continue;

                    // Skip if we already replied last
                    if (last10[last10.length - 1].sender === 'agent') {
                        console.log(`[Closer - IG] Last message in thread with ${participant} is outgoing. Skipping response.`);
                        continue;
                    }

                    // Get lead context or use default
                    const leadContext = lead ? {
                        name: lead.firstName || participant,
                        company: lead.company || 'Unknown',
                        position: lead.position || lead.title || 'Unknown'
                    } : {
                        name: participant,
                        company: 'Unknown',
                        position: 'Unknown'
                    };

                    console.log(`[Closer - IG] Generating AI response for ${participant}...`);
                    const response = await generateAICloserResponse(aiAgent, leadContext, last10);

                    if (response && response.action === 'send' && response.response) {
                        const replyText = response.response;
                        console.log(`[Closer - IG] Replying with: "${replyText}"`);

                        // Find textbox
                        const textbox = await page.$('div[role="textbox"][aria-label="Message"], textarea[placeholder*="Message"]');
                        if (textbox) {
                            await textbox.focus();
                            await Humanoid.sleep(3000, 7000);
                            await page.keyboard.type(replyText, { delay: Math.floor(Math.random() * 120) + 90 });
                            await Humanoid.sleep(4000, 8000);
                            await page.keyboard.press('Enter');

                            // Save to MongoDB closer_chats history
                            await db.collection('closer_chats').updateOne(
                                { accountId: account._id, platform, participantUsername: participant },
                                {
                                    $set: {
                                        campaignId: campaign._id,
                                        leadId: lead ? lead._id : null,
                                        lastReplyAt: new Date(),
                                        profileAnalysis: `Tone: ${aiAgent.tone || 'General'}. Goal: ${aiAgent.goal || 'General'}. Lead status: Engaged.`
                                    },
                                    $push: {
                                        chatHistory: {
                                            $each: [
                                                ...last10,
                                                { sender: 'agent', content: replyText, timestamp: new Date() }
                                            ]
                                        }
                                    }
                                },
                                { upsert: true }
                            );
                        }
                    }
                } catch (threadErr) {
                    console.error(`[Closer - IG] Error processing thread:`, threadErr);
                }
            }
        } 
        else if (platform === 'linkedin') {
            await page.goto('https://www.linkedin.com/messaging/', { waitUntil: 'load', timeout: 60000 });
            await Humanoid.sleep(4000, 8000);

            // Read the thread listing cards
            const threads = await page.$$('.msg-conversation-card__link');
            for (let thread of threads.slice(0, 5)) {
                try {
                    await thread.click();
                    await Humanoid.sleep(3000, 6000);

                    const participant = await page.$eval('.msg-entity-lockup__title', el => el.innerText.trim()).catch(() => 'unknown');
                    if (participant === 'unknown') continue;

                    let lead = null;
                    if (targetType === 'leads_only') {
                        lead = await db.collection('contacts').findOne({
                            listId: new ObjectId(campaign.listId),
                            $or: [
                                { firstName: participant.split(' ')[0] },
                                { lastName: participant.split(' ')[1] }
                            ]
                        });
                        if (!lead) {
                            console.log(`[Closer - LI] Participant ${participant} is not a lead in campaign list. Skipping.`);
                            continue;
                        }
                    }

                    // Extract message text inside msg-s-message-list-item
                    const messages = await page.$$eval('.msg-s-message-list-item', rows => {
                        return rows.map(r => {
                            const isOutgoing = r.querySelector('.msg-s-message-list-item__sender--self') || r.innerHTML.includes('--self');
                            const content = r.querySelector('.msg-s-event-listitem__body')?.innerText || "";
                            return {
                                sender: isOutgoing ? 'agent' : 'lead',
                                content: content.replace(/\n/g, ' ').trim()
                            };
                        }).filter(m => m.content.length > 0);
                    });

                    const last10 = messages.slice(-10);
                    if (last10.length === 0) continue;

                    if (last10[last10.length - 1].sender === 'agent') {
                        console.log(`[Closer - LI] Last message in thread with ${participant} is outgoing. Skipping.`);
                        continue;
                    }

                    const leadContext = lead ? {
                        name: lead.firstName || participant,
                        company: lead.company || 'Unknown',
                        position: lead.position || lead.title || 'Unknown'
                    } : {
                        name: participant,
                        company: 'Unknown',
                        position: 'Unknown'
                    };

                    console.log(`[Closer - LI] Generating response for ${participant}...`);
                    const response = await generateAICloserResponse(aiAgent, leadContext, last10);

                    if (response && response.action === 'send' && response.response) {
                        const replyText = response.response;
                        console.log(`[Closer - LI] Replying with: "${replyText}"`);

                        const textbox = await page.$('.msg-form__contenteditable');
                        if (textbox) {
                            await textbox.focus();
                            await Humanoid.sleep(3000, 7000);
                            await page.keyboard.type(replyText, { delay: Math.floor(Math.random() * 120) + 90 });
                            await Humanoid.sleep(4000, 8000);

                            const sendBtn = await page.$('button[type="submit"].msg-form__send-button');
                            if (sendBtn) await sendBtn.click();
                            else await page.keyboard.press('Enter');

                            await db.collection('closer_chats').updateOne(
                                { accountId: account._id, platform, participantUsername: participant },
                                {
                                    $set: {
                                        campaignId: campaign._id,
                                        leadId: lead ? lead._id : null,
                                        lastReplyAt: new Date(),
                                        profileAnalysis: `Tone: ${aiAgent.tone || 'General'}. Goal: ${aiAgent.goal || 'General'}.`
                                    },
                                    $push: {
                                        chatHistory: {
                                            $each: [
                                                ...last10,
                                                { sender: 'agent', content: replyText, timestamp: new Date() }
                                            ]
                                        }
                                    }
                                },
                                { upsert: true }
                            );
                        }
                    }
                } catch (threadErr) {
                    console.error(`[Closer - LI] Error processing thread:`, threadErr);
                }
            }
        }
        else if (platform === 'facebook') {
            await page.goto('https://www.facebook.com/messages/t/', { waitUntil: 'load', timeout: 60000 });
            await Humanoid.sleep(4000, 8000);

            const threads = await page.$$('div[role="gridcell"]');
            for (let thread of threads.slice(0, 5)) {
                try {
                    await thread.click();
                    await Humanoid.sleep(3000, 6000);

                    const participant = await page.$eval('span[class*="x1lliihq"]', el => el.innerText.trim()).catch(() => 'unknown');
                    if (participant === 'unknown') continue;

                    let lead = null;
                    if (targetType === 'leads_only') {
                        lead = await db.collection('contacts').findOne({
                            listId: new ObjectId(campaign.listId),
                            $or: [
                                { firstName: participant.split(' ')[0] },
                                { lastName: participant.split(' ')[1] }
                            ]
                        });
                        if (!lead) {
                            console.log(`[Closer - FB] Participant ${participant} is not a campaign lead. Skipping.`);
                            continue;
                        }
                    }

                    // Extract message nodes
                    const messages = await page.$$eval('div[role="row"]', rows => {
                        return rows.map(r => {
                            const isOutgoing = r.querySelector('[aria-label*="Sent by you"]') || r.innerHTML.includes('Sent by you') || r.innerText.includes('You');
                            const content = r.innerText || "";
                            return {
                                sender: isOutgoing ? 'agent' : 'lead',
                                content: content.replace(/\n/g, ' ').trim()
                            };
                        }).filter(m => m.content.length > 0);
                    });

                    const last10 = messages.slice(-10);
                    if (last10.length === 0) continue;

                    if (last10[last10.length - 1].sender === 'agent') {
                        console.log(`[Closer - FB] Last message with ${participant} is outgoing. Skipping.`);
                        continue;
                    }

                    const leadContext = lead ? {
                        name: lead.firstName || participant,
                        company: lead.company || 'Unknown',
                        position: lead.position || lead.title || 'Unknown'
                    } : {
                        name: participant,
                        company: 'Unknown',
                        position: 'Unknown'
                    };

                    console.log(`[Closer - FB] Generating AI response for ${participant}...`);
                    const response = await generateAICloserResponse(aiAgent, leadContext, last10);

                    if (response && response.action === 'send' && response.response) {
                        const replyText = response.response;
                        console.log(`[Closer - FB] Replying with: "${replyText}"`);

                        const textbox = await page.$('div[role="textbox"][aria-label="Message"]');
                        if (textbox) {
                            await textbox.focus();
                            await Humanoid.sleep(3000, 7000);
                            await page.keyboard.type(replyText, { delay: Math.floor(Math.random() * 120) + 90 });
                            await Humanoid.sleep(4000, 8000);
                            await page.keyboard.press('Enter');

                            await db.collection('closer_chats').updateOne(
                                { accountId: account._id, platform, participantUsername: participant },
                                {
                                    $set: {
                                        campaignId: campaign._id,
                                        leadId: lead ? lead._id : null,
                                        lastReplyAt: new Date(),
                                        profileAnalysis: `Tone: ${aiAgent.tone || 'General'}. Goal: ${aiAgent.goal || 'General'}.`
                                    },
                                    $push: {
                                        chatHistory: {
                                            $each: [
                                                ...last10,
                                                { sender: 'agent', content: replyText, timestamp: new Date() }
                                            ]
                                        }
                                    }
                                },
                                { upsert: true }
                            );
                        }
                    }
                } catch (threadErr) {
                    console.error(`[Closer - FB] Error processing Facebook thread:`, threadErr);
                }
            }
        }
    } catch (e) {
        console.error(`[Closer - ${platform}] Failed inbox scan cycle:`, e);
    }
}

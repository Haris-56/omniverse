
import { MongoClient, ObjectId } from 'mongodb';
import { emailQueue } from './email-queue.js';
import { logSystemEvent } from '../logger.js';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

async function runScheduler() {
    console.log(`[${new Date().toISOString()}] ⏰ Running Scheduler...`);
    let client;

    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB || 'omniverse');

        const campaigns = await db.collection('email_campaigns').find({ status: 'Active' }).toArray();
        console.log(`Found ${campaigns.length} active campaigns.`);

        for (const campaign of campaigns) {
            console.log(`Checking Campaign: ${campaign.name} (${campaign._id})`);
            
            // Wait for true random delay added by the worker
            if (campaign.nextRunAt && new Date() < new Date(campaign.nextRunAt)) {
                console.log(`[SKIP] Campaign ${campaign.name} is waiting for its next scheduled run.`);
                continue;
            }
            
            // Allow the worker to handle the pacing, limits, and sending.
            // We just trigger the campaign if it's not already queued.
            
            // To prevent duplicates, we use the campaign ID as the BullMQ jobId.
            // If the job is already waiting or active, BullMQ ignores the add command.
            // But wait, the worker removes it on complete, meaning it can be re-added later, which is perfect since the worker itself adds delays.
            // So the scheduler just acts as a watchdog to start campaigns if they die or when they first activate.
            
            try {
                await emailQueue.add('process-campaign', 
                    { campaignId: campaign._id.toString() }, 
                    { 
                        jobId: `watchdog-${campaign._id.toString()}`, // Single global job per campaign
                        removeOnComplete: true,
                        removeOnFail: true,
                    }
                );
            } catch (qErr) {
                // Ignore duplicate job ID errors or log them
            }
        }
    } catch (err) {
        console.error("Scheduler Error:", err);
    } finally {
        if (client) await client.close();
    }
}

setInterval(runScheduler, 60000); 
console.log("Email Scheduler Started (Refactored & Stabilized)");
runScheduler();

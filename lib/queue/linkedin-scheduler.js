import { MongoClient } from 'mongodb';
import { linkedinQueue } from './linkedin-queue.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

async function runScheduler() {
    console.log(`[${new Date().toISOString()}] ⏰ Running LinkedIn Scheduler...`);
    let client;

    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB || 'omniverse');

        const campaigns = await db.collection('linkedin_campaigns').find({ status: 'Active' }).toArray();
        console.log(`[LinkedIn] Found ${campaigns.length} active campaigns.`);

        for (const campaign of campaigns) {
            if (campaign.nextRunAt && new Date() < new Date(campaign.nextRunAt)) {
                continue;
            }
            
            try {
                await linkedinQueue.add('process-linkedin-campaign', 
                    { campaignId: campaign._id.toString() }, 
                    { 
                        jobId: `watchdog-li-${campaign._id.toString()}`,
                        removeOnComplete: true,
                        removeOnFail: true,
                    }
                );
            } catch (qErr) {}
        }
    } catch (err) {
        console.error("LinkedIn Scheduler Error:", err);
    } finally {
        if (client) await client.close();
    }
}

setInterval(runScheduler, 45000); 
console.log("LinkedIn Scheduler Started");
runScheduler();

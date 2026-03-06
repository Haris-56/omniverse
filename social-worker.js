import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { MongoClient } from 'mongodb';
import { processLinkedInCampaigns } from './lib/social-automation/linkedin-engine.js';
import { processFacebookCampaigns } from './lib/social-automation/facebook-engine.js';
import { processInstagramCampaigns } from './lib/social-automation/instagram-engine.js';

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/omniverse";
// Run cycle every 10-20 minutes to be safe/casual?
// Instructions: "Activity windows drift daily... No streaks". 
// A tight loop checking limits is fine, but the engine handles the "1 action per run".
const TICK_RATE = 5 * 60 * 1000; // 5 minutes

async function runSocialWorker() {
    console.log(`[${new Date().toISOString()}] 🤖 Social Worker Tick...`);
    let client;

    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db();

        // Run Engines Sequentially
        try { await processLinkedInCampaigns(db); } catch (e) { console.error("LinkedIn Engine Error:", e); }
        try { await processFacebookCampaigns(db); } catch (e) { console.error("Facebook Engine Error:", e); }
        try { await processInstagramCampaigns(db); } catch (e) { console.error("Instagram Engine Error:", e); }

    } catch (err) {
        console.error("FATAL SOCIAL WORKER ERROR:", err);
    } finally {
        if (client) await client.close();
    }
}

console.log("Starting Social Automation Worker...");
runSocialWorker();
setInterval(runSocialWorker, TICK_RATE);

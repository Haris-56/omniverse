import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { MongoClient } from 'mongodb';
import { processFacebookCampaigns } from './lib/social-automation/facebook-engine.js';
import { processInstagramCampaigns } from './lib/social-automation/instagram-engine.js';

// Import new queue-based LinkedIn engine
import './lib/queue/linkedin-worker.js';
import './lib/queue/linkedin-scheduler.js';

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/omniverse";

async function runSocialWorker() {
    console.log(`[${new Date().toISOString()}] 🤖 Social Worker Tick (FB/IG)...`);
    let client;

    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB || "omniverse");

        // Run Engines Sequentially (except LI which runs via BullMQ now)
        try { await processFacebookCampaigns(db); } catch (e) { console.error("Facebook Engine Error:", e); }
        try { await processInstagramCampaigns(db); } catch (e) { console.error("Instagram Engine Error:", e); }
        try {
            const { processNexusCampaigns } = await import('./lib/social-automation/nexus-orchestrator.js');
            await processNexusCampaigns(db);
        } catch (e) { console.error("Nexus Engine Error:", e); }

    } catch (err) {
        console.error("FATAL SOCIAL WORKER ERROR:", err);
    } finally {
        if (client) await client.close();
    }
}

function scheduleNextRun() {
    const randomMinutes = Math.floor(Math.random() * 10) + 1; // 1 to 10 minutes
    const TICK_RATE = randomMinutes * 60 * 1000;
    console.log(`\n[Scheduler] Sleeping securely. Next Autonomous cycle in ${randomMinutes} mins...`);
    
    setTimeout(() => {
        runSocialWorker().finally(scheduleNextRun);
    }, TICK_RATE);
}

console.log("Starting Autonomous Social Intelligence Worker...");
runSocialWorker().finally(scheduleNextRun);

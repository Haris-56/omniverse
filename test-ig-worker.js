import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { MongoClient } from 'mongodb';
import { processInstagramCampaigns } from './lib/social-automation/instagram-engine.js';

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/omniverse";

async function runTestWorker() {
    console.log(`[${new Date().toISOString()}] 🤖 Testing Autonomous IG Worker Tick...`);
    let client;

    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB || 'omniverse');

        // Force run ONLY the Instagram workflow mapped in engine
        await processInstagramCampaigns(db);

        console.log(`[Validation] Autonomous engine finished its cycle tick properly in stealth.`);
    } catch (err) {
        console.error("[Worker Core Crash]:", err);
    } finally {
        if (client) await client.close();
        process.exit(0);
    }
}

runTestWorker();

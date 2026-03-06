import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { MongoClient } from 'mongodb';
import { runReconCycle } from './lib/system-recon/recon-engine.js';

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/omniverse";
const TICK_RATE = 10 * 60 * 1000; // 10 minutes (Slow & Stealthy)

async function runReconWorker() {
    console.log(`[${new Date().toISOString()}] 🕵️ Recon Worker Tick...`);
    let client;

    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db();

        await runReconCycle(db);

    } catch (err) {
        console.error("FATAL RECON WORKER ERROR:", err);
    } finally {
        if (client) await client.close();
    }
}

console.log("Starting System Recon Worker...");
runReconWorker();
setInterval(runReconWorker, TICK_RATE);

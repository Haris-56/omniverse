import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/omniverse";

async function reset() {
    let client;
    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB || 'omniverse');

        await db.collection("instagram_progress").deleteMany({});
        console.log("Deleted all instagram progress to re-test the campaign natively.");

    } catch (err) {
        console.error(err);
    } finally {
        if (client) await client.close();
        process.exit(0);
    }
}

reset();

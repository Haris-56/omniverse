import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { MongoClient, ObjectId } from 'mongodb';

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/omniverse";

async function check() {
    let client;
    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB || 'omniverse');

        const campaigns = await db.collection("instagram_campaigns").find({}).toArray();
        console.log("All campaigns:");
        campaigns.forEach(c => {
           console.log(`ID: ${c._id}, Name: ${c.name}, Status: ${c.status}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        if (client) await client.close();
        process.exit(0);
    }
}

check();

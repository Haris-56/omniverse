import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

async function check() {
    let client;
    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB || "omniverse");

        const allCampaigns = await db.collection("instagram_campaigns").find({}).toArray();
        console.log(`DB Name used: ${process.env.MONGODB_DB || "omniverse"}`);
        console.log(`Total Campaigns: ${allCampaigns.length}`);
        
        allCampaigns.forEach(c => {
           console.log(`- Campaign: ${c.name} | Status: "${c.status}"`);
        });

        const activeCampaigns = await db.collection("instagram_campaigns").find({ status: "Active" }).toArray();
        console.log(`Active Query Count: ${activeCampaigns.length}`);

    } catch (err) {
        console.error(err);
    } finally {
        if (client) await client.close();
        process.exit(0);
    }
}

check();

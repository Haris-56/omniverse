import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { MongoClient, ObjectId } from 'mongodb';

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/omniverse";

async function checkLead() {
    let client;
    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB || 'omniverse');

        const campaigns = await db.collection("instagram_campaigns").find({ status: "Active" }).toArray();
        const campaign = campaigns[0];
        
        console.log("Campaign listId:", campaign.listId);
        
        const listIds = [
            campaign.listId, 
            campaign.listId.toString(), 
            ObjectId.isValid(campaign.listId) ? new ObjectId(campaign.listId) : null
        ].filter(Boolean);

        const lead = await db.collection("contacts").findOne({ listId: { $in: listIds } });
        console.log("Lead found:", JSON.stringify(lead, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        if (client) await client.close();
        process.exit(0);
    }
}

checkLead();

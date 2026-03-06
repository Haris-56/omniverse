
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { checkSystemAuth } from "@/lib/system/auth";
import { ObjectId } from "mongodb";

const DEFAULT_PLANS = [
  { 
    name: "Free", price: 0, 
    emailLimit: 50, campaignLimit: 1, accountLimit: 1, 
    aiCloser: false, aiCreator: false, 
    platforms: ["Email"], color: "bg-slate-400"
  },
  { 
    name: "Starter", price: 29, 
    emailLimit: 500, campaignLimit: 5, accountLimit: 3, 
    aiCloser: false, aiCreator: true, 
    platforms: ["Email", "LinkedIn"], color: "bg-indigo-500"
  },
  { 
    name: "Professional", price: 79, 
    emailLimit: 5000, campaignLimit: 20, accountLimit: 10, 
    aiCloser: true, aiCreator: true, 
    platforms: ["Email", "LinkedIn", "Facebook"], color: "bg-purple-600"
  },
  { 
    name: "Agency", price: 199, 
    emailLimit: 50000, campaignLimit: 100, accountLimit: 50, 
    aiCloser: true, aiCreator: true, 
    platforms: ["Email", "LinkedIn", "Facebook", "Instagram"], color: "bg-pink-600"
  },
];

export async function GET(req) {
  const authStatus = await checkSystemAuth(req);
  if (!authStatus.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    let plans = await db.collection("system_plans").find({}).sort({ price: 1 }).toArray();

    if (plans.length === 0) {
        // Seed defaults
        await db.collection("system_plans").insertMany(DEFAULT_PLANS);
        plans = await db.collection("system_plans").find({}).sort({ price: 1 }).toArray();
    }

    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

export async function POST(req) {
  const authStatus = await checkSystemAuth(req);
  if (!authStatus.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    const body = await req.json();
    const { _id, ...data } = body;

    // Remove immutable fields if any, sanitize input
    // Assuming simple replacement/update for now based on ID
    
    if (_id) {
        await db.collection("system_plans").updateOne(
            { _id: new ObjectId(_id) },
            { $set: { ...data, updatedAt: new Date() } }
        );
        return NextResponse.json({ success: true, _id });
    } else {
        const res = await db.collection("system_plans").insertOne({ ...data, createdAt: new Date(), updatedAt: new Date() });
        return NextResponse.json({ success: true, _id: res.insertedId });
    }

  } catch (error) {
    return NextResponse.json({ error: "Failed to save plan" }, { status: 500 });
  }
}

export async function DELETE(req) {
    const authStatus = await checkSystemAuth(req);
    if (!authStatus.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    try {
      const db = await getDb();
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      
      await db.collection("system_plans").deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");

    if (!accountId) {
      return NextResponse.json({ error: "AccountId is required" }, { status: 400 });
    }

    const campaigns = await db.collection("instagram_campaigns")
      .find({ 
        accountId: accountId,
        userId: session.user.id 
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching instagram campaigns:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const body = await request.json();
    
    const { 
      accountId, 
      name, 
      listId, 
      message, 
      dailyLimit, 
      minDelay, 
      maxDelay, 
      timezone, 
      hours, 
      sequences, 
      stopOnReply, 
      blacklist,
      isMessageRequest // Instagram specific
    } = body;

    if (!accountId || !name || !listId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newCampaign = {
      userId: session.user.id,
      accountId,
      name,
      listId,
      message,
      dailyLimit: parseInt(dailyLimit) || 1,
      minDelay: parseInt(minDelay) || 10,
      maxDelay: parseInt(maxDelay) || 40,
      timezone: timezone || "UTC",
      hours: hours || { start: "09:00", end: "17:00" },
      sequences: sequences || [],
      stopOnReply: !!stopOnReply,
      blacklist: blacklist || [],
      isMessageRequest: !!isMessageRequest,
      status: "Active",
      sentCount: 0,
      createdAt: new Date(),
    };

    const result = await db.collection("instagram_campaigns").insertOne(newCampaign);
    
    return NextResponse.json({ ...newCampaign, _id: result.insertedId });

  } catch (error) {
    console.error("Error creating instagram campaign:", error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { id, status } = await request.json();

    const result = await db.collection("instagram_campaigns").updateOne(
      { _id: new ObjectId(id), userId: session.user.id },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Campaign updated" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const result = await db.collection("instagram_campaigns").deleteOne({ 
      _id: new ObjectId(id), 
      userId: session.user.id 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Campaign deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}

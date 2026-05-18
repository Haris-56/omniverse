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

    const campaigns = await db.collection("linkedin_campaigns")
      .find({ 
        accountId: accountId,
        userId: session.user.id 
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching linkedin campaigns:", error);
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
      connectionNote, // LinkedIn specific
      sendAfterAccepted, // LinkedIn specific
      weeklyLimit,
      aiCloserId,
      aiAgentTargetType
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
      connectionNote: connectionNote || "",
      sendAfterAccepted: !!sendAfterAccepted,
      weeklyLimit: parseInt(weeklyLimit) || 100,
      aiCloserId: aiCloserId || null,
      aiAgentTargetType: aiAgentTargetType || "leads_only",
      status: "Active",
      sentCount: 0,
      nextRunAt: new Date(),
      createdAt: new Date(),
    };

    // Enforce 1 active campaign per account
    if (newCampaign.status === "Active") {
      await db.collection("linkedin_campaigns").updateMany(
        { accountId, status: "Active", userId: session.user.id },
        { $set: { status: "Paused" } }
      );
    }

    const result = await db.collection("linkedin_campaigns").insertOne(newCampaign);
    
    return NextResponse.json({ ...newCampaign, _id: result.insertedId });

  } catch (error) {
    console.error("Error creating linkedin campaign:", error);
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
    const { id, status, name, listId, message, dailyLimit, weeklyLimit, aiCloserId, aiAgentTargetType, minDelay, maxDelay, timezone, hours, sequences, stopOnReply, blacklist, connectionNote, sendAfterAccepted } = await request.json();

    const updateData = { updatedAt: new Date() };
    if (status !== undefined) updateData.status = status;
    if (name !== undefined) updateData.name = name;
    if (listId !== undefined) updateData.listId = listId;
    if (message !== undefined) updateData.message = message;
    if (dailyLimit !== undefined) updateData.dailyLimit = parseInt(dailyLimit);
    if (minDelay !== undefined) updateData.minDelay = parseInt(minDelay);
    if (maxDelay !== undefined) updateData.maxDelay = parseInt(maxDelay);
    if (timezone !== undefined) updateData.timezone = timezone;
    if (hours !== undefined) updateData.hours = hours;
    if (sequences !== undefined) updateData.sequences = sequences;
    if (stopOnReply !== undefined) updateData.stopOnReply = !!stopOnReply;
    if (blacklist !== undefined) updateData.blacklist = blacklist;
    if (connectionNote !== undefined) updateData.connectionNote = connectionNote;
    if (sendAfterAccepted !== undefined) updateData.sendAfterAccepted = !!sendAfterAccepted;
    if (weeklyLimit !== undefined) updateData.weeklyLimit = parseInt(weeklyLimit);
    if (aiCloserId !== undefined) updateData.aiCloserId = aiCloserId;
    if (aiAgentTargetType !== undefined) updateData.aiAgentTargetType = aiAgentTargetType;
    
    // Enforce 1 active campaign per account on status transition to Active
    if (status === "Active") {
      const existingCampaign = await db.collection("linkedin_campaigns").findOne({ _id: new ObjectId(id), userId: session.user.id });
      if (existingCampaign && existingCampaign.accountId) {
        await db.collection("linkedin_campaigns").updateMany(
          { accountId: existingCampaign.accountId, status: "Active", userId: session.user.id, _id: { $ne: new ObjectId(id) } },
          { $set: { status: "Paused" } }
        );
      }
    }

    // Smart scheduling: Recalculate on edit/activate
    // Always trigger a new run immediately on edit or status change to Active
    updateData.nextRunAt = new Date();

    const result = await db.collection("linkedin_campaigns").updateOne(
      { _id: new ObjectId(id), userId: session.user.id },
      { $set: updateData }
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

    const result = await db.collection("linkedin_campaigns").deleteOne({ 
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

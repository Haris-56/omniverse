import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

export async function GET(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const accountId = searchParams.get("accountId");

    const db = await getDb();

    if (id) {
      const campaign = await db.collection("facebook_campaigns").findOne({
        _id: new ObjectId(id),
        userId: session.user.id
      });
      if (!campaign) {
        return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
      }
      return NextResponse.json(campaign);
    }

    if (!accountId) {
      return NextResponse.json({ error: "Account ID or ID is required" }, { status: 400 });
    }

    const campaigns = await db.collection("facebook_campaigns")
      .find({ 
        userId: session.user.id,
        accountId: accountId
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching facebook campaigns:", error);
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
    const data = await request.json();

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
      aiCloserId,
      aiAgentTargetType
    } = data;

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
      aiCloserId: aiCloserId || "",
      aiAgentTargetType: aiAgentTargetType || "leads_only",
      status: "Active",
      sentCount: 0,
      createdAt: new Date(),
    };

    // Enforce 1 active campaign per account
    if (newCampaign.status === "Active") {
      await db.collection("facebook_campaigns").updateMany(
        { accountId, status: "Active", userId: session.user.id },
        { $set: { status: "Paused" } }
      );
    }

    const result = await db.collection("facebook_campaigns").insertOne(newCampaign);
    
    return NextResponse.json({ ...newCampaign, _id: result.insertedId });

  } catch (error) {
    console.error("Error creating facebook campaign:", error);
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
    const data = await request.json();
    const { id, status, name, listId, message, dailyLimit, minDelay, maxDelay, timezone, hours, sequences, stopOnReply, blacklist, aiCloserId, aiAgentTargetType } = data;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (name !== undefined) updateFields.name = name;
    if (listId !== undefined) updateFields.listId = listId;
    if (message !== undefined) updateFields.message = message;
    if (dailyLimit !== undefined) updateFields.dailyLimit = parseInt(dailyLimit) || 1;
    if (minDelay !== undefined) updateFields.minDelay = parseInt(minDelay) || 10;
    if (maxDelay !== undefined) updateFields.maxDelay = parseInt(maxDelay) || 40;
    if (timezone !== undefined) updateFields.timezone = timezone;
    if (hours !== undefined) updateFields.hours = hours;
    if (sequences !== undefined) updateFields.sequences = sequences;
    if (stopOnReply !== undefined) updateFields.stopOnReply = !!stopOnReply;
    if (blacklist !== undefined) updateFields.blacklist = blacklist;
    if (aiCloserId !== undefined) updateFields.aiCloserId = aiCloserId;
    if (aiAgentTargetType !== undefined) updateFields.aiAgentTargetType = aiAgentTargetType;
    updateFields.updatedAt = new Date();

    // Enforce 1 active campaign per account on status transition to Active
    if (status === "Active") {
      const existingCampaign = await db.collection("facebook_campaigns").findOne({ _id: new ObjectId(id), userId: session.user.id });
      if (existingCampaign && existingCampaign.accountId) {
        await db.collection("facebook_campaigns").updateMany(
          { accountId: existingCampaign.accountId, status: "Active", userId: session.user.id, _id: { $ne: new ObjectId(id) } },
          { $set: { status: "Paused" } }
        );
      }
    }

    const result = await db.collection("facebook_campaigns").updateOne(
      { _id: new ObjectId(id), userId: session.user.id },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Campaign status updated" });
  } catch (error) {
    console.error("Error updating campaign status:", error);
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

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await db.collection("facebook_campaigns").deleteOne({ 
      _id: new ObjectId(id), 
      userId: session.user.id 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Campaign deleted" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}

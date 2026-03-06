import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { campaignId } = params;

    const campaign = await db.collection("instagram_campaigns").findOne({
      _id: new ObjectId(campaignId),
      userId: session.user.id
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error fetching instagram campaign:", error);
    return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { campaignId } = params;
    const body = await request.json();

    const { 
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
      isMessageRequest,
      watchStory,
      watchHighlights,
      enableAiAgent,
      aiAgentId,
      executionPriority,
      hourlyLimit
    } = body;

    const updatedCampaign = {
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
      watchStory: !!watchStory,
      watchHighlights: !!watchHighlights,
      enableAiAgent: !!enableAiAgent,
      aiAgentId: aiAgentId || null,
      executionPriority: executionPriority || ['story', 'highlight', 'message'],
      hourlyLimit: parseInt(hourlyLimit) || 5,
      updatedAt: new Date()
    };

    const result = await db.collection("instagram_campaigns").updateOne(
      { _id: new ObjectId(campaignId), userId: session.user.id },
      { $set: updatedCampaign }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Campaign updated" });
  } catch (error) {
    console.error("Error updating instagram campaign:", error);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

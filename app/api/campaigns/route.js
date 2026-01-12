import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export async function GET(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const campaigns = await db.collection("campaigns").find({ userId: session.user.id }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
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
    
    const { name, platform, blocks, status } = body;

    if (!name) {
      return NextResponse.json({ error: "Campaign name is required" }, { status: 400 });
    }

    const newCampaign = {
      userId: session.user.id,
      name,
      platform: platform || "facebook",
      status: status || "Draft",
      blocks: blocks || [], // Use blocks from request if provided
      stats: {
        sent: 0,
        opened: 0,
        replied: 0,
        converted: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("campaigns").insertOne(newCampaign);
    
    return NextResponse.json({ ...newCampaign, _id: result.insertedId });

  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}

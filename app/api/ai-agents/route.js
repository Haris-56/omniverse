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
    const agents = await db.collection("ai_agents").find({ userId: session.user.id }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(agents);
  } catch (error) {
    console.error("Error fetching AI agents:", error);
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
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
    
    const { name, platform, behavior, tone, style, goal, triggers } = body;

    if (!name || !platform) {
      return NextResponse.json({ error: "Name and Platform are required" }, { status: 400 });
    }

    const newAgent = {
      userId: session.user.id,
      name,
      platform,
      behavior: behavior || "",
      tone: tone || "Professional",
      style: style || "Concise",
      goal: goal || "",
      triggers: triggers || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("ai_agents").insertOne(newAgent);
    
    return NextResponse.json({ ...newAgent, _id: result.insertedId });

  } catch (error) {
    console.error("Error creating AI agent:", error);
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}

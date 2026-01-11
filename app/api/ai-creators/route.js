import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth";

// Mock database (in-memory for now, replace with actual DB)
let creators = [];

export async function GET(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userCreators = creators.filter(c => c.userId === session.user.id);
  return NextResponse.json(userCreators);
}

export async function POST(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const newCreator = {
      _id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: session.user.id,
      ...body,
    };
    creators.push(newCreator);
    return NextResponse.json(newCreator, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create creator" }, { status: 500 });
  }
}

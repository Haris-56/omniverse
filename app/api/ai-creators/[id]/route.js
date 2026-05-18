import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function PUT(req, { params }) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const db = await getDb();
    
    const { name, platform, tone, postType, accountId, competitors, status } = body;
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (platform !== undefined) updateFields.platform = platform;
    if (tone !== undefined) updateFields.tone = tone;
    if (postType !== undefined) updateFields.postType = postType;
    if (accountId !== undefined) updateFields.accountId = accountId;
    if (competitors !== undefined) updateFields.competitors = competitors;
    if (status !== undefined) updateFields.status = status;
    updateFields.updatedAt = new Date();

    const result = await db.collection('ai_creators').updateOne(
      { _id: new ObjectId(id), userId: session.user.id },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }
    
    return NextResponse.json({ ...body, _id: id, updatedAt: new Date(), userId: session.user.id });
  } catch (error) {
    console.error("PUT AI Creator Error:", error);
    return NextResponse.json({ error: "Failed to update creator" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const db = await getDb();
    
    const result = await db.collection('ai_creators').deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Creator deleted" });
  } catch (error) {
    console.error("DELETE AI Creator Error:", error);
    return NextResponse.json({ error: "Failed to delete creator" }, { status: 500 });
  }
}

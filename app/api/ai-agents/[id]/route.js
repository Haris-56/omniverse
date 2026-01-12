import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

export async function PUT(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { id } = await params;
    const body = await request.json();
    
    // Remove _id from body if present to avoid immutable field error
    const { _id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
    }

    const result = await db.collection("ai_agents").updateOne(
      { _id: new ObjectId(id), userId: session.user.id },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Agent not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Agent updated successfully" });
  } catch (error) {
    console.error("Error updating AI agent:", error);
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
    }

    const result = await db.collection("ai_agents").deleteOne({ _id: new ObjectId(id), userId: session.user.id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Agent not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Agent deleted successfully" });
  } catch (error) {
    console.error("Error deleting AI agent:", error);
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 });
  }
}

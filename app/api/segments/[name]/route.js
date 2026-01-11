import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function PUT(request, { params }) {
  try {
    const db = await getDb();
    const { name } = params; // Old segment name
    const { newName } = await request.json();

    if (!newName) {
      return NextResponse.json({ error: "New name is required" }, { status: 400 });
    }

    // Update all contacts that have the old segment name
    await db.collection("contacts").updateMany(
      { segments: decodeURIComponent(name) },
      { $set: { "segments.$": newName } }
    );

    return NextResponse.json({ message: "Segment renamed successfully" });
  } catch (error) {
    console.error("Error renaming segment:", error);
    return NextResponse.json(
      { error: "Failed to rename segment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const db = await getDb();
    const { name } = params;

    // Delete all contacts in this segment
    // Note: If a contact has multiple segments, this logic might be too aggressive if we only want to remove the tag.
    // But user requirement implies "Delete List" -> delete the contacts.
    // Let's stick to deleting the contacts for now as per "Delete List" metaphor.
    
    await db.collection("contacts").deleteMany({ segments: decodeURIComponent(name) });

    return NextResponse.json({ message: "Segment and its contacts deleted successfully" });
  } catch (error) {
    console.error("Error deleting segment:", error);
    return NextResponse.json(
      { error: "Failed to delete segment" },
      { status: 500 }
    );
  }
}

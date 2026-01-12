import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(request, { params }) {
  try {
    const db = await getDb();
    const { id } = await params;
    const body = await request.json();

    // Remove _id from body to avoid immutable field error
    const { _id, ...updateData } = body;

    await db
      .collection("contacts")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return NextResponse.json({ message: "Contact updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const db = await getDb();
    const { id } = await params;

    await db.collection("contacts").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}

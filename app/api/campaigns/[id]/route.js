import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const db = await getDb();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
    }

    const campaign = await db.collection("campaigns").findOne({ _id: new ObjectId(id) });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const db = await getDb();
    const { id } = params;
    const body = await request.json();
    
    const { _id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
    }

    const result = await db.collection("campaigns").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Campaign updated successfully" });
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const db = await getDb();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
    }

    const result = await db.collection("campaigns").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}

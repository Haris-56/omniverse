import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(request, { params }) {
  try {
    const db = await getDb();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }

    const result = await db.collection("linkedin_accounts").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting linkedin account:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}

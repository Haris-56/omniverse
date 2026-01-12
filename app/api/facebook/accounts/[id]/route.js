import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

export async function GET(req, { params: paramsPromise }) {
  const params = await paramsPromise;
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }

    const account = await db.collection("facebook_accounts").findOne({ 
      _id: new ObjectId(id),
      userId: session.user.id 
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("Error fetching facebook account:", error);
    return NextResponse.json({ error: "Failed to fetch account" }, { status: 500 });
  }
}

export async function DELETE(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  try {
    const db = await getDb();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }

    const result = await db.collection("facebook_accounts").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting facebook account:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}

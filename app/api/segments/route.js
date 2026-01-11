import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    // Get distinct segments from contacts
    const segments = await db.collection("contacts").distinct("segments");
    // Also get explicitly created segments if we decide to store them separately
    // For now, we'll just return the unique segments found in contacts + some defaults
    
    const defaultSegments = ["Warm Leads", "Cold Leads", "Customers"];
    const allSegments = [...new Set([...defaultSegments, ...segments])];

    return NextResponse.json(allSegments);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch segments" },
      { status: 500 }
    );
  }
}

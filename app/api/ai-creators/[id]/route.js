import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth";

// Mock database reference (should access the same source as the main route)
// For this session, we'll assume the same in-memory array is accessible or re-declared
// NOTE: In a real app, this would query a database. For this mock, we can't easily share 
// the `creators` array across modules in Next.js app router without a singleton or proper DB.
// I will implement a simple simulation where we "find" it if it were a DB.

export async function PUT(req, { params }) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();
    
    // Simulating DB update with user check
    // In a real scenario: await db.collection('creators').updateOne({ _id: id, userId: session.user.id }, { $set: body })
    
    return NextResponse.json({ ...body, _id: id, updatedAt: new Date(), userId: session.user.id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update creator" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    
    // Simulating DB delete with user check
    // In a real scenario: await db.collection('creators').deleteOne({ _id: id, userId: session.user.id })

    return NextResponse.json({ message: "Creator deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete creator" }, { status: 500 });
  }
}

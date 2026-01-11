import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

export async function GET(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const accounts = await db.collection("linkedin_accounts").find({ userId: session.user.id }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching linkedin accounts:", error);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { email, password, cookies } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Simulate connection delay (2-5 seconds)
    const delay = Math.floor(Math.random() * 3000) + 2000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Mock Connection Logic
    let status = "Connected";
    let failureReason = null;

    if (password.toLowerCase().includes("fail")) {
      status = "Failed";
      const reasons = ["Incorrect password", "Two-factor authentication required", "Security check required"];
      failureReason = reasons[Math.floor(Math.random() * reasons.length)];
    }

    const newAccount = {
      userId: session.user.id,
      email,
      cookies: cookies ? "Stored" : "None", 
      status,
      failureReason,
      createdAt: new Date(),
      campaigns: [] 
    };

    const result = await db.collection("linkedin_accounts").insertOne(newAccount);
    
    return NextResponse.json({ ...newAccount, _id: result.insertedId });

  } catch (error) {
    console.error("Error connecting linkedin account:", error);
    return NextResponse.json({ error: "Failed to connect account" }, { status: 500 });
  }
}

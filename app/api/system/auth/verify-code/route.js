import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { email, code } = await req.json();
    const db = await getDb();

    // 1. Find the code
    const record = await db.collection("verification_codes").findOne({ email, code });

    if (!record) {
      return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
    }

    // 2. Check expiration (10 mins)
    const now = new Date();
    const expiresAt = new Date(record.createdAt.getTime() + 10 * 60 * 1000);

    if (now > expiresAt) {
      await db.collection("verification_codes").deleteOne({ _id: record._id });
      return NextResponse.json({ error: "Code has expired. Please request a new one." }, { status: 400 });
    }

    // 3. Code is valid, create a system admin session
    // We'll use a random token and store it in a cookie
    const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    
    await db.collection("system_sessions").insertOne({
      token,
      email,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    // 4. Set the cookie
    const cookieStore = await cookies();
    cookieStore.set("system_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    // Clean up used code
    await db.collection("verification_codes").deleteOne({ _id: record._id });

    return NextResponse.json({ message: "Identity verified." });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

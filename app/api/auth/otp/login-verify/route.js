import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
    }

    const db = await getDb();

    // 1. Find and check verification code
    const record = await db.collection("verification_codes").findOne({ email, code });
    if (!record) {
      return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
    }

    // 2. Expiration check (10 mins)
    const now = new Date();
    const expiresAt = new Date(record.createdAt.getTime() + 10 * 60 * 1000);
    if (now > expiresAt) {
      await db.collection("verification_codes").deleteOne({ _id: record._id });
      return NextResponse.json({ error: "Verification code has expired." }, { status: 400 });
    }

    // Clean up code
    await db.collection("verification_codes").deleteOne({ _id: record._id });

    // 3. Find User
    const user = await db.collection("user").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 4. Create Better-Auth Session
    const session = await auth.api.createSession({
      headers: req.headers,
      body: {
        userId: user.id
      }
    });

    // We need to pass the session headers (cookies) back to the response
    const res = NextResponse.json({ 
      message: "Authentication successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

    if (session && session.session) {
      const cookieHeader = session.headers?.get("set-cookie");
      if (cookieHeader) {
        res.headers.set("set-cookie", cookieHeader);
      }
    }

    return res;
  } catch (error) {
    console.error("Login OTP verification error:", error);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}

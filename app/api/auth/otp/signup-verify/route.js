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

    // 3. Create User in MongoDB
    const userId = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const newUser = {
      id: userId,
      name: record.name,
      email: record.email,
      password: record.password, // already hashed
      emailVerified: true,
      image: "https://example.com/image.png",
      role: "user",
      status: "Locked",
      plan: "$0 Restricted Plan",
      onboardingCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.collection("user").insertOne(newUser);

    // 4. Create Better-Auth Session
    const session = await auth.api.createSession({
      headers: req.headers,
      body: {
        userId: newUser.id
      }
    });

    // We need to pass the session headers (cookies) back to the response
    const res = NextResponse.json({ 
      message: "Signup successful",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
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
    console.error("Signup OTP verification error:", error);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}

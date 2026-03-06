import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const db = await getDb();

    // 1. Find the user
    const user = await db.collection("user").findOne({ email });
    console.log(`[System Auth] Login attempt for: ${email}, Found: ${!!user}`);

    if (!user) {
      return NextResponse.json({ error: "Access Denied: Not an administrator." }, { status: 403 });
    }

    // 2. Check Role
    console.log(`[System Auth] User role: ${user?.role}`);
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Access Denied: Insufficient permissions." }, { status: 403 });
    }

    // 3. Check Password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Credentials valid, move to 2FA step
    return NextResponse.json({ message: "Credentials verified." });
  } catch (error) {
    console.error("Login verification error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

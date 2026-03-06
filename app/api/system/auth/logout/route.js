import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("system_admin_token")?.value;

  if (token) {
    const db = await getDb();
    await db.collection("system_sessions").deleteOne({ token });
  }

  cookieStore.delete("system_admin_token");

  return NextResponse.json({ message: "Logged out successfully" });
}

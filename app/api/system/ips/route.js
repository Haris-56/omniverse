import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export async function GET(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const ips = await db.collection("system_ips").find({}).toArray();
    return NextResponse.json(ips);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch IPs" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const data = await req.json();
    
    await db.collection("system_ips").insertOne({
      ...data,
      createdAt: new Date(),
      status: "Idle"
    });

    // Log the action
    await db.collection("audit_logs").insertOne({
      type: "IP_REGISTER",
      actor: session.user.email,
      target: data.address,
      details: `Registered new system IP: ${data.address}`,
      timestamp: new Date(),
      severity: "info"
    });

    return NextResponse.json({ message: "IP registered successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to register IP" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { id, ...updates } = await req.json();
    
    await db.collection("system_ips").updateOne(
      { _id: id },
      { $set: updates }
    );

    return NextResponse.json({ message: "IP updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update IP" }, { status: 500 });
  }
}

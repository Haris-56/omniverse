import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { checkSystemAuth } from "@/lib/system/auth";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const authStatus = await checkSystemAuth(req);
  if (!authStatus.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    const proxies = await db.collection("system_proxies").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(proxies);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch proxies" }, { status: 500 });
  }
}

export async function POST(req) {
  const authStatus = await checkSystemAuth(req);
  if (!authStatus.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    const body = await req.json();
    const { host, port, protocol, username, password, type, dailyLimit } = body;

    if (!host || !port || !protocol || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newProxy = {
      host,
      port: parseInt(port),
      protocol, // 'http', 'https', 'socks5'
      auth: (username && password) ? { username, password } : null,
      type, // 'residential' or 'shared'
      status: 'active',
      limits: {
        daily: parseInt(dailyLimit) || 1000,
        hourly: 50 // Default from readme
      },
      usage: {
        today: 0,
        hourly: 0,
        total: 0,
        lastReset: new Date()
      },
      assignedCampaigns: [], // Track which campaigns are locked to this IP
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const res = await db.collection("system_proxies").insertOne(newProxy);
    return NextResponse.json({ ...newProxy, _id: res.insertedId });

  } catch (error) {
    return NextResponse.json({ error: "Failed to create proxy" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const authStatus = await checkSystemAuth(req);
  if (!authStatus.authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await db.collection("system_proxies").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

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
    const { email, password, cookies, twoFactorCode } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Assign Proxy Systematically
    const { getAssignedProxy } = await import("@/lib/proxy-allocator");
    let assignedProxyDoc;
    try {
        assignedProxyDoc = await getAssignedProxy(session.user.id, 'linkedin');
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 503 });
    }

    // Format for automation usage (flatten auth)
    const proxy = {
        host: assignedProxyDoc.host,
        port: assignedProxyDoc.port,
        protocol: assignedProxyDoc.protocol,
        username: assignedProxyDoc.auth?.username,
        password: assignedProxyDoc.auth?.password
    };

    const existing = await db.collection("linkedin_accounts").findOne({ 
      userId: session.user.id, 
      email: email 
    });

    let accountId;
    if (existing) {
      accountId = existing._id;
      await db.collection("linkedin_accounts").updateOne(
        { _id: accountId },
        { 
          $set: { 
            status: "Connecting...", 
            failureReason: null, 
            proxy: proxy,
            updatedAt: new Date() 
          } 
        }
      );
    } else {
      const newAccount = {
        userId: session.user.id,
        email,
        cookies: cookies ? "Stored" : "None", 
        proxy,
        status: "Connecting...",
        failureReason: null,
        createdAt: new Date(),
        campaigns: [] 
      };
      const result = await db.collection("linkedin_accounts").insertOne(newAccount);
      accountId = result.insertedId;
    }

    const { loginToLinkedIn } = await import("@/lib/automation/linkedin");

    try {
        await loginToLinkedIn(accountId, email, password, proxy, false, twoFactorCode);
        const updatedAccount = await db.collection("linkedin_accounts").findOne({ _id: accountId });
        return NextResponse.json(updatedAccount);
    } catch (automationError) {
        let status = "Failed";
        if (automationError.message.includes('code') || automationError.message.includes('Checkpoint') || automationError.message.includes('verification')) {
            status = "Checkpoint";
        }
        
        await db.collection("linkedin_accounts").updateOne(
            { _id: accountId },
            { $set: { status, failureReason: automationError.message } }
        );
        return NextResponse.json({ status, failureReason: automationError.message, _id: accountId });
    }

  } catch (error) {
    console.error("Error connecting linkedin account:", error);
    return NextResponse.json({ error: "Failed to connect account" }, { status: 500 });
  }
}

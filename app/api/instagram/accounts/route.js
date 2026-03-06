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
    const accounts = await db.collection("instagram_accounts").find({ userId: session.user.id }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching instagram accounts:", error);
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
      return NextResponse.json({ error: "Username/Email and password are required" }, { status: 400 });
    }

    // Assign Proxy Systematically
    const { getAssignedProxy } = await import("@/lib/proxy-allocator");
    let assignedProxyDoc;
    try {
        assignedProxyDoc = await getAssignedProxy(session.user.id, 'instagram');
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

    // Check if account already exists for this user
    const existing = await db.collection("instagram_accounts").findOne({ 
      userId: session.user.id, 
      email: email 
    });

    let accountId;
    if (existing) {
      accountId = existing._id;
      // Update existing entry status
      await db.collection("instagram_accounts").updateOne(
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
      // Create Account Entry
      const newAccount = {
        userId: session.user.id,
        email, 
        cookies: cookies ? "Stored" : "None", 
        proxy: proxy,
        status: "Connecting...",
        failureReason: null,
        createdAt: new Date(),
        campaigns: [] 
      };
      const result = await db.collection("instagram_accounts").insertOne(newAccount);
      accountId = result.insertedId;
    }

    // Trigger Automation (Real)
    // In a real production app, this should be offloaded to a queue (Redis/Bull)
    // But for this local/integrated version, we run it and wait (or run async without await if we want to return early)
    // User requested "Show connected", so we probably want to await the check.
    
    // Dynamically import to avoid build issues if playwright is missing in some envs
    const { loginToInstagram } = await import("@/lib/automation/instagram");

    try {
        await loginToInstagram(accountId, email, password, proxy, false, twoFactorCode);
        // If successful, status is updated to 'Connected' in DB by the function
        const updatedAccount = await db.collection("instagram_accounts").findOne({ _id: accountId });
        return NextResponse.json(updatedAccount);
    } catch (automationError) {
        // Determine the correct status to return to the UI
        let status = "Failed";
        if (automationError.message.includes('approve') || automationError.message.includes('app')) {
            status = "AppConfirmation";
        } else if (automationError.message.includes('security code') || automationError.message.includes('verification code') || automationError.message.includes('Checkpoint')) {
            status = "Checkpoint";
        }
        
        await db.collection("instagram_accounts").updateOne(
            { _id: accountId },
            { $set: { status: status, failureReason: automationError.message } }
        );
        return NextResponse.json({ 
            status: status, 
            failureReason: automationError.message,
            _id: accountId 
        });
    }

  } catch (error) {
    console.error("Error connecting instagram account:", error);
    return NextResponse.json({ error: "Failed to connect account" }, { status: 500 });
  }
}

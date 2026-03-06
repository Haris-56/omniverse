import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");
    const id = searchParams.get("id");

    if (id) {
        const campaign = await db.collection("email_campaigns").findOne({ 
            _id: new ObjectId(id), 
            userId: session.user.id 
        });
        return NextResponse.json(campaign);
    }

    if (!accountId) {
      return NextResponse.json({ error: "AccountId is required" }, { status: 400 });
    }

    const campaigns = await db.collection("email_campaigns")
      .find({ 
        accountId: accountId,
        userId: session.user.id 
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching email campaigns:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

import { checkPlanLimit } from "@/lib/limits";

export async function POST(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    
    // Check Limits
    const limitCheck = await checkPlanLimit(session.user.id, 'campaigns');
    if (!limitCheck.allowed) {
      return NextResponse.json({ 
        error: `Plan limit reached. Your plan allows ${limitCheck.limit} active campaigns.`,
        current: limitCheck.current,
        limit: limitCheck.limit
      }, { status: 403 });
    }

    const body = await request.json();
    
    // Destructure expanded fields
    const { 
      accountId, accountIds, name, listId, 
      abTesting, variantA, variantB, 
      settings, rampUp, stopOnReply, autoReply, sequences 
    } = body;

    // Basic Validation
    if (!accountId || !name || !listId || !variantA?.message || !variantA?.subject) {
      return NextResponse.json({ error: "Missing required fields (Name, List, Variant A)" }, { status: 400 });
    }

    const newCampaign = {
      userId: session.user.id,
      accountId, // primary owner
      accountIds: accountIds && accountIds.length > 0 ? accountIds : [accountId], // Array of sender accounts
      name,
      listId,
      // Store variants
      variants: {
        active: abTesting, // true/false
        a: variantA,
        b: variantB
      },
      // Settings
      dailyLimit: parseInt(settings?.dailyLimit) || 50,
      timezone: settings?.timezone || "UTC",
      hours: { 
        start: settings?.startTime || "09:00", 
        end: settings?.endTime || "17:00" 
      },
      settings: {
        ...settings,
        maxPerHour: parseInt(settings?.maxPerHour) || 15,
        sendJitter: !!settings?.sendJitter,
        businessHoursOnly: !!settings?.businessHoursOnly,
        addUnsubscribe: !!settings?.addUnsubscribe,
        deduplicate: !!settings?.deduplicate,
        followupHours: settings?.followupHours || null
      },
      delays: {
        min: parseFloat(settings?.minDelay) || 30,
        max: parseFloat(settings?.maxDelay) || 120
      },
      // Advanced
      rampUp: rampUp || null, // { start, end, period }
      autoReply: autoReply || null, // { keyword, message }
      stopOnReply: !!stopOnReply,
      
      sequences: sequences || [], // Follow-ups
      
      // Status
      status: "Active",
      sentCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("email_campaigns").insertOne(newCampaign);
    
    return NextResponse.json({ ...newCampaign, _id: result.insertedId });

  } catch (error) {
    console.error("Error creating email campaign:", error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const body = await request.json();
    const { 
      id, status, name, accountIds, accountId, 
      abTesting, variantA, variantB, settings, rampUp, sequences 
    } = body;

    const updateData = { updatedAt: new Date() };
    
    // Live Edit Handling
    if (status) updateData.status = status;
    if (name) updateData.name = name;
    if (accountIds && accountIds.length > 0) updateData.accountIds = accountIds;
    else if (accountId) updateData.accountIds = [accountId];
    
    if (variantA) {
        updateData.variants = {
            active: !!abTesting,
            a: variantA,
            b: variantB || null
        };
    }
    
    if (settings) {
        updateData.dailyLimit = parseInt(settings.dailyLimit) || 50;
        updateData.timezone = settings.timezone || "UTC";
        updateData.hours = { start: settings.startTime || "09:00", end: settings.endTime || "17:00" };
        updateData.settings = {
            ...settings,
            maxPerHour: parseInt(settings.maxPerHour) || 15,
            sendJitter: !!settings.sendJitter,
            businessHoursOnly: !!settings.businessHoursOnly,
            addUnsubscribe: !!settings.addUnsubscribe,
            deduplicate: !!settings.deduplicate,
            followupHours: settings.followupHours || null
        };
        updateData.delays = {
            min: parseFloat(settings.minDelay) || 30,
            max: parseFloat(settings.maxDelay) || 120
        };
    }
    
    if (rampUp !== undefined) updateData.rampUp = rampUp;
    if (sequences !== undefined) updateData.sequences = sequences;

    const result = await db.collection("email_campaigns").updateOne(
      { _id: new ObjectId(id), userId: session.user.id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Campaign dynamically updated" });
  } catch (error) {
    console.error("Live Update Error:", error);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const result = await db.collection("email_campaigns").deleteOne({ 
      _id: new ObjectId(id), 
      userId: session.user.id 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Campaign deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}

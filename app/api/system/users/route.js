import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { checkSystemAuth } from "@/lib/system/auth";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const authStatus = await checkSystemAuth(req);
  if (!authStatus.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const users = await db.collection("user")
      .find({ role: { $ne: "admin" } })
      .sort({ createdAt: -1 })
      .toArray();

    // Map plans and other data
    const usersWithDetails = await Promise.all(users.map(async (u) => {
      // Get plan details
      let plan = null;
      if (u.planId) {
        try {
          plan = await db.collection("system_plans").findOne({ _id: new ObjectId(u.planId) });
        } catch(e) {}
      }

      if (!plan) {
        plan = await db.collection("system_plans").findOne({ name: "Free" });
      }

      // Usage stats
      const campaignsCount = await db.collection("email_campaigns").countDocuments({ userId: u.id });
      const accountsCount = await db.collection("email_accounts").countDocuments({ userId: u.id });
      
      return {
        id: u.id,
        _id: u._id,
        name: u.name,
        email: u.email,
        plan: plan ? plan.name : "Free",
        planId: plan ? plan._id : null,
        status: u.status || "Active",
        role: u.role,
        createdAt: u.createdAt,
        stats: {
          campaigns: campaignsCount,
          accounts: accountsCount
        }
      };
    }));

    return NextResponse.json(usersWithDetails);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const authStatus = await checkSystemAuth(req);
  if (!authStatus.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { userId, ...updates } = await req.json();

    let query = { id: userId };
    
    // Check if we need to update by _id (if id field is not present)
    const userExist = await db.collection("user").findOne({ id: userId });
    if (!userExist) {
        try {
            query = { _id: new ObjectId(userId) };
        } catch (e) {
            return NextResponse.json({ error: "Invalid User ID format" }, { status: 400 });
        }
    }

    const result = await db.collection("user").updateOne(
      query,
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User identity record not found" }, { status: 404 });
    }

    // Log the action
    await db.collection("audit_logs").insertOne({
      type: "USER_UPDATE",
      actor: authStatus.user.email,
      target: userId,
      details: `Updated fields: ${Object.keys(updates).join(", ")}`,
      timestamp: new Date(),
      severity: "info"
    });

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const authStatus = await checkSystemAuth(req);
  if (!authStatus.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    let query = { id: userId };
    const userExist = await db.collection("user").findOne({ id: userId });
    
    if (!userExist) {
      try {
        query = { _id: new ObjectId(userId) };
      } catch (e) {
        return NextResponse.json({ error: "Invalid User ID format" }, { status: 400 });
      }
    }

    const result = await db.collection("user").deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Log the action
    await db.collection("audit_logs").insertOne({
      type: "USER_DELETE",
      actor: authStatus.user.email,
      target: userId,
      details: `Permanently deleted user: ${userId}`,
      timestamp: new Date(),
      severity: "warning"
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

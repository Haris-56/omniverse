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
    
    // Aggregate Global Stats
    const totalUsers = await db.collection("user").countDocuments();
    const activeUsers = 856; // Mock for now or calculate from sessions
    const runningCampaigns = await db.collection("email_campaigns").countDocuments({ status: "Active" });
    const emailsSentToday = 15420; // Mock (requires a separate daily_stats collection)
    
    const stats = {
      totalUsers,
      activeUsers,
      runningCampaigns,
      emailsSentToday,
      platformUsage: {
        email: 65,
        facebook: 15,
        instagram: 10,
        linkedin: 10
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching system stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

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
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    
    // Aggregate Global Stats Dynamically
    const totalUsers = await db.collection("user").countDocuments();
    
    // Active campaigns count across all modules
    const emailCampaigns = await db.collection("email_campaigns").countDocuments({ status: "Active" });
    const facebookCampaigns = await db.collection("facebook_campaigns").countDocuments({ status: "Active" });
    const instagramCampaigns = await db.collection("instagram_campaigns").countDocuments({ status: "Active" });
    const linkedinCampaigns = await db.collection("linkedin_campaigns").countDocuments({ status: "Active" });
    const runningCampaigns = emailCampaigns + facebookCampaigns + instagramCampaigns + linkedinCampaigns;
    
    // Sent interactions today
    const emailsSentToday = await db.collection("email_logs").countDocuments({ timestamp: { $gte: startOfToday } });
    const fbSentToday = await db.collection("facebook_logs").countDocuments({ timestamp: { $gte: startOfToday } });
    
    const igSentToday = await db.collection("instagram_progress").countDocuments({ 
      lastActionAt: { $gte: startOfToday }, 
      status: "sent" 
    });
    
    const liSentToday = await db.collection("linkedin_progress").countDocuments({ 
      lastActionAt: { $gte: startOfToday }, 
      status: "sent" 
    });
    
    const totalSentToday = emailsSentToday + fbSentToday + igSentToday + liSentToday;
    const totalActive = runningCampaigns || 1;
    
    const stats = {
      totalUsers,
      activeUsers: totalUsers, // Total system users active
      runningCampaigns,
      emailsSentToday: totalSentToday,
      platformUsage: {
        email: Math.round((emailCampaigns / totalActive) * 100) || 25,
        facebook: Math.round((facebookCampaigns / totalActive) * 100) || 25,
        instagram: Math.round((instagramCampaigns / totalActive) * 100) || 25,
        linkedin: Math.round((linkedinCampaigns / totalActive) * 100) || 25
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching system stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

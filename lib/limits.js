import { getDb } from "./mongodb";
import { ObjectId } from "mongodb";

/**
 * Validates if a user can perform an action based on their subscription plan.
 * @param {string} userId - The user ID to check.
 * @param {string} type - The type of limit to check ('campaigns', 'accounts', 'emails', 'ai').
 * @returns {Promise<{allowed: boolean, current: number, limit: number, error?: string}>}
 */
export async function checkPlanLimit(userId, type) {
  try {
    const db = await getDb();
    // Try lookup by id (better-auth standard) or _id if id is not found
    let user = await db.collection("user").findOne({ id: userId });
    if (!user) {
      try {
        user = await db.collection("user").findOne({ _id: new ObjectId(userId) });
      } catch(e) {}
    }
    
    if (!user) return { allowed: false, current: 0, limit: 0, error: "User identity not found in database." };
    
    // Admin has no limits
    if (user.role === "admin") return { allowed: true, current: 0, limit: Infinity };

    const planId = user.planId;
    let plan = null;
    
    if (planId) {
      try {
        plan = await db.collection("system_plans").findOne({ _id: new ObjectId(planId) });
      } catch (e) {}
    }

    if (!plan) {
      plan = await db.collection("system_plans").findOne({ name: "Free" });
    }
    
    const defaultLimits = {
      campaignLimit: 1, 
      accountLimit: 1, 
      emailLimit: 50, 
      aiCloser: false, 
      aiCreator: false
    };

    const limitConfig = plan || defaultLimits;

    // Ensure we don't return undefined for these keys
    const campaignLimit = limitConfig.campaignLimit ?? limitConfig.campaigns ?? defaultLimits.campaignLimit;
    const accountLimit = limitConfig.accountLimit ?? limitConfig.accounts ?? defaultLimits.accountLimit;

    if (type === 'campaigns') {
      const emailCount = await db.collection("email_campaigns").countDocuments({ userId, status: "Active" });
      const fbCount = await db.collection("facebook_campaigns")?.countDocuments({ userId, status: "Active" }) || 0;
      const liCount = await db.collection("linkedin_campaigns")?.countDocuments({ userId, status: "Active" }) || 0;
      const total = emailCount + fbCount + liCount;
      
      return { 
        allowed: total < campaignLimit,
        current: total,
        limit: campaignLimit
      };
    }

    if (type === 'accounts') {
      const emailAccs = await db.collection("email_accounts").countDocuments({ userId });
      const fbAccs = await db.collection("facebook_accounts")?.countDocuments({ userId }) || 0;
      const liAccs = await db.collection("linkedin_accounts")?.countDocuments({ userId }) || 0;
      const total = emailAccs + fbAccs + liAccs;
      
      return {
        allowed: total < accountLimit,
        current: total,
        limit: accountLimit
      };
    }

    if (type === 'ai') {
      const hasAccess = !!(limitConfig.aiCloser || limitConfig.aiCreator);
      return {
        allowed: hasAccess,
        current: hasAccess ? 1 : 0,
        limit: hasAccess ? 1 : 0,
        error: hasAccess ? null : "AI modules are not included in your current plan."
      };
    }

    return { allowed: true, current: 0, limit: 9999 };
  } catch (error) {
    console.error("Limit check failed:", error);
    return { allowed: false, current: 0, limit: 0, error: "System security guard failure." };
  }
}

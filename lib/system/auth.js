import { getDb } from "../mongodb";
import { auth } from "../auth";
import { cookies } from "next/headers";

export async function checkSystemAuth(req) {
  // 1. Check for standard App Admin Session
  const session = await auth.api.getSession({ headers: req.headers });
  if (session && session.user.role === "admin") {
    return { authorized: true, user: session.user };
  }

  // 2. Check for System Admin Portal Session
  const cookieStore = await cookies();
  const token = cookieStore.get("system_admin_token")?.value;

  if (token) {
    const db = await getDb();
    const systemSession = await db.collection("system_sessions").findOne({ 
      token,
      expiresAt: { $gt: new Date() }
    });

    if (systemSession) {
      return { 
        authorized: true, 
        user: { 
          email: systemSession.email,
          role: "admin",
          isSystemAdmin: true 
        } 
      };
    }
  }

  return { authorized: false };
}

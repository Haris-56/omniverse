import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { rewriteRepostCaption } from "@/lib/ai/gemini-engine";
import { checkPlanLimit } from "@/lib/limits"; // hypothetical limit logic

export async function POST(request) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const { action, mediaUrl, caption, originalPostUrl, accounts } = body;

        // Check plan limits
        const db = await getDb();
        const userCount = await db.collection("linkedin_campaigns").countDocuments({ userId: session.user.id }); 
        // This is a proxy for plan checks over daily quotas

        if (action === "rewrite_caption") {
            const rewritten = await rewriteRepostCaption(caption, "Friendly and engaging, matching the brand of the original post.");
            return NextResponse.json({ success: true, text: rewritten });
        }

        if (action === "schedule_repost") {
            const newDoc = {
                userId: session.user.id,
                mediaUrl,
                caption,
                accounts,
                originalPostUrl,
                status: "Pending",
                scheduledFor: new Date(Date.now() + 60 * 60 * 1000), // 1 hour buffer organically
                createdAt: new Date()
            };
            await db.collection("ai_creators_jobs").insertOne(newDoc);
            return NextResponse.json({ success: true, message: "Repost Scheduled Ghostly" });
        }

        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    } catch (e) {
        console.error("AI Creators Route Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

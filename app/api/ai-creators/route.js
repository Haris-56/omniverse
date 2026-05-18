import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { rewriteRepostCaption } from "@/lib/ai/gemini-engine";

export async function GET(request) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const db = await getDb();
        const creators = await db.collection("ai_creators")
            .find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .toArray();
        return NextResponse.json(creators);
    } catch (e) {
        console.error("GET AI Creators Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const db = await getDb();
        const body = await request.json();
        const { action, mediaUrl, caption, originalPostUrl, accounts, name, platform, tone, postType, accountId, competitors } = body;

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

        // Standard save creator logic
        const newCreator = {
            userId: session.user.id,
            name,
            platform,
            tone,
            postType,
            accountId,
            competitors,
            status: "Active",
            createdAt: new Date()
        };

        const result = await db.collection("ai_creators").insertOne(newCreator);
        return NextResponse.json({ ...newCreator, _id: result.insertedId });
    } catch (e) {
        console.error("AI Creators Route Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

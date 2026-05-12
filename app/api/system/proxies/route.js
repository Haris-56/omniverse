import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // auth is likely imported differently in app router, wait, I'll use MongoClient directly.
import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/omniverse";

export async function GET(request) {
    let client;
    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB || "omniverse");
        const proxies = await db.collection("system_proxies").find({}).toArray();
        return NextResponse.json(proxies);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    } finally {
        if(client) await client.close();
    }
}

export async function POST(request) {
    let client;
    try {
        const body = await request.json();
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB || "omniverse");
        
        const newProxy = {
            host: body.host || body.ip,
            port: body.port,
            protocol: body.protocol || "socks5",
            type: body.type || "residential",
            username: body.username || "",
            password: body.password || "",
            limits: { daily: body.dailyLimit ? parseInt(body.dailyLimit) : 1000 },
            usage: { today: 0 },
            allocations: {
                facebook: null,
                instagram: null,
                linkedin: null,
                emails: []
            },
            status: "active",
            health_latency_ms: 0,
            assigned_user_id: null,
            createdAt: new Date()
        };

        const result = await db.collection("system_proxies").insertOne(newProxy);
        return NextResponse.json({ success: true, id: result.insertedId });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    } finally {
        if(client) await client.close();
    }
}

export async function DELETE(request) {
    let client;
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        
        client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(process.env.MONGODB_DB || "omniverse");
        
        const result = await db.collection("system_proxies").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Proxy not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    } finally {
        if(client) await client.close();
    }
}

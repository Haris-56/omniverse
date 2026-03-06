import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export async function GET(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const templates = await db.collection("email_templates")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { name, subject, body } = await req.json();

    if (!name || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTemplate = {
      userId: session.user.id,
      name,
      subject,
      body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("email_templates").insertOne(newTemplate);
    return NextResponse.json({ ...newTemplate, _id: result.insertedId });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}

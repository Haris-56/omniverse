import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export async function GET(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get("listId");
    const search = searchParams.get("search");

    let query = { userId: session.user.id };

    if (listId) {
      query.listId = listId;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const contacts = await db.collection("contacts").find(query).toArray();

    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const body = await request.json();

    // Check if it's a bulk upload (has contacts array and listId)
    if (body.contacts && Array.isArray(body.contacts)) {
      const { contacts, listId } = body;
      
      if (!listId) {
        return NextResponse.json({ error: "List ID is required" }, { status: 400 });
      }

      if (contacts.length > 100) {
        return NextResponse.json(
          { error: "Max 100 rows allowed" },
          { status: 400 }
        );
      }
      
      // Add createdAt timestamp and listId AND userId to each contact
      const contactsWithMetadata = contacts.map(contact => ({
        ...contact,
        createdAt: new Date(),
        listId: listId,
        userId: session.user.id
      }));

      await db.collection("contacts").insertMany(contactsWithMetadata);
      return NextResponse.json({ message: "Contacts uploaded successfully" });
    } else {
      // Single insert (Add Contact Modal)
      const newContact = {
        ...body,
        userId: session.user.id,
        createdAt: new Date(),
      };
      
      await db.collection("contacts").insertOne(newContact);
      return NextResponse.json(newContact);
    }
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
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
    const type = searchParams.get("type");
    const segment = searchParams.get("segment");

    if (type === "all") {
      await db.collection("contacts").deleteMany({ userId: session.user.id });
      return NextResponse.json({ message: "All contacts deleted successfully" });
    }

    if (segment) {
      await db.collection("contacts").deleteMany({ segments: segment, userId: session.user.id });
      return NextResponse.json({ message: `Contacts in segment '${segment}' deleted successfully` });
    }

    return NextResponse.json(
      { error: "Invalid delete request" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error deleting contacts:", error);
    return NextResponse.json(
      { error: "Failed to delete contacts" },
      { status: 500 }
    );
  }
}

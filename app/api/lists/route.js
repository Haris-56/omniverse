import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

export async function GET(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const lists = await db.collection("lists").find({ userId: session.user.id }).sort({ createdAt: -1 }).toArray();
    
    // Optional: Get contact counts for each list
    // This might be expensive if there are many lists, but good for UX
    const listsWithCounts = await Promise.all(lists.map(async (list) => {
      const count = await db.collection("contacts").countDocuments({ listId: list._id.toString(), userId: session.user.id });
      return { ...list, count };
    }));

    return NextResponse.json(listsWithCounts);
  } catch (error) {
    console.error("Error fetching lists:", error);
    return NextResponse.json({ error: "Failed to fetch lists" }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const { name, segment } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "List name is required" }, { status: 400 });
    }

    const newList = {
      userId: session.user.id,
      name,
      segment: segment || "General",
      createdAt: new Date(),
    };

    const result = await db.collection("lists").insertOne(newList);
    return NextResponse.json({ ...newList, _id: result.insertedId });
  } catch (error) {
    console.error("Error creating list:", error);
    return NextResponse.json({ error: "Failed to create list" }, { status: 500 });
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "List ID is required" }, { status: 400 });
    }

    // Delete the list, ensuring it belongs to the user
    const result = await db.collection("lists").deleteOne({ _id: new ObjectId(id), userId: session.user.id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "List not found or unauthorized" }, { status: 404 });
    }

    // Delete all contacts in this list (also belonging to user, implicitly true if list was theirs, but good to check)
    await db.collection("contacts").deleteMany({ listId: id, userId: session.user.id });

    return NextResponse.json({ message: "List and its contacts deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error);
    return NextResponse.json({ error: "Failed to delete list" }, { status: 500 });
  }
}

import { getDb } from "@/app/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const collections = await db.listCollections().toArray();

    return Response.json({
      ok: true,
      message: "MongoDB connected successfully!",
      collections: collections.map(c => c.name),
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: error.message,
    }, { status: 500 });
  }
}

import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  family: 4, // Force IPv4
  connectTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000, // 45 seconds
};

if (!uri && process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  throw new Error("Please add MONGODB_URI to environment variables");
}

let clients;
let clientPromise;

if (!global._mongoClientPromise) {
  clients = new MongoClient(uri, options);
  global._mongoClientPromise = clients.connect()
    .catch(err => {
      console.error("Failed to connect to MongoDB:", err);
      throw err;
    });
}

clientPromise = global._mongoClientPromise;

export default clientPromise;

export async function getDb() {
  try {
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB || "test");
  } catch (error) {
    console.error("Error getting database instance:", error);
    throw new Error("Database connection failed");
  }
}

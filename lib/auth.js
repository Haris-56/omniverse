import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "./mongodb";

const client = await clientPromise;
const db = client.db(process.env.MONGODB_DB || "omniverse");

export const auth = betterAuth({
    database: mongodbAdapter(db),
    trustedOrigins: ["http://localhost:3000", "http://206.189.222.49:3000", "http://206.189.222.49", "https://greetify360.site", "http://greetify360.site"],
    emailAndPassword: { 
        enabled: true, 
    },
    user: {
        fields: {
            role: {
                type: "string",
                defaultValue: "user",
            }
        }
    },
    session: {
        activePeriod: 60 * 60 * 24 * 30, // 30 days
        updateAge: 60 * 60 * 24, // 1 day
    }
});
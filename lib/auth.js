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
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
            },
            status: {
                type: "string",
                defaultValue: "Locked"
            },
            plan: {
                type: "string",
                defaultValue: "$0 Restricted Plan"
            },
            onboardingCompleted: {
                type: "boolean",
                defaultValue: false
            },
            hardwareIdentifier: {
                type: "string",
                required: false
            },
            lastIpAddress: {
                type: "string",
                required: false
            },
            sybilFlagged: {
                type: "boolean",
                defaultValue: false
            }
        }
    },
    session: {
        activePeriod: 60 * 60 * 24 * 30, // 30 days
        updateAge: 60 * 60 * 24, // 1 day
    },
});
import { decrypt } from "./lib/encryption.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const enc = "94a050ee4c7397989b6f42de93eeb8c0:0e3bb4dece1fda5eb37892706595ab2a52e8002b5f2af4593b1f0bbcecf54b9b4ef38919bcf3587843d6e0de518ffcc2913b33a5420628ae37b409ce1b9e716e";

try {
  const dec = decrypt(enc);
  console.log("Decrypted value:", dec);
} catch (e) {
  console.error("Failed to decrypt:", e);
}

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import { decrypt } from "@/lib/encryption";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const db = await getDb();

    // 1. Find user
    const user = await db.collection("user").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
    }

    // 2. Compare password
    let isPasswordValid = false;
    if (user.password) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    }

    if (!isPasswordValid) {
      const account = await db.collection("account").findOne({ 
        userId: { $in: [user._id, user._id.toString()] }, 
        providerId: "credential" 
      });
      if (account && account.password) {
        try {
          const decrypted = decrypt(account.password);
          if (decrypted && decrypted === password) {
            isPasswordValid = true;
          }
        } catch (e) {
          console.error("AES Decryption failed, falling back to bcrypt:", e.message);
        }
        if (!isPasswordValid) {
          try {
            isPasswordValid = await bcrypt.compare(password, account.password);
          } catch (e) {
            // Ignore bcrypt errors
          }
        }
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
    }

    // 3. Generate 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Save verification code to MongoDB
    await db.collection("verification_codes").updateOne(
      { email },
      { 
        $set: { 
          code, 
          email,
          createdAt: new Date() 
        } 
      },
      { upsert: true }
    );

    // Log OTP to terminal console
    console.log("------------------------------------------");
    console.log(`[USER LOGIN OTP] FOR ${email}: ${code}`);
    console.log("------------------------------------------");

    // 5. Send OTP via Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 5000,
      socketTimeout: 5000,
    });

    try {
      await transporter.sendMail({
        from: '"Omniverse Security" <no-reply@omniverse.com>',
        to: email,
        subject: "🔒 Login Verification Required - OTP",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f9f9f9; border-radius: 10px; max-width: 500px; margin: auto; border: 1px solid #ddd;">
            <h2 style="color: #8245EF; text-align: center;">Security Verification</h2>
            <p>Hello,</p>
            <p>To finalize your login request on Omniverse, please verify your identity using this secure 6-digit OTP code:</p>
            <div style="background-color: #eee; padding: 20px; font-size: 28px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 5px; margin: 20px 0; color: #161932;">
              ${code}
            </div>
            <p style="color: #666; font-size: 12px; text-align: center;">This code will expire in 10 minutes. If you did not request this login, please change your password immediately.</p>
          </div>
        `
      });
    } catch (mailError) {
      console.error("Mail send failed in Login OTP request:", mailError.message);
    }

    return NextResponse.json({ status: "OTP_SENT", message: "OTP verification code sent." });
  } catch (error) {
    console.error("Login OTP request error:", error);
    return NextResponse.json({ error: "Failed to generate verification request." }, { status: 500 });
  }
}

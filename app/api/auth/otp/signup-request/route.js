import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    const db = await getDb();

    // 1. Check if user already exists
    const existingUser = await db.collection("user").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    // 2. Hash Password securely before saving temporarily
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Generate 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Save signup information temporarily in verification_codes
    await db.collection("verification_codes").updateOne(
      { email },
      { 
        $set: { 
          code, 
          email,
          name,
          password: hashedPassword, // safely stored hashed password
          createdAt: new Date() 
        } 
      },
      { upsert: true }
    );

    // Log OTP to terminal console
    console.log("------------------------------------------");
    console.log(`[USER SIGNUP OTP] FOR ${email}: ${code}`);
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
        subject: "🔒 Signup Verification Required - OTP",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f9f9f9; border-radius: 10px; max-width: 500px; margin: auto; border: 1px solid #ddd;">
            <h2 style="color: #8245EF; text-align: center;">Welcome to Omniverse!</h2>
            <p>Hello,</p>
            <p>To complete your registration and create your Omniverse account, please verify your email using this secure 6-digit OTP code:</p>
            <div style="background-color: #eee; padding: 20px; font-size: 28px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 5px; margin: 20px 0; color: #161932;">
              ${code}
            </div>
            <p style="color: #666; font-size: 12px; text-align: center;">This code will expire in 10 minutes. If you did not request this signup, please ignore this email.</p>
          </div>
        `
      });
    } catch (mailError) {
      console.error("Mail send failed in Signup OTP request:", mailError.message);
    }

    return NextResponse.json({ status: "OTP_SENT", message: "OTP verification code sent." });
  } catch (error) {
    console.error("Signup OTP request error:", error);
    return NextResponse.json({ error: "Failed to generate verification request." }, { status: 500 });
  }
}

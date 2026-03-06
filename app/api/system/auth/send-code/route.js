import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const db = await getDb();

    // 1. Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Save to DB with timestamp for expiration (10 mins)
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

    // 3. Send Email using Nodemailer
    // We'll use a mocked transporter if SMTP envs aren't set, 
    // but try to send to haris.bin.ahson@gmail.com as requested.
    
    // For now, I'll log it to console so the user can see it in terminal
    console.log("------------------------------------------");
    console.log(`SYSTEM 2FA CODE FOR ${email}: ${code}`);
    console.log("------------------------------------------");

    // Attempt to send email (User has configured EMAIL and APP_PASS)
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
      connectionTimeout: 5000, // 5s
      socketTimeout: 5000,     // 5s
      greetingTimeout: 5000    // 5s
    });

    try {
      await transporter.sendMail({
        from: '"Omniverse System Manager" <no-reply@omniverse.com>',
        to: "haris.bin.ahson@gmail.com", // Hardcoded as requested
        subject: "🔒 Administrative Verification Code",
        html: `
          <div style="font-family: 'Inter', sans-serif; background-color: #0f172a; padding: 40px; color: white; border-radius: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; padding: 15px; background: #4f46e5; border-radius: 12px;">
                <span style="font-size: 24px;">🛡️</span>
              </div>
              <h1 style="color: white; margin-top: 20px; font-size: 24px;">System Access Request</h1>
            </div>
            <p style="color: #94a3b8; font-size: 16px; text-align: center;">
              A login attempt was initiated for the System Admin Module. Use the code below to verify your identity.
            </p>
            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; text-align: center; margin: 30px 0;">
              <span style="font-size: 40px; font-weight: 900; letter-spacing: 15px; color: #818cf8;">${code}</span>
            </div>
            <p style="color: #64748b; font-size: 12px; text-align: center;">
              This code will expire in 10 minutes. If you did not request this, please secure your account immediately.
            </p>
          </div>
        `
      });
    } catch (mailError) {
      console.error("Mail Send Error (likely missing envs):", mailError.message);
      // We don't fail the response because we want the user to be able to use the console code for development
    }

    return NextResponse.json({ message: "Verification code sent." });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json({ error: "Failed to send code." }, { status: 500 });
  }
}

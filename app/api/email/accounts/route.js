import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { encrypt } from "@/lib/encryption";
import nodemailer from "nodemailer";

export async function GET(req) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const accounts = await db.collection("email_accounts")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .project({ password: 0 }) // Do not return password
      .toArray();
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching email accounts:", error);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
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
    const { 
      provider, // 'gmail', 'outlook', 'custom'
      email, 
      password, // App Password
      smtpHost, 
      smtpPort, 
      smtpSecure, // boolean
      dailyLimit,
      hourlyLimit,
      timeZone,
      trackingOpen,
      trackingClick,
      warmupEnabled
    } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Determine SMTP settings based on provider or custom
    let host = smtpHost;
    let port = smtpPort;
    let secure = smtpSecure;

    if (provider === 'gmail') {
      host = 'smtp.gmail.com';
      port = 465;
      secure = true;
    } else if (provider === 'outlook') {
      host = 'smtp.office365.com';
      port = 587;
      secure = false; // StartTLS
    }

    if (!host || !port) {
      return NextResponse.json({ error: "SMTP Host and Port are required" }, { status: 400 });
    }

    // Verify connection with Nodemailer
    const { getAssignedProxy } = await import("@/lib/proxy-allocator");
    const { SocksProxyAgent } = await import("socks-proxy-agent");
    const { HttpsProxyAgent } = await import("https-proxy-agent");

    let proxyAgent = undefined;
    let proxyDetails = null;

    try {
        const assignedProxy = await getAssignedProxy(session.user.id, 'email');
        if (assignedProxy) {
            const { host, port, protocol, auth } = assignedProxy;
            const authStr = auth?.username ? `${encodeURIComponent(auth.username)}:${encodeURIComponent(auth.password)}@` : '';
            const proxyUrl = `${protocol}://${authStr}${host}:${port}`;
            
            if (protocol.startsWith('socks')) {
                proxyAgent = new SocksProxyAgent(proxyUrl);
            } else {
                proxyAgent = new HttpsProxyAgent(proxyUrl);
            }

            proxyDetails = {
                host, port, protocol,
                username: auth?.username,
                password: auth?.password,
                url: proxyUrl // Store for quick access
            };
        }
    } catch (e) {
        console.warn("Failed to assign proxy for email, falling back to direct connection:", e.message);
        // We can choose to fail hard here or allow direct. 
        // Request says "1 ip for 1 email". Stick to proxy? 
        // "everything in the whole project is fully dynamic". 
        // Let's allow direct if no proxy but log it? Or fail? 
        // The allocator throws if no proxy. So we should probably return error to user.
        return NextResponse.json({ error: "No proxy available: " + e.message }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: secure,
      auth: {
        user: email,
        pass: password,
      },
      agent: proxyAgent, // Use the proxy agent
      logger: true,
      debug: true
    });

    try {
      await transporter.verify();
      
      // Send Test Email
      const testRecipient = body.testEmail || "haris.bin.ahson@gmail.com";
      await transporter.sendMail({
        from: email,
        to: testRecipient,
        subject: "Omniverse SMTP Connection Test",
        text: "Your email account has been successfully connected to the Omniverse Automation Platform.",
        html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #4F46E5;">SMTP Connected Successfully</h2>
          <p>This email confirms that your outgoing server credentials are working correctly.</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">Sent via Omniverse Email Engine</p>
        </div>`
      });

    } catch (verifyError) {
      console.error("SMTP Verify Error:", verifyError);
      return NextResponse.json({ 
        status: "Failed", 
        failureReason: verifyError.message || "Connection refused" 
      }, { status: 400 });
    }

    // Connection successful - Save to DB
    const newAccount = {
      userId: session.user.id,
      email,
      provider,
      smtpConfig: {
        host,
        port: Number(port),
        secure,
        user: email, 
      },
      proxy: proxyDetails, // Save proxy
      password: encrypt(password), // Encrypt!
      settings: {
        // Defaults, can be overridden in Campaign
        dailyLimit: 50,
        hourlyLimit: 10,
        timeZone: body.timeZone || 'UTC',
        warmupEnabled: false,
        tracking: {
          open: true,
          click: true
        }
      },
      stats: {
        sent: 0,
        bounced: 0,
        complaints: 0
      },
      status: "Connected",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("email_accounts").insertOne(newAccount);
    
    // Return without password
    const { password: _, ...accountSafe } = newAccount;
    return NextResponse.json({ ...accountSafe, _id: result.insertedId });

  } catch (error) {
    console.error("Error connecting email account:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

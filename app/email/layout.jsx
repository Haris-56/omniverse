"use client";

import { useEffect } from "react";

export default function EmailLayout({ children }) {
  // Simple client-side trigger for the automation engine
  // In production, this should be replaced by Vercel Cron or a dedicated worker
  useEffect(() => {
    const runEngine = async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
           console.log("Triggering Email Engine Tick...");
        }
        await fetch("/api/cron/email-engine", { cache: 'no-store' });
      } catch (err) {
        console.error("Engine Trigger Failed:", err);
      }
    };

    // Run immediately on mount
    runEngine();

    // Run every 60 seconds
    const interval = setInterval(runEngine, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="email-module-layout">
      {children}
    </div>
  );
}

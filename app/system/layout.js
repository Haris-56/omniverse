import { getDb } from "@/lib/mongodb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, Users, CreditCard, 
  MapPin, Shield, Activity, LogOut, ChevronRight
} from "lucide-react";
import Link from "next/link";
import SidebarLink from "./SidebarLink";
import LogoutButton from "./LogoutButton";

export default async function SystemLayout({ children }) {
  // 1. Strict Auth Check
  const cookieStore = await cookies();
  const token = cookieStore.get("system_admin_token")?.value;

  if (!token) {
    console.log("[SystemLayout] Missing token, redirecting to /system-login");
    redirect("/system-login");
  }

  const db = await getDb();
  const session = await db.collection("system_sessions").findOne({ 
    token,
    expiresAt: { $gt: new Date() }
  });

  if (!session) {
    console.log("[SystemLayout] Invalid or expired session instance, redirecting to /system-login");
    redirect("/system-login");
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar - Dedicated System Admin Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-100">
              Ω
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Omniverse</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">System Admin</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            <SidebarLink href="/system" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <SidebarLink href="/system/users" icon={<Users size={18} />} label="User Management" />
            <SidebarLink href="/system/plans" icon={<CreditCard size={18} />} label="Subscription Plans" />
            <SidebarLink href="/system/ips" icon={<MapPin size={18} />} label="IP Management" />
            <SidebarLink href="/system/settings" icon={<Shield size={18} />} label="System Limits" />
            <SidebarLink href="/system/logs" icon={<Activity size={18} />} label="Audit Logs" />
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-50">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-40">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Infrastructure Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <h2 className="text-sm font-black text-slate-900">System Monitoring Active</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Node:</span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">Level 4 Administrator</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-400">
              {session.email.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 p-10 lg:p-14">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

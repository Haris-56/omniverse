import { getDb } from "@/lib/mongodb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, Users, CreditCard, 
  MapPin, Shield, Activity, LogOut, ChevronRight,
  ShieldCheck, Cpu, Globe, Zap, Hexagon
} from "lucide-react";
import Link from "next/link";
import SidebarLink from "./SidebarLink";
import LogoutButton from "./LogoutButton";


export default async function SystemLayout({ children }) {
  // 1. Strict Auth Check
  const cookieStore = await cookies();
  const token = cookieStore.get("system_admin_token")?.value;

  if (!token) {
    redirect("/system-login");
  }

  const db = await getDb();
  const session = await db.collection("system_sessions").findOne({ 
    token,
    expiresAt: { $gt: new Date() }
  });

  if (!session) {
    redirect("/system-login");
  }

  return (
    <div className="flex h-screen bg-[#FCF8FE] text-[#161932] overflow-hidden font-sans grid-background relative">
      
      {/* Sidebar - Dedicated System Admin Sidebar */}
      <aside className="w-[280px] bg-white border-r border-[#8245EF]/15 flex flex-col h-full shadow-[10px_0_30px_rgba(130, 69, 239,0.05)] relative z-50">
        <div className="p-6 flex flex-col h-full">
          <div className="flex flex-col items-center gap-4 mb-10 group cursor-pointer text-center">
            <Link href="/" className="w-12 h-12 bg-[#8245EF] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-all duration-500">
               <ShieldCheck size={24} strokeWidth={2.5} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[#161932] uppercase tracking-wide">Omniverse</h1>
              <p className="text-[10px] font-bold text-[#8245EF] uppercase tracking-widest font-mono mt-1">System Admin</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
            <h3 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-4 ml-4">Pages & Nav</h3>
            <SidebarLink href="/" icon={<Globe size={18} />} label="Return to App" />
            <div className="h-4"></div>
            <h3 className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-4 ml-4">System Settings</h3>
            <SidebarLink href="/system" icon={<LayoutDashboard size={18} />} label="Dashboard Hub" />
            <SidebarLink href="/system/users" icon={<Users size={18} />} label="User Registry" />
            <SidebarLink href="/system/plans" icon={<CreditCard size={18} />} label="Service Matrix" />
            <SidebarLink href="/system/ips" icon={<MapPin size={18} />} label="Proxy Ingress" />
            <SidebarLink href="/system/settings" icon={<Shield size={18} />} label="Safety Protocol" />
            <SidebarLink href="/system/logs" icon={<Activity size={18} />} label="Audit Records" />
          </nav>

          <div className="mt-auto pt-6 border-t border-[#8245EF]/10">
{/* Removed operator display per request */}
             <LogoutButton />
          </div>
        </div>

        {/* Texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-[#FCF8FE]/80 backdrop-blur-md border-b border-[#8245EF]/15 px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-white border border-[#8245EF]/15 rounded-full shadow-sm">
               <div className="w-2 h-2 bg-[#8245EF] rounded-full animate-pulse" />
               <h2 className="text-[10px] font-bold text-[#8245EF] uppercase tracking-wider">System Active</h2>
            </div>
            
            <div className="h-8 w-[1px] bg-[#8245EF]/20 hidden xl:block" />

            <div>
              <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Status</p>
              <h2 className="text-sm font-bold text-[#161932] uppercase tracking-wide flex items-center gap-2">
                 <Cpu size={16} className="text-[#8245EF]" />
                 Authority Mode
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Latency</span>
              <span className="text-sm font-bold text-[#161932] flex items-center gap-2 justify-end mt-1">
                 <Zap size={14} className="text-[#8245EF]" />
                 18ms
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-[#8245EF]/20 flex items-center justify-center font-bold text-[#8245EF] shadow-sm hover:bg-[#FCF8FE] cursor-pointer">
              {session.email.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto custom-scrollbar p-6 lg:p-12 relative">
           {/* Floating Accents */}
           <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#8245EF]/[0.05] rounded-full blur-[100px] pointer-events-none" />
           <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#64748b]/[0.05] rounded-full blur-[100px] pointer-events-none" />
           
          <div className="w-full animate-in fade-in slide-in-from-bottom-5 duration-500">
            {children}
          </div>
        </div>
      </main>

      {/* Decorative Text */}
      {/* Decorative Text */}
      <h2 className="fixed bottom-10 right-10 text-[10rem] font-black text-[#8245EF]/[0.03] pointer-events-none select-none tracking-[0.5em] z-0 uppercase font-sans">Admin</h2>
    </div>
  );
}

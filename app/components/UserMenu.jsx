"use client";

import { useState, useRef, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { LogOut, User, ChevronDown, ShieldCheck, Activity, Hexagon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  if (!session) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 bg-white/40 px-4 py-2 rounded-2xl border border-[#B78D7D]/15 hover:bg-white hover:border-[#B78D7D]/30 transition-all outline-none group shadow-sm"
      >
        <div className="w-9 h-9 rounded-xl bg-[#B78D7D] text-white flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform border border-white/10 uppercase font-mono">
          {session.user?.name?.charAt(0) || "U"}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[11px] font-black text-[#3E3A39] max-w-[120px] lg:max-w-[150px] truncate uppercase tracking-tight">
            {session.user?.name}
          </p>
          <div className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 bg-[#B78D7D] rounded-full animate-pulse" />
             <p className="text-[9px] text-[#B78D7D] font-black uppercase tracking-widest font-mono opacity-70">Operator</p>
          </div>
        </div>
        <ChevronDown size={16} className={`text-[#B2AAA6] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? "rotate-180 text-[#B78D7D]" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-72 bg-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(183,141,125,0.15)] border border-[#B78D7D]/10 p-4 animate-in fade-in zoom-in-95 duration-500 origin-top-right z-[1000] overflow-hidden">
          {/* Decorative Backdrop */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          <div className="px-6 py-6 border-b border-[#B78D7D]/10 mb-4 bg-[#F8F4F2]/50 rounded-[2rem] relative z-10">
            <p className="text-sm font-black text-[#3E3A39] uppercase tracking-tighter leading-none">{session.user?.name}</p>
            <p className="text-[10px] text-[#B2AAA6] truncate mt-3 font-mono font-black uppercase tracking-wider">{session.user?.email}</p>
          </div>
          
          <div className="space-y-2 relative z-10 px-2">
            <button className="w-full text-left px-5 py-4 text-[10px] font-black text-[#8E7A70] hover:bg-[#F8F4F2] hover:text-[#B78D7D] rounded-2xl flex items-center gap-4 transition-all group uppercase tracking-widest font-mono">
              <div className="p-2 bg-white rounded-lg border border-[#B78D7D]/10 group-hover:border-[#B78D7D]/30 transition-all">
                 <User size={16} className="text-[#B2AAA6] group-hover:text-[#B78D7D]" />
              </div>
              Technical_Profile
            </button>
            <button 
              onClick={handleSignOut}
              className="w-full text-left px-5 py-4 text-[10px] font-black text-rose-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl flex items-center gap-4 transition-all group uppercase tracking-widest font-mono"
            >
              <div className="p-2 bg-white rounded-lg border border-rose-100 group-hover:border-rose-300 transition-all">
                 <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
              </div>
              Terminate_Session
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-[#B78D7D]/5 text-center relative z-10">
             <div className="flex items-center justify-center gap-3">
                <Activity size={12} className="text-[#B78D7D] opacity-40 animate-pulse" />
                <span className="text-[8px] font-black text-[#B2AAA6] uppercase tracking-[0.4em] font-mono">Node_Secure</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

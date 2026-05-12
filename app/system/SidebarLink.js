"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Hexagon } from "lucide-react";

export default function SidebarLink({ href, icon, label }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/system" && pathname.startsWith(href));

  return (
    <Link 
      href={href}
      className={`
        flex items-center justify-between px-8 py-4.5 rounded-[1.75rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 group relative overflow-hidden border-2
        ${isActive 
          ? 'bg-[#8245EF] text-white border-transparent shadow-[0_15px_35px_rgba(130, 69, 239,0.3)] scale-[1.02]' 
          : 'text-[#94a3b8] hover:bg-[#FCF8FE] hover:text-[#8245EF] border-transparent hover:border-[#8245EF]/10'}
      `}
    >
      {isActive && (
        <div className="absolute inset-y-0 left-0 w-1.5 bg-white/40 rounded-r-full animate-in slide-in-from-left-2 duration-700" />
      )}
      
      <div className="flex items-center gap-5 relative z-10 transition-transform duration-500 group-hover:translate-x-1">
        <span className={`transition-all duration-500 ${isActive ? 'text-white scale-110' : 'text-[#8245EF]/40 group-hover:text-[#8245EF]'}`}>
          {icon}
        </span>
        <span className="font-mono tracking-[0.3em] truncate">{label}</span>
      </div>
      
      <div className="relative flex items-center justify-center">
         <ChevronRight 
            size={18} 
            className={`transition-all relative z-10 duration-500 ${isActive ? 'translate-x-0 opacity-100 text-white' : '-translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 text-[#8245EF]'}`} 
         />
         {isActive && (
            <Hexagon size={24} className="absolute text-white/10 animate-spin-slow opacity-50" />
         )}
      </div>

      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] group-hover:opacity-[0.08] transition-opacity" />
    </Link>
  );
}

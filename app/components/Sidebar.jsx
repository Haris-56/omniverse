"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Wrench,
  Bot,
  PenTool,
  HelpCircle,
  X,
  Globe,
  ChevronRight,
  ShieldCheck,
  Activity,
  ChevronLeft,
  ChevronDown,
  Cpu,
  Zap,
  Hexagon
} from "lucide-react";

export default function Sidebar({ onClose, isSidebarOpen }) {
  const pathname = usePathname();
  const [active, setActive] = useState("/");

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const menu = [
    {
      group: "Main",
      items: [
        { label: "Dashboard", icon: <LayoutDashboard size={18} />, route: "/" },
        { label: "My People", icon: <Users size={18} />, route: "/contact-list" },
        { label: "Make Plans", icon: <Wrench size={18} />, route: "/campaign-builder" },
      ]
    },
    {
      group: "Social Media",
      items: [
        { label: "Facebook", icon: <Facebook size={18} />, route: "/facebook" },
        { label: "Instagram", icon: <Instagram size={18} />, route: "/instagram" },
        { label: "LinkedIn", icon: <Linkedin size={18} />, route: "/linkedin" },
        { label: "Email", icon: <Mail size={18} />, route: "/email" },
      ]
    },
    {
      group: "AI Writing",
      items: [
        { label: "AI Writer", icon: <Bot size={18} />, route: "/ai-agent" },
        { label: "AI Helper", icon: <PenTool size={18} />, route: "/ai-creator" },
      ]
    },
    {
      group: "Settings & Help",
      items: [
        { label: "Guide", icon: <ShieldCheck size={18} />, route: "/documentation" },
        { label: "Support", icon: <HelpCircle size={18} />, route: "/support" },
      ]
    }
  ];

  return (
    <div className="h-full w-full flex flex-col bg-[#B78D7D] font-sans border-r border-white/10 relative overflow-hidden text-white">
      
      {/* Visual Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* BRANDING HEADER */}
      <div className="p-6 pb-8 flex flex-col gap-4 relative z-10 text-center items-center">
        <div className="w-full flex justify-end xl:hidden">
          <button onClick={onClose} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white">
            <X size={16} />
          </button>
        </div>
        <Link href="/" className="group cursor-pointer">
           <div className="w-12 h-12 bg-white border-2 border-white/20 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-500">
             <Hexagon size={24} strokeWidth={2.5} className="text-[#B78D7D] group-hover:rotate-12 transition-transform duration-700" />
           </div>
        </Link>
        <div className="space-y-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70">Omniverse</h2>
        </div>
      </div>

      {/* NAVIGATION SECTIONS */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-8 custom-scrollbar relative z-10">
        {menu.map((section, sIdx) => (
          <div key={sIdx} className="space-y-3">
             <h3 className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em] px-4 font-mono">
               {section.group}
             </h3>
             <div className="space-y-0.5">
               {section.items.map((item) => {
                 const isActive = active === item.route || (item.route !== '/' && active.startsWith(item.route));
                 return (
                   <Link
                     key={item.label}
                     href={item.route}
                     className={`group w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all font-mono border-2 ${
                       isActive
                         ? "bg-white text-[#B78D7D] border-transparent shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                         : "text-white/70 hover:bg-white/10 hover:text-white border-transparent"
                     }`}
                   >
                     <div className={`transition-all ${isActive ? "scale-110 text-[#B78D7D]" : "text-white/50 group-hover:text-white group-hover:scale-110"}`}>
                       {item.icon}
                     </div>
                     <span className="truncate">{item.label}</span>
                     {isActive && <div className="ml-auto w-1 h-1 bg-[#B78D7D] rounded-full shadow-[0_0_5px_rgba(183,141,125,0.5)]" />}
                   </Link>
                 );
               })}
             </div>
          </div>
        ))}
      </nav>

      {/* FOOTER branding */}
      <div className="p-6 mt-auto relative z-10 text-center border-t border-white/10 bg-black/5 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-3">
           <Activity size={12} className="text-white/60 animate-pulse" />
           <p className="text-[8px] font-black text-white/40 tracking-[0.4em] uppercase font-mono">Everything is ready</p>
        </div>
      </div>
    </div>
  );
}

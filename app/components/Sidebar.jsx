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
      group: "Core",
      items: [
        { label: "Dashboard", icon: <LayoutDashboard size={18} />, route: "/" },
        { label: "My People", icon: <Users size={18} />, route: "/contact-list" },
        { label: "Make Plans", icon: <Wrench size={18} />, route: "/campaign-builder" },
      ]
    },
    {
      group: "Socials",
      items: [
        { label: "Facebook", icon: <Facebook size={18} />, route: "/facebook" },
        { label: "Instagram", icon: <Instagram size={18} />, route: "/instagram" },
        { label: "LinkedIn", icon: <Linkedin size={18} />, route: "/linkedin" },
        { label: "Email", icon: <Mail size={18} />, route: "/email" },
      ]
    },
    {
      group: "AI Tools",
      items: [
        { label: "AI Writer", icon: <Bot size={18} />, route: "/ai-agent" },
        { label: "AI Assistant", icon: <PenTool size={18} />, route: "/ai-creator" },
      ]
    },
    {
      group: "Help",
      items: [
        { label: "Guide", icon: <ShieldCheck size={18} />, route: "/documentation" },
        { label: "Support", icon: <HelpCircle size={18} />, route: "/support" },
      ]
    }
  ];

  return (
    <div className="h-full w-full flex flex-col bg-[#FCF8FE] font-sans border-r border-[#161932]/10 relative overflow-hidden text-slate-700">
      
      {/* Visual Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* BRANDING HEADER */}
      <div className="p-6 pb-8 flex flex-col gap-4 relative z-10 text-center items-center">
        <div className="w-full flex justify-end xl:hidden">
          <button onClick={onClose} className="p-2 bg-[#161932]/5 rounded-lg hover:bg-[#161932]/10 transition-all text-[#161932]">
            <X size={16} />
          </button>
        </div>
        <Link href="/" className="group cursor-pointer">
           <div className="w-12 h-12 bg-[#8245EF] rounded-xl flex items-center justify-center shadow-lg shadow-[#8245EF]/20 group-hover:scale-110 transition-transform duration-500">
             <Hexagon size={24} strokeWidth={2.5} className="text-white group-hover:rotate-12 transition-transform duration-700" />
           </div>
        </Link>
        <div className="space-y-1">
          <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#161932]">Omniverse</h2>
        </div>
      </div>

      {/* NAVIGATION SECTIONS */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-8 custom-scrollbar relative z-10">
        {menu.map((section, sIdx) => (
          <div key={sIdx} className="space-y-3">
             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">
               {section.group}
             </h3>
             <div className="space-y-0.5">
               {section.items.map((item) => {
                 const isActive = active === item.route || (item.route !== '/' && active.startsWith(item.route));
                 return (
                     <Link
                     key={item.label}
                     href={item.route}
                     className={`group w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border-2 ${
                       isActive
                         ? "bg-[#161932] text-white border-transparent shadow-lg"
                         : "text-gray-500 hover:text-white hover:bg-[#161932] border-transparent"
                     }`}
                   >
                     <div className={`transition-all ${isActive ? "scale-110 text-[#8245EF]" : "text-slate-400 group-hover:text-[#8245EF] group-hover:scale-110"}`}>
                       {item.icon}
                     </div>
                     <span className="truncate">{item.label}</span>
                     {isActive && <div className="ml-auto w-1.5 h-1.5 bg-[#8245EF] rounded-full shadow-[0_0_8px_rgba(130,69,239,0.8)]" />}
                   </Link>
                 );
               })}
             </div>
          </div>
        ))}
      </nav>

      {/* FOOTER branding */}
      <div className="p-6 mt-auto relative z-10 text-center border-t border-[#161932]/10 bg-transparent">
        <div className="flex items-center justify-center gap-3">
           <Activity size={12} className="text-gray-400 animate-pulse" />
           <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Active</p>
        </div>
      </div>
    </div>
  );
}

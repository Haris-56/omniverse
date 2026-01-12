"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Settings2,
  ChevronRight,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function Sidebar({ onClose }) {
  const pathname = usePathname();
  const [active, setActive] = useState("/");

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const menu = [
    {
      group: "Core Fleet",
      items: [
        { label: "Command Center", icon: <LayoutDashboard size={20} />, route: "/" },
        { label: "Segment Workspace", icon: <Users size={20} />, route: "/contact-list" },
        { label: "Campaign Architect", icon: <Wrench size={20} />, route: "/campaign-builder" },
      ]
    },
    {
      group: "Outreach Nodes",
      items: [
        { label: "Facebook Matrix", icon: <Facebook size={20} />, route: "/facebook" },
        { label: "Instagram Pulse", icon: <Instagram size={20} />, route: "/instagram" },
        { label: "LinkedIn Nexus", icon: <Linkedin size={20} />, route: "/linkedin" },
        { label: "Email Horizon", icon: <Mail size={20} />, route: "/email" },
      ]
    },
    {
      group: "Intelligence",
      items: [
        { label: "AI Fleet Agent", icon: <Bot size={20} />, route: "/ai-agent" },
        { label: "Persona Creator", icon: <PenTool size={20} />, route: "/ai-creator" },
      ]
    },
    {
       group: "System",
       items: [
         { label: "Node Support", icon: <HelpCircle size={20} />, route: "/support" },
       ]
    }
  ];

  return (
    <div className="h-full w-72 bg-white flex flex-col border-r border-gray-100 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.02)]">
      
      {/* BRANDING HEADER */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
           <div className="w-12 h-12 bg-[#6F3FF5] rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-purple-200 group-hover:rotate-12 transition-transform duration-500">
             <Globe size={26} />
           </div>
           <div>
             <h2 className="text-xl font-black text-gray-900 tracking-tighter">Omniverse</h2>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 opacity-70">Control Deck</p>
           </div>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl lg:hidden text-gray-400 hover:text-red-500 transition-all shadow-sm"
        >
          <X size={20} />
        </button>
      </div>

      {/* NAVIGATION SECTIONS */}
      <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-10 custom-scrollbar">
        {menu.map((section, sIdx) => (
          <div key={sIdx} className="space-y-3">
             <h3 className="px-5 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em]">
               {section.group}
             </h3>
             <div className="space-y-1.5">
               {section.items.map((item) => {
                 const isActive = active === item.route;
                 return (
                   <Link
                     key={item.label}
                     href={item.route}
                     onClick={() => {
                       if (onClose) onClose();
                     }}
                     className={`group w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                       isActive
                         ? "bg-[#6F3FF5] text-white shadow-xl shadow-purple-200"
                         : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                     }`}
                   >
                     <div className="flex items-center gap-4">
                        <div className={`transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-indigo-600"}`}>
                          {item.icon}
                        </div>
                        <span className="tracking-tight">{item.label}</span>
                     </div>
                     {isActive && <ChevronRight size={14} className="opacity-60" />}
                   </Link>
                 );
               })}
             </div>
          </div>
        ))}
      </nav>

      {/* BOTTOM SYSTEM CARD */}
      <div className="p-6">
         <div className="bg-gray-50 border border-gray-100/50 rounded-3xl p-5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-100 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-3 relative z-10">
               <div className="w-8 h-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <ShieldCheck size={16} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">Level 4 Node</span>
            </div>
            <p className="text-[11px] font-bold text-gray-400 leading-relaxed mb-4 relative z-10">All systems operational in your sector.</p>
            <button className="w-full py-2.5 bg-white border border-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-sm relative z-10">
               View Logs
            </button>
         </div>
      </div>
    </div>
  );
}

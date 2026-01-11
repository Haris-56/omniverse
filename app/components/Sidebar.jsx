"use client";

import { useState } from "react";
import Link from "next/link"; // Import Link from next/link
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
} from "lucide-react";

export default function Sidebar({ onClose }) {
  const [active, setActive] = useState("Dashboard");

  const menu = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      route: "/",
    },
    {
      label: "Contact list",
      icon: <Users size={18} />,
      route: "/contact-list",
    },
    {
      label: "One Click Facebook",
      icon: <Facebook size={18} />,
      route: "/facebook",
    },
    {
      label: "One Click Instagram",
      icon: <Instagram size={18} />,
      route: "/instagram",
    },
    {
      label: "One Click LinkedIn",
      icon: <Linkedin size={18} />,
      route: "/linkedin",
    },
    {
      label: "One Click Email",
      icon: <Mail size={18} />,
      route: "/email",
    },
    {
      label: "Campaign Builder",
      icon: <Wrench size={18} />,
      route: "/campaign-builder",
    },
    { label: "AI Agent", icon: <Bot size={18} />, route: "/ai-agent" },
    {
      label: "AI Creator",
      icon: <PenTool size={18} />,
      route: "/ai-creator",
    },
    { label: "Support", icon: <HelpCircle size={18} />, route: "/support" },
  ];

  return (
    <div className="h-screen w-64 bg-white px-4 py-6 flex flex-col border-r border-gray-50 lg:border-none">
      {/* Logo & Close Button (Mobile) */}
      <div className="mb-10 flex items-center justify-between">
        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          Ω
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg lg:hidden text-gray-500"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu */}
      <nav className="space-y-1 overflow-y-auto flex-1 custom-scrollbar">
        {menu.map((item) => (
          <Link
            key={item.label}
            href={item.route}
            onClick={() => {
              setActive(item.label);
              if (onClose) onClose();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              active === item.label
                ? "bg-[#6B4EFF] text-white shadow-md shadow-[#6B4EFF]/20"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

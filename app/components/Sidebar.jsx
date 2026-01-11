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
} from "lucide-react";

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  const menu = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      route: "/",
    }, // Use '/' for the main dashboard
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
    <div className="h-screen w-64 bg-white border-r px-4 py-6 flex flex-col">
      {/* Logo */}
      <div className="mb-10">
        <div className="w-12 h-12 bg-gray-200 rounded-md" />
      </div>

      {/* Menu */}
      <nav className="space-y-1">
        {menu.map((item) => (
          // Use Link component for routing
          <Link
            key={item.label}
            href={item.route} // Use the predefined route
            onClick={() => setActive(item.label)} // Keep setActive for styling
            // NOTE: The 'className' is now applied directly to the Link component
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm ${
              active === item.label
                ? "bg-[#6B4EFF] text-white"
                : "text-gray-700 hover:bg-gray-100"
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
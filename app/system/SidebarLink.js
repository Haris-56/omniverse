"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function SidebarLink({ href, icon, label }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/system" && pathname.startsWith(href));

  return (
    <Link 
      href={href}
      className={`
        flex items-center justify-between p-4 rounded-2xl font-bold text-sm transition-all group
        ${isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}
      `}
    >
      <div className="flex items-center gap-3">
        <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>{icon}</span>
        <span>{label}</span>
      </div>
      <ChevronRight 
        size={14} 
        className={`transition-all ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} 
      />
    </Link>
  );
}

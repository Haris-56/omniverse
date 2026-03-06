"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/system/auth/logout", { method: "POST" });
      router.push("/system-login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-3 text-slate-400 hover:text-red-600 font-bold text-sm transition-all group px-4 py-3 rounded-xl hover:bg-red-50 w-full"
    >
      <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
      <span>Logout SysAdmin</span>
    </button>
  );
}

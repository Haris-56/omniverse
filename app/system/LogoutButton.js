"use client";

import { LogOut, Power } from "lucide-react";
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
      className="flex items-center gap-4 text-gray-400 hover:text-rose-500 font-bold text-xs uppercase tracking-widest transition-all group px-6 py-4 rounded-xl hover:bg-rose-50 w-full border border-transparent hover:border-rose-100"
    >
      <div className="w-8 h-8 bg-gray-50 group-hover:bg-white rounded-lg flex items-center justify-center transition-all group-hover:rotate-6">
        <Power size={16} />
      </div>
      <span>Logout</span>
    </button>
  );
}

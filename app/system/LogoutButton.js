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
      className="flex items-center gap-5 text-[#94a3b8] hover:text-rose-500 font-black text-[10px] uppercase tracking-[0.3em] transition-all group px-8 py-5 rounded-[1.75rem] hover:bg-rose-50 w-full border-2 border-transparent hover:border-rose-100 font-mono shadow-sm hover:shadow-md"
    >
      <div className="w-10 h-10 bg-[#FCF8FE] group-hover:bg-white rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12">
        <Power size={18} className="transition-transform group-hover:scale-110" />
      </div>
      <span className="italic">Sever_Link</span>
    </button>
  );
}

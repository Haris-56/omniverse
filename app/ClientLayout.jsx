"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import UserMenu from "./components/UserMenu";
import { Menu, ChevronLeft, Zap, Hexagon, Activity } from "lucide-react";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar on navigation
  useEffect(() => {
    if (window.innerWidth < 1280) {
        setIsSidebarOpen(false);
    }
  }, [pathname]);

  const shouldHideSidebar = 
    pathname === "/login" || 
    pathname === "/register" || 
    pathname.includes("/new") || 
    pathname.includes("/edit") || 
    pathname === "/system-login" ||
    pathname.startsWith("/system") ||
    pathname.startsWith("/documentation") ||
    pathname.includes("/campaign-builder/"); 

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-[#FCF8FE] text-[#161932] font-sans grid-background group/main">
      {!shouldHideSidebar && (
        <>
          {/* Mobile Overlay - High Z-Index */}
          <div 
            className={`fixed inset-0 bg-[#161932]/10 backdrop-blur-2xl z-[60] xl:hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar container - Standard width (240px) */}
          <aside className={`
            fixed inset-y-0 left-0 z-[70] xl:relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col shadow-[15px_0_40px_rgba(130, 69, 239,0.04)] border-r border-[#8245EF]/15 overflow-hidden
            ${isSidebarOpen ? "w-[240px] translate-x-0 opacity-100" : "w-0 -translate-x-full opacity-0 pointer-events-none"}
          `}>
             <div className="min-w-[240px] h-full flex flex-col">
                <Sidebar 
                    onClose={() => setIsSidebarOpen(false)} 
                    isSidebarOpen={isSidebarOpen}
                />
             </div>
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative custom-scrollbar flex flex-col transition-all duration-700">
        
        {!shouldHideSidebar && (
          <header className={`fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-10 z-[50] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isSidebarOpen ? 'xl:pl-[240px]' : 'xl:pl-0'} print:hidden`}>
             <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl border-b border-[#8245EF]/15 shadow-sm" />
             
             <div className="flex items-center gap-6 relative z-10">
                <button 
                  onClick={() => setIsSidebarOpen(prev => !prev)}
                  className={`p-2 bg-[#8245EF] text-white rounded-xl shadow-lg transition-all hover:bg-[#6d28d9] active:scale-95 flex items-center justify-center group border border-white/10`}
                  title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                  id="sidebar-toggle-trigger"
                >
                  {isSidebarOpen ? (
                    <ChevronLeft size={18} strokeWidth={3} className="group-hover:-translate-x-0.5 transition-transform duration-500" />
                  ) : (
                    <Menu size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                  )}
                </button>
               
                 <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-100 rounded-lg text-[10px] font-bold text-green-600 leading-none">
                    <Activity size={10} className="animate-pulse" />
                    Active
                 </div>
             </div>
            
            <div className={`relative z-10 flex items-center gap-6`}>
               <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg text-[10px] font-bold text-green-600 transition-all shadow-sm leading-none">
                  <Zap size={10} className="animate-pulse" />
                  Active
               </div>
               <div className="p-0.5 bg-white rounded-full border border-[#8245EF]/15 hover:border-[#8245EF]/30 transition-all shadow-md">
                  <UserMenu />
               </div>
            </div>
          </header>
        )}
        
        <div className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] min-h-full ${!shouldHideSidebar ? 'pt-24 px-6 md:px-12 xl:px-16 pb-24' : ''}`}>
          <div className="max-w-[1400px] mx-auto transition-all duration-700 relative">
            <LockdownOverlay />
            {children}
          </div>
        </div>
      </main>
      
      {/* Platform Branding Watermark */}
      <div className="fixed bottom-8 right-8 pointer-events-none opacity-[0.02] select-none z-0 hidden lg:block">
         <div className="flex items-center gap-4 grayscale">
            <Hexagon size={60} strokeWidth={1} className="text-[#8245EF]" />
            <h1 className="text-[5rem] font-black font-sans -ml-4 tracking-tighter text-[#8245EF]">OMNIVERSE</h1>
         </div>
      </div>
    </div>
  );
}

import { authClient } from "@/lib/auth-client";
import { Lock } from "lucide-react";

function LockdownOverlay() {
   const { data: session, isPending } = authClient.useSession();
   const pathname = usePathname();
   
   if (isPending || !session) return null;

   const isWhitelisted = pathname === "/login" || pathname === "/register" || pathname === "/onboarding";

   // Implementation for Module 01: The Lockdown State
   if (session.user?.status === "Locked" && !isWhitelisted) {
      return (
         <div className="absolute inset-0 z-[100] backdrop-blur-[30px] bg-[#FCF8FE]/80 flex items-center justify-center rounded-[3rem] p-10">
            <div className="bg-white max-w-xl w-full rounded-[4rem] shadow-[0_50px_100px_rgba(130, 69, 239,0.15)] border border-[#8245EF]/20 p-16 text-center animate-in zoom-in-95 duration-500">
               <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-10 border border-rose-100 shadow-inner">
                  <Lock size={40} />
               </div>
               <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Locked</h2>
               <p className="text-gray-500 text-sm font-bold mb-10">
                  Your account is locked. You cannot connect accounts or start plans. Please contact support to unlock it.
               </p>
               <button className="w-full py-5 bg-[#8245EF] text-white font-bold text-xs uppercase rounded-2xl shadow-lg hover:bg-[#6d28d9] transition-all flex items-center justify-center gap-2 active:scale-95">
                  Contact Support
               </button>
            </div>
         </div>
      );
   }
   return null;
}

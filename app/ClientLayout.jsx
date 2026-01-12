"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import UserMenu from "./components/UserMenu";
import { Menu, X } from "lucide-react";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Define routes where Sidebar and Global Header should be hidden
  const shouldHideSidebar = 
    pathname === "/login" || 
    pathname === "/register" || 
    pathname.includes("/edit") ||
    pathname.includes("/campaign-builder/"); // Hide for both list and editor as they are complex UIs

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-[#FAFBFF]">
      {!shouldHideSidebar && (
        <>
          {/* Mobile Overlay - Softer and more premium */}
          <div 
            className={`fixed inset-0 bg-gray-900/10 backdrop-blur-md z-40 lg:hidden transition-opacity duration-500 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar container with refined mobile transitions */}
          <aside className={`
            fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </aside>
        </>
      )}

      <main className="flex-1 overflow-auto bg-[#FAFBFF] relative custom-scrollbar">
        {!shouldHideSidebar && (
          <header className={`fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-40 transition-all duration-500 ${isSidebarOpen ? 'lg:pl-72' : ''}`}>
             {/* Glassmorphic Header for Mobile */}
             <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border-b border-gray-100 lg:hidden" />
             
             <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="relative z-10 p-2.5 bg-white border border-gray-100 hover:bg-gray-50 rounded-xl lg:hidden text-gray-700 shadow-sm transition-all active:scale-90"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className="relative z-10 ml-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
               <UserMenu />
            </div>
          </header>
        )}
        
        <div className={`transition-all duration-500 ${!shouldHideSidebar ? 'pt-20 md:pt-24' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
}

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

  // Define routes where Sidebar should be hidden
  const hideSidebarRoutes = ["/login", "/register"];
  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-gray-50">
      {!shouldHideSidebar && (
        <>
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar container with mobile transitions */}
          <div className={`
            fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition duration-200 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </>
      )}

      <main className="flex-1 overflow-auto bg-gray-50 relative">
        {!shouldHideSidebar && (
          <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 z-40 lg:bg-transparent lg:border-none lg:h-20 lg:absolute">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden text-gray-700"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <UserMenu />
          </header>
        )}
        
        <div className={`pt-16 lg:pt-20`}>
          {children}
        </div>
      </main>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import UserMenu from "./components/UserMenu";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Define routes where Sidebar should be hidden
  const hideSidebarRoutes = ["/login", "/register"];
  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

  return (
    <div className="flex h-screen w-full relative">
      {!shouldHideSidebar && <Sidebar />}
      <main className="flex-1 overflow-auto bg-gray-50 relative pt-20">
        {!shouldHideSidebar && <UserMenu />}
        {children}
      </main>
    </div>
  );
}

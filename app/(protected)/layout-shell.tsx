"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import type { User } from "@/actions/auth";

export function LayoutShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="flex flex-1 flex-col min-w-0">
        <Header user={user} onMenuToggle={openSidebar} />
        <main className="flex-1 p-4 pb-6 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

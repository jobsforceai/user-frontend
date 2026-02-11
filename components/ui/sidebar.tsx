"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/wallet", label: "Wallet" },
  { href: "/buy", label: "Buy Gold" },
  { href: "/sell", label: "Sell Gold" },
  { href: "/scheme", label: "11-Month Scheme" },
  { href: "/delivery", label: "Delivery" },
  { href: "/profile", label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-panel md:block">
      <div className="px-5 py-6">
        <Link href="/" className="text-xl font-semibold text-accent">SG Gold</Link>
      </div>
      <nav className="space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition",
                isActive
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-ink/60 hover:bg-white/5 hover:text-ink"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

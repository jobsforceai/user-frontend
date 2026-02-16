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

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border bg-panel transition-transform duration-200 ease-in-out",
        "md:static md:z-auto md:w-56 md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between px-5 py-6">
        <Link href="/" className="text-xl font-semibold text-accent">SG Gold</Link>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/40 transition hover:bg-white/5 hover:text-ink md:hidden"
          aria-label="Close menu"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm transition",
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

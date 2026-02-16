"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { logout, type User } from "@/actions/auth";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/wallet", label: "Wallet" },
  { href: "/buy", label: "Buy Gold" },
  { href: "/sell", label: "Sell Gold" },
  { href: "/scheme", label: "Scheme" },
  { href: "/delivery", label: "Delivery" },
  { href: "/profile", label: "Profile" },
];

type Props = {
  user: User;
};

export function Header({ user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <header className="flex items-center justify-between border-b border-border bg-panel px-6 py-3">
        {/* Mobile: brand + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-ink/60 hover:text-ink">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-ink">
            <Image src="/logo.png" alt="SG Gold" width={28} height={28} className="h-7 w-7 rounded-sm object-cover" />
            SG <span className="text-accent">Gold</span>
          </Link>
        </div>

        {/* Desktop: empty left */}
        <div className="hidden md:block" />

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="hidden text-sm text-ink/60 sm:inline">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-ink/50 transition hover:border-accent/30 hover:text-accent"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="border-b border-border bg-panel px-4 py-3 md:hidden">
          <nav className="space-y-1">
            {mobileNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-ink/50 hover:bg-white/5 hover:text-ink/70"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}

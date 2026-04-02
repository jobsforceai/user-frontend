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
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#353c55] bg-[#151a29]/90 px-4 py-3 backdrop-blur-xl md:px-6">
        {/* Mobile: brand + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg border border-[#444d69] bg-[#20263a] p-2 text-[#c8cee2] transition hover:border-[#d7af35]/45 hover:text-[#f6d97f]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-[#eef1ff]">
            <Image src="/logo.png" alt="SG Gold" width={28} height={28} className="h-7 w-7 rounded-md object-cover" />
            SG <span className="text-[#f2cd63]">Gold</span>
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-xl border border-[#4a5270] bg-[#20263a]/95 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8e97b3]">Active Route</p>
            <p className="text-sm font-semibold text-[#edf1ff]">{pathname.replace("/", "") || "dashboard"}</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7af35]/35 bg-[#d7af35]/15 text-xs font-semibold text-[#f8df8a]">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="hidden text-sm font-medium text-[#d3d9ec] sm:inline">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-[#4a5270] bg-[#20263a] px-3 py-1.5 text-sm font-medium text-[#c8cee2] transition hover:border-[#d7af35]/45 hover:text-[#f6d97f]"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="border-b border-[#353c55] bg-[#151a29]/95 px-4 py-3 md:hidden">
          <nav className="space-y-1">
            {mobileNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-lg border px-3 py-2 text-sm transition",
                    isActive
                      ? "border-[#d7af35]/40 bg-[#252d43] font-semibold text-[#f7de89]"
                      : "border-transparent text-[#a8b0c7] hover:border-[#4a5270] hover:bg-[#1c2335] hover:text-[#f0f3ff]"
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

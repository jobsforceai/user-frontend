"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";


const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/wallet", label: "Wallet", icon: "M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" },
  { href: "/buy", label: "Buy Gold", icon: "M12 4.5v15m7.5-7.5h-15" },
  { href: "/sell", label: "Sell Gold", icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" },
  { href: "/scheme", label: "11-Month Scheme", icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" },
  { href: "/delivery", label: "Delivery", icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.029-.504 1.029-1.125v-3.505a1.125 1.125 0 00-.311-.78l-2.511-2.511a1.125 1.125 0 00-.78-.311H14.25M3.75 16.5V4.875c0-.621.504-1.125 1.125-1.125h8.25c.621 0 1.125.504 1.125 1.125v11.625" },
  { href: "/profile", label: "Profile", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative hidden w-72 shrink-0 border-r border-[#353c55] bg-[#151a29]/90 md:flex md:flex-col">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(215,175,53,0.14),transparent_45%),radial-gradient(circle_at_82%_100%,rgba(114,94,181,0.18),transparent_45%)]" />

      <div className="relative px-5 pb-4 pt-6">
        <div className="rounded-2xl border border-[#4a5270] bg-[#20263a]/95 p-4 shadow-[0_22px_46px_rgba(0,0,0,0.38)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[#d7af35]/30 bg-[#111625]">
              <Image src="/logo.png" alt="SG Gold" width={40} height={40} className="h-full w-full object-cover" />
            </div>
            <Link href="/" className="text-lg font-black tracking-tight text-[#eef1ff]">
              SG <span className="text-[#f2cd63]">Gold</span>
            </Link>
          </div>
          <p className="mt-3 text-xs text-[#aeb5cc]">Command center for rates, schemes, and secure delivery workflows.</p>
        </div>
      </div>

      <nav className="relative flex-1 space-y-1 px-4 py-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all",
                isActive
                  ? "border-[#d7af35]/40 bg-[#252d43] text-[#f4f6ff] shadow-[0_12px_26px_rgba(0,0,0,0.28)]"
                  : "border-transparent text-[#a8b0c7] hover:border-[#4a5270] hover:bg-[#1c2335] hover:text-[#f0f3ff]"
              )}
            >
              <span className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                isActive
                  ? "border-[#d7af35]/35 bg-[#d7af35]/12 text-[#f8df8a]"
                  : "border-[#3f4762] bg-[#1a2133] text-[#8f98b3] group-hover:text-[#f1f4ff]"
              )}>
                <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </span>
              <span className="font-medium tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="relative border-t border-[#353c55] px-5 py-5">
        <div className="rounded-2xl border border-[#4a5270] bg-[#1e2437] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f2cd63]">Market Sync</p>
          <p className="mt-1 text-xs text-[#aeb5cc]">Live pricing engine connected with managed execution modules.</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Online
          </div>
        </div>
      </div>
    </aside>
  );
}

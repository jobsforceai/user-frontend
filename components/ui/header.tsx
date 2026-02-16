"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, type User } from "@/actions/auth";

type Props = {
  user: User;
  onMenuToggle?: () => void;
};

export function Header({ user, onMenuToggle }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-panel px-4 py-3 md:px-6">
      <div className="flex items-center gap-3 md:hidden">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink/60 transition hover:bg-white/5 hover:text-ink"
          aria-label="Open menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <Link href="/" className="text-lg font-semibold text-accent">SG Gold</Link>
      </div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="hidden text-sm text-ink/60 sm:inline">{user.name}</span>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-ink/60 transition hover:border-accent-dim hover:text-accent"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

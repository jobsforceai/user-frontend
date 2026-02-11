"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, type User } from "@/actions/auth";

type Props = {
  user: User;
};

export function Header({ user }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-panel px-6 py-3">
      <div className="md:hidden">
        <Link href="/" className="text-lg font-semibold text-accent">SG Gold</Link>
      </div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-4">
        <span className="text-sm text-ink/60">{user.name}</span>
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

import { redirect } from "next/navigation";
import { getMe } from "@/actions/auth";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getMe();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#0d1220]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_2%,rgba(215,175,53,0.12),transparent_36%),radial-gradient(circle_at_92%_18%,rgba(114,94,181,0.2),transparent_38%),radial-gradient(circle_at_42%_90%,rgba(73,96,144,0.15),transparent_35%)]" />
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <Header user={user} />
        <main className="relative flex-1 p-4 pb-6 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

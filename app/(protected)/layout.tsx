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
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header user={user} />
        <main className="flex-1 p-4 pb-6 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

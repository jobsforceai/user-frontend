import { redirect } from "next/navigation";
import { getMe } from "@/actions/auth";
import { LayoutShell } from "./layout-shell";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getMe();

  if (!user) {
    redirect("/login");
  }

  return <LayoutShell user={user}>{children}</LayoutShell>;
}

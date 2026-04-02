import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: Props) {
  return (
    <div className={cn("rounded-3xl border border-[#3d4560] bg-[#1a2032]/95 shadow-[0_20px_55px_rgba(0,0,0,0.35)]", className)}>
      {children}
    </div>
  );
}

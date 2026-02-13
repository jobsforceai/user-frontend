"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function RefreshTimer({ intervalSeconds = 60 }: { intervalSeconds?: number }) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(intervalSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          router.refresh();
          return intervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [intervalSeconds, router]);

  return (
    <div className="flex items-center gap-1.5 text-xs text-ink/40">
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Refreshing in {secondsLeft}s</span>
    </div>
  );
}

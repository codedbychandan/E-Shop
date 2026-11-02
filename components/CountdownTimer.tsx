"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  target: number;
  size?: "sm" | "lg";
  className?: string;
}

export function CountdownTimer({ target, size = "sm", className }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, done } = useCountdown(target);

  const units = [
    { label: "Days", value: days },
    { label: "Hrs", value: hours },
    { label: "Min", value: minutes },
    { label: "Sec", value: seconds },
  ];

  if (done) {
    return (
      <span className={cn("font-semibold text-emerald-600", size === "lg" && "text-lg")}>
        Sale ended — new deals soon!
      </span>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)} aria-label="Flash sale countdown">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-2">
          <div
            className={cn(
              "flex flex-col items-center rounded-xl bg-ink text-canvas dark:bg-white dark:text-black",
              size === "lg" ? "min-w-[50px] sm:min-w-[64px] px-1.5 sm:px-2 py-1.5 sm:py-2.5" : "min-w-[46px] sm:min-w-[52px] px-1.5 py-1.5"
            )}
          >
            <span
              className={cn(
                "font-display font-bold tabular-nums leading-none",
                size === "lg" ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
              )}
            >
              {String(u.value).padStart(2, "0")}
            </span>
            <span
              className={cn(
                "mt-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-wide opacity-70",
                size === "lg" && "text-[10px] sm:text-[11px]"
              )}
            >
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className={cn("font-bold text-muted", size === "lg" ? "text-lg sm:text-xl" : "text-sm sm:text-base")}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

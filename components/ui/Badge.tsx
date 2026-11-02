"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "brand" | "green" | "red" | "amber" | "blue" | "neutral";

const tones: Record<Tone, string> = {
  brand: "bg-brand-500/10 text-brand-700 dark:text-brand-300",
  green: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  red: "bg-red-500/10 text-red-600 dark:text-red-400",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  neutral: "bg-surface2 text-muted",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

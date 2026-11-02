"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { TimelineStep } from "@/data/types";
import { cn } from "@/lib/utils";

export function OrderTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative">
      {steps.map((s, i) => (
        <motion.li
          key={s.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          className="relative flex gap-4 pb-8 last:pb-0"
        >
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className={cn(
                "absolute left-[13px] top-8 h-[calc(100%-2rem)] w-0.5 rounded-full",
                s.done ? "bg-brand-500" : "bg-line"
              )}
            />
          )}
          <span
            className={cn(
              "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              s.done
                ? "border-brand-600 bg-brand-600 text-white"
                : s.current
                ? "border-brand-600 bg-surface text-brand-600"
                : "border-line bg-surface text-muted"
            )}
          >
            {s.done ? (
              <Check size={14} strokeWidth={3} />
            ) : (
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  s.current ? "animate-pulse bg-brand-600" : "bg-muted/40"
                )}
              />
            )}
          </span>
          <div className="pt-0.5">
            <p
              className={cn(
                "text-sm font-semibold",
                s.current
                  ? "text-brand-600 dark:text-brand-400"
                  : s.done
                  ? "text-ink"
                  : "text-muted"
              )}
            >
              {s.label}
            </p>
            <p className="text-xs text-muted">{s.description}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

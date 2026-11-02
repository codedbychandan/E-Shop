"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  className?: string;
  size?: number;
  showValue?: boolean;
}

export function Rating({ value, className, size = 14, showValue }: RatingProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex items-center" aria-label={`Rated ${value} out of 5`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className="relative inline-flex" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-ink/15" fill="currentColor" strokeWidth={0} />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
                aria-hidden
              >
                <Star size={size} className="text-amber-400" fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </span>
      {showValue && (
        <span className="text-xs font-medium text-muted">{value.toFixed(1)}</span>
      )}
    </span>
  );
}

interface RatingInputProps {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}

export function RatingInput({ value, onChange, size = 26 }: RatingInputProps) {
  return (
    <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Choose a rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={value === i}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          onClick={() => onChange(i)}
          className="rounded p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <Star
            size={size}
            className={i <= value ? "text-amber-400" : "text-ink/15"}
            fill="currentColor"
            strokeWidth={0}
          />
        </button>
      ))}
    </div>
  );
}

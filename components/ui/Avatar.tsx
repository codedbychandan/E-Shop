"use client";

import { cn } from "@/lib/utils";

const gradients = [
  "from-brand-500 to-indigo-500",
  "from-rose-500 to-orange-400",
  "from-emerald-500 to-teal-400",
  "from-blue-500 to-cyan-400",
  "from-fuchsia-500 to-pink-400",
  "from-amber-500 to-yellow-400",
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const gradient = gradients[hashString(name) % gradients.length];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white",
        gradient
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}

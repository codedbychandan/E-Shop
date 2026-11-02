"use client";

import type { Order } from "@/data/types";

export function SalesChart({ orders }: { orders: Order[] }) {
  const days: { label: string; total: number }[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    const total = orders
      .filter((o) => o.status !== "Cancelled" && new Date(o.date).toDateString() === key)
      .reduce((s, o) => s + o.total, 0);
    days.push({
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      total,
    });
  }

  const max = Math.max(...days.map((d) => d.total), 1);
  const W = 600;
  const H = 220;
  const padX = 8;
  const padTop = 16;
  const padBottom = 30;

  const points = days.map((d, i) => {
    const x = padX + (i * (W - padX * 2)) / (days.length - 1);
    const y = padTop + (1 - d.total / max) * (H - padTop - padBottom);
    return { x, y, ...d };
  });

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${points[points.length - 1].x} ${H - padBottom} L ${points[0].x} ${H - padBottom} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Sales for the last 7 days">
        <defs>
          <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(124 77 255)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="rgb(124 77 255)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="salesStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7c4dff" />
            <stop offset="100%" stopColor="#5c1bd6" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1={padX}
            x2={W - padX}
            y1={padTop + (1 - g) * (H - padTop - padBottom)}
            y2={padTop + (1 - g) * (H - padTop - padBottom)}
            stroke="rgb(var(--line))"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        ))}

        <path d={area} fill="url(#salesFill)" />
        <path d={line} fill="none" stroke="url(#salesStroke)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p) => (
          <g key={p.label + p.x}>
            <circle cx={p.x} cy={p.y} r="10" fill="transparent">
              <title>{`${p.label}: ₹${p.total.toLocaleString("en-IN")}`}</title>
            </circle>
            <circle cx={p.x} cy={p.y} r="4" fill="#7c4dff" stroke="rgb(var(--surface))" strokeWidth="2" />
          </g>
        ))}

        {points.map((p) => (
          <text
            key={p.label + "-lbl"}
            x={p.x}
            y={H - 8}
            textAnchor="middle"
            fontSize="11"
            fill="rgb(var(--muted))"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

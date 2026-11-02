"use client";

import { useEffect, useState } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function calc(target: number): Countdown {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff <= 0,
  };
}

export function useCountdown(target: number): Countdown {
  const [value, setValue] = useState<Countdown>(() => calc(target));
  useEffect(() => {
    setValue(calc(target));
    const id = setInterval(() => setValue(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return value;
}

/** A stable flash-sale target persisted in localStorage so the timer survives reloads. */
export function useFlashTarget(): number {
  const [target] = useState<number>(() => {
    if (typeof window === "undefined") return Date.now() + 2 * 86_400_000;
    try {
      const saved = window.localStorage.getItem("eshop-flash-end");
      if (saved && Number(saved) > Date.now()) return Number(saved);
    } catch {
      /* ignore */
    }
    const end = Date.now() + (2 * 24 * 3600 + 14 * 3600 + 36 * 60 + 28) * 1000;
    try {
      window.localStorage.setItem("eshop-flash-end", String(end));
    } catch {
      /* ignore */
    }
    return end;
  });
  return target;
}

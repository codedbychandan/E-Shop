"use client";

import { useEffect, useState } from "react";

/** Brief simulated network delay so skeleton loaders are visible instead of a flash of content. */
export function useSimulatedLoad(ms = 450): boolean {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(id);
  }, [ms]);
  return loading;
}

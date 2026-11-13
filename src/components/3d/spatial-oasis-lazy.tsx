"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SpatialOasisWorld = dynamic(
  () => import("./spatial-oasis-world").then((m) => m.SpatialOasisWorld),
  { ssr: false }
);

/**
 * Defers loading Three.js until after initial paint so the critical
 * first-load bundle stays small and the opening eye hydrates immediately.
 */
export function SpatialOasisLazy() {
  const [mount3D, setMount3D] = useState(false);

  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === "function") {
      const id = win.requestIdleCallback(() => setMount3D(true), { timeout: 600 });
      return () => win.cancelIdleCallback?.(id);
    }

    const timer = window.setTimeout(() => setMount3D(true), 200);
    return () => window.clearTimeout(timer);
  }, []);

  return mount3D ? <SpatialOasisWorld /> : null;
}

"use client";

import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  variant?: "light" | "dark";
  showSubtitle?: boolean;
}

export function BrandLogo({
  className = "",
  variant = "light",
  showSubtitle = true,
}: BrandLogoProps) {
  const isDark = variant === "dark";

  return (
    <Link
      href="#home"
      className={`group inline-flex items-center gap-3 select-none transition-opacity hover:opacity-95 ${className}`}
    >
      {/* Official Clean Sweep Oasis Logo Crest */}
      <div className="relative flex h-10 shrink-0 items-center justify-center">
        <Image
          src="/client-logo-transparent.png"
          alt="Clean Sweep Oasis LTD Logo"
          width={130}
          height={62}
          className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
          priority
        />
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-display text-base sm:text-lg font-bold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Clean Sweep Oasis
          </span>
          <span className="rounded bg-teal-500/20 border border-teal-500/40 px-1.5 py-0.2 text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
            LTD
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[11px] font-medium tracking-wide ${
              isDark ? "text-teal-400" : "text-teal-700"
            }`}
          >
            Suffolk, Cambridgeshire & Cambridge
          </span>
        )}
      </div>
    </Link>
  );
}

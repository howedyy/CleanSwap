"use client";

import Link from "next/link";

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
      {/* Luxury 24k Gold & Turquoise Eye of Horus Vector Crest */}
      <div className="relative flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-slate-900 via-teal-950 to-slate-900 p-0.5 shadow-lg border border-amber-400/50 group-hover:border-amber-300 transition-colors">
        <svg
          viewBox="0 0 100 70"
          className="size-7 sm:size-8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Egyptian Upper Eyebrow Arch */}
          <path
            d="M 10 32 Q 50 10 90 32"
            stroke="url(#goldGradient)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Upper Eyelid */}
          <path
            d="M 14 36 Q 50 20 86 36"
            stroke="url(#goldGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Lower Eyelid */}
          <path
            d="M 14 36 Q 50 52 86 36"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Luminous Turquoise Iris */}
          <circle
            cx="50"
            cy="36"
            r="12"
            fill="url(#tealGradient)"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />
          {/* Deep Obsidian Pupil */}
          <circle cx="50" cy="36" r="5" fill="#042f2e" />
          {/* Specular Glint */}
          <circle cx="47" cy="33" r="2" fill="#ffffff" />
          {/* Teardrop vertical stroke */}
          <path
            d="M 38 48 L 38 64"
            stroke="url(#goldGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Falcon Spiral Tail curling right */}
          <path
            d="M 44 48 Q 62 58 68 50 Q 72 44 65 42"
            stroke="url(#goldGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="tealGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Modern Luxury Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-display text-base sm:text-lg font-bold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Clean Sweep Oasis
          </span>
          <span className="rounded bg-amber-400/20 border border-amber-400/40 px-1.5 py-0.2 text-[9px] font-bold text-amber-500 uppercase tracking-wider">
            LTD
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[11px] font-medium tracking-wide ${
              isDark ? "text-teal-400" : "text-teal-700"
            }`}
          >
            Property Support & Commercial Cleaning
          </span>
        )}
      </div>
    </Link>
  );
}

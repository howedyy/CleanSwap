"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuote } from "@/components/quote/quote-provider";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SITE, NAV_ITEMS } from "@/lib/site";

export function Header() {
  const { scrollY } = useScroll();
  // Header stays hidden during the opening sequence and glides in as user enters the website
  const headerOpacity = useTransform(scrollY, [200, 450], [0, 1]);
  const headerY = useTransform(scrollY, [200, 450], [-25, 0]);
  const bgOpacity = useTransform(scrollY, [450, 600], [0.85, 0.95]);
  const blur = useTransform(scrollY, [450, 600], [8, 16]);

  const { requestQuote } = useQuote();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/80 shadow-xs"
      style={{
        opacity: headerOpacity,
        y: headerY,
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(255, 255, 255, ${v})`),
        backdropFilter: useTransform(blur, (v) => `blur(${v}px)`),
        pointerEvents: useTransform(scrollY, (v) => (v > 250 ? "auto" : "none")),
      }}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-7">
        <BrandLogo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className="text-sm font-medium text-muted hover:text-brand transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="hidden xl:inline-flex">
            <a href={SITE.phoneHref}>
              <Phone className="size-3.5" />
              {SITE.phoneDisplay}
            </a>
          </Button>
          <Button onClick={() => requestQuote("General No-Obligation Quotation")} size="sm">
            Get a Free Quote
          </Button>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-ink"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute inset-x-0 top-16 border-b border-line bg-white px-5 py-4 shadow-lg md:hidden"
        >
          <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className="text-base font-medium text-ink hover:text-brand"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-line">
              <Button asChild variant="outline" className="w-full">
                <a href={SITE.phoneHref}>
                  <Phone className="size-4" />
                  Call {SITE.phoneDisplay}
                </a>
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  requestQuote("General No-Obligation Quotation");
                }}
              >
                Get a Free Quote
              </Button>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Compass, Sparkles, ChevronUp, ClipboardList, Phone, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuote } from "@/components/quote/quote-provider";

interface SectionStage {
  id: string;
  name: string;
  tag: string;
}

const SECTIONS: SectionStage[] = [
  { id: "home", name: "Oasis Sanctuary", tag: "Hero & Free Quotes" },
  { id: "about", name: "Trust & Standards", tag: "£5M Insured & COSHH" },
  { id: "services", name: "Tailored Services", tag: "Commercial & Specialist" },
  { id: "process", name: "4-Step Pathway", tag: "Site Visit → Handover" },
  { id: "clients", name: "Client Sanctuary", tag: "5.0 ★ Client Feedback" },
  { id: "contact", name: "Get in Touch", tag: "Free Quote & Support" },
];

export function OasisCompass() {
  const { requestQuote } = useQuote();
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollY / docHeight) * 100))) : 0;
      setScrollPercent(progress);

      // Only show after the user has scrolled past the eye opening canvas (~180vh)
      if (scrollY > window.innerHeight * 1.8) {
        setVisible(true);
      } else {
        setVisible(false);
        setIsExpanded(false);
      }

      // Detect active section
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveSection(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setIsExpanded(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsExpanded(false);
  };

  const activeStage = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-40 select-none"
        >
          {/* Expanded Navigation Drawer */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                className="mb-3 w-72 rounded-3xl border border-amber-500/30 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-2xl text-white"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                      Oasis 3D Guide
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-slate-400">
                    {scrollPercent}% Page
                  </span>
                </div>

                {/* Section List */}
                <div className="mt-2.5 space-y-1">
                  {SECTIONS.map((stage) => {
                    const isActive = stage.id === activeSection;
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => scrollTo(stage.id)}
                        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all cursor-pointer ${
                          isActive
                            ? "bg-teal-900/60 text-amber-300 font-bold border border-amber-400/30 shadow-xs"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="truncate">{stage.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal ml-2">
                          {stage.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      requestQuote("General No-Obligation Quotation");
                      setIsExpanded(false);
                    }}
                    className="flex-1 rounded-xl bg-linear-to-r from-teal-600 to-amber-600 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <ClipboardList className="size-3.5" />
                    <span>Free Quote</span>
                  </button>
                  <button
                    type="button"
                    onClick={scrollToTop}
                    title="Replay 3D Eye Awakening"
                    className="rounded-xl border border-slate-700 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-amber-300 transition-colors"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Floating Jewel Capsule */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex items-center gap-3 rounded-full border border-amber-400/40 bg-slate-950/85 px-4 py-2.5 shadow-2xl backdrop-blur-xl hover:border-amber-400 transition-all cursor-pointer ring-1 ring-white/10"
            >
              {/* Brand Logo Icon - Frameless */}
              <div className="relative flex h-7 w-10 shrink-0 items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/client-logo-transparent.png"
                  alt="Clean Sweep Oasis Logo"
                  className="size-full object-contain"
                />
              </div>

              {/* Active Stage Label */}
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300/90 leading-none">
                  {activeStage.name}
                </p>
                <p className="text-[11px] font-medium text-slate-300 leading-tight mt-0.5">
                  {activeStage.tag}
                </p>
              </div>

              {/* Progress ring/badge */}
              <div className="ml-1 rounded-full bg-teal-950/80 border border-teal-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-teal-300">
                {scrollPercent}%
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Sparkles, Calendar, ArrowUp, Compass, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "@/components/booking/booking-provider";

interface SectionStage {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  accent: string;
}

const SECTIONS: SectionStage[] = [
  { id: "home", name: "Oasis Sanctuary", subtitle: "Hero & Quick Price Estimator", tag: "Phase 1", accent: "from-teal-500 to-amber-500" },
  { id: "about", name: "Trust & Standards", subtitle: "£5M Public Liability & COSHH", tag: "Phase 2", accent: "from-amber-500 to-teal-400" },
  { id: "services", name: "Tailored Services", subtitle: "Commercial, Tenancy & Residential", tag: "Phase 3", accent: "from-teal-400 to-emerald-400" },
  { id: "process", name: "4-Step Pathway", subtitle: "Site Visit ➔ Certified Handover", tag: "Phase 4", accent: "from-amber-400 to-amber-600" },
  { id: "clients", name: "Client Feedback", subtitle: "5.0 ★ Multi-Year Partnerships", tag: "Phase 5", accent: "from-teal-500 to-cyan-400" },
  { id: "contact", name: "Free Quotations", subtitle: "Direct WhatsApp & Online Booking", tag: "Phase 6", accent: "from-amber-500 to-teal-500" },
];

export function LivingAmulet() {
  const { openBooking } = useBooking();
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  // 3D Tilt calculation
  const amuletRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollY / docHeight) * 100))) : 0;
      setScrollPercent(progress);

      // Emerge smoothly as user exits the opening canvas and enters the website
      if (scrollY > window.innerHeight * 1.3) {
        setVisible(true);
      } else {
        setVisible(false);
        setIsExpanded(false);
      }

      // Active section detection
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

  // Mouse move over Amulet for tactile 3D card tilt & glass glare
  const handleAmuletMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -18;
    const rotateY = ((x - centerX) / centerX) * 18;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  }, []);

  const handleAmuletMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

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
          initial={{ opacity: 0, y: 30, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.85 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-40 select-none flex flex-col items-end"
        >
          {/* Expanded Sacred Dial / Navigation Drawer */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="mb-4 w-80 max-w-[90vw] rounded-3xl border border-amber-500/40 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-2xl text-white"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="size-2 rounded-full bg-teal-400 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        The Eye of Oasis
                      </h4>
                      <p className="text-[10px] text-slate-400">Your Living 3D Guide</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Section Stages */}
                <div className="mt-3 space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {SECTIONS.map((stage) => {
                    const isActive = stage.id === activeSection;
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => scrollTo(stage.id)}
                        className={`w-full flex items-center justify-between rounded-xl p-2.5 text-left text-xs transition-all cursor-pointer ${
                          isActive
                            ? "bg-teal-900/60 text-amber-300 font-bold border border-amber-400/40 shadow-xs"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className="truncate">
                          <span className="block truncate">{stage.name}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {stage.subtitle}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-teal-400 border border-slate-800 shrink-0 ml-2">
                          {stage.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Direct Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      openBooking();
                      setIsExpanded(false);
                    }}
                    className="flex-1 rounded-xl bg-linear-to-r from-teal-600 via-teal-500 to-amber-600 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="size-3.5" />
                    <span>Instant Booking</span>
                  </button>
                  <button
                    type="button"
                    onClick={scrollToTop}
                    title="Replay 3D Eye Awakening"
                    className="rounded-xl border border-slate-700 bg-white/5 px-3 py-2.5 text-xs text-amber-300 hover:bg-white/10 transition-colors flex items-center gap-1"
                  >
                    <ArrowUp className="size-3.5" />
                    <span className="text-[11px] font-semibold">Awaken</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* THE 3D LIVING AMULET MEDALLION */}
          <div
            ref={amuletRef}
            onMouseMove={handleAmuletMouseMove}
            onMouseLeave={handleAmuletMouseLeave}
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              transform: `perspective(700px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              transition: tilt.rotateX === 0 ? "transform 0.4s ease-out" : "none",
            }}
            className="group relative flex items-center gap-3 rounded-full border border-amber-400/50 bg-slate-950/85 p-2 pr-4 shadow-2xl backdrop-blur-xl hover:border-amber-300 transition-all cursor-pointer ring-1 ring-white/10 hover:shadow-[0_10px_35px_-5px_rgba(245,158,11,0.45)]"
          >
            {/* The 3D Ornate Golden Horus Medallion */}
            <div className="relative size-14 sm:size-16 rounded-full p-1 bg-linear-to-tr from-amber-600 via-amber-400 to-teal-400 shadow-xl overflow-hidden shrink-0">
              {/* Rotating sacred glyph notches around the gold rim */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-200/50 animate-[spin_30s_linear_infinite] pointer-events-none" />

              {/* Inner Medallion Lens Housing the Photorealistic Eye */}
              <div className="relative size-full rounded-full overflow-hidden bg-slate-950 border border-amber-300/40 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/eye-sequence/frame-3.jpg"
                  alt="Living Eye of Horus"
                  className="size-full object-cover rounded-full scale-110 group-hover:scale-125 transition-transform duration-500"
                />

                {/* 3D Glass Cornea Glare Sheen reacting to mouse */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 60%)`,
                    mixBlendMode: "overlay",
                  }}
                />

                {/* Center Turquoise Iris Pulse */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2.5 rounded-full bg-teal-400/50 blur-[2px] animate-pulse pointer-events-none" />
              </div>
            </div>

            {/* Medallion Status Tag */}
            <div className="text-left hidden xs:block">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-teal-400 animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/90 leading-none">
                  {activeStage.name}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-300 leading-tight mt-1 max-w-[140px] truncate">
                {activeStage.subtitle}
              </p>
            </div>

            {/* Page Percentage Pill */}
            <div className="rounded-full bg-teal-950/80 border border-teal-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-teal-300 ml-1">
              {scrollPercent}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

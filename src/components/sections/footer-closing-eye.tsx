"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowUp, Calendar, Phone, ShieldCheck } from "lucide-react";
import { useBooking } from "@/components/booking/booking-provider";
import { SITE } from "@/lib/site";

const CLOSING_FRAMES = [
  "/eye-sequence/frame-3.jpg", // 0% scroll: Fully wide open & awakened
  "/eye-sequence/frame-2.jpg", // 50% scroll: Halfway closing
  "/eye-sequence/frame-1.jpg", // 100% scroll: Fully closed & sealed
];

export function FooterClosingEye() {
  const { openBooking } = useBooking();
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesReady, setImagesReady] = useState(false);
  const [closeProgress, setCloseProgress] = useState(0);

  // Preload closing frames
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    CLOSING_FRAMES.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      const onDone = () => {
        loadedCount++;
        loadedImages[idx] = img;
        imagesRef.current = loadedImages;
        if (loadedCount >= 2) {
          setImagesReady(true);
        }
      };
      if (img.complete && img.naturalWidth !== 0) {
        onDone();
      } else {
        img.onload = onDone;
        img.onerror = () => console.error("Failed to load closing frame:", src);
      }
    });
  }, []);

  // Canvas render & scroll loop
  useEffect(() => {
    if (!imagesReady) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let targetP = 0;
    let smoothP = 0;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Start closing as the section enters the bottom half of the screen
      // Fully closed when near the bottom
      const startTrigger = windowH * 0.85;
      const endTrigger = windowH * 0.15;

      const progress = Math.max(0, Math.min(1, (startTrigger - rect.top) / (startTrigger - endTrigger)));
      targetP = progress;
    };

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateSize);
    updateSize();
    handleScroll();

    const render = () => {
      smoothP += (targetP - smoothP) * 0.12;
      setCloseProgress(smoothP);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Dark Egyptian slate background matching footer
      ctx.fillStyle = "#020617"; // slate-950
      ctx.fillRect(0, 0, width, height);

      // Determine blend between closing frames
      // 0 -> 1 maps across 3 frames: frame 0 (open), frame 1 (halfway), frame 2 (closed)
      const mapped = smoothP * 2; // 0 to 2
      const fIdx = Math.min(1, Math.floor(mapped));
      const blend = mapped - fIdx;

      const imgA = imagesRef.current[fIdx] || imagesRef.current[0];
      const imgB = imagesRef.current[Math.min(2, fIdx + 1)] || imgA;

      const drawFrame = (img: HTMLImageElement, alpha: number) => {
        if (!img || !img.width) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

        const imgAspect = img.width / img.height;
        const canvasAspect = width / height;

        let renderW = width;
        let renderH = height;
        const scale = 1.05 - smoothP * 0.08; // slightly scales down into resting seal

        if (canvasAspect > imgAspect) {
          renderW = width * scale;
          renderH = (width / imgAspect) * scale;
        } else {
          renderH = height * scale;
          renderW = (height * imgAspect) * scale;
        }

        const offsetX = (width - renderW) / 2;
        const offsetY = (height - renderH) / 2;

        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
        ctx.restore();
      };

      if (imgA && imgA.complete) {
        drawFrame(imgA, 1.0);
        if (imgB && imgB.complete && imgB !== imgA && blend > 0) {
          drawFrame(imgB, blend);
        }
      }

      // Vignette border fade
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.35,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.65
      );
      grad.addColorStop(0, "rgba(2, 6, 23, 0)");
      grad.addColorStop(1, "rgba(2, 6, 23, 0.95)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(animId);
    };
  }, [imagesReady]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-slate-950 text-white pt-20 pb-16 px-5 border-t border-slate-800/80 overflow-hidden select-none"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl flex flex-col items-center text-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 border border-amber-500/40 px-4 py-1.5 text-xs font-semibold text-amber-200 shadow-xl backdrop-blur-md mb-6">
          <span className={`size-2 rounded-full ${closeProgress > 0.8 ? "bg-amber-400" : "bg-teal-400"} animate-pulse`} />
          <span>
            {closeProgress < 0.3
              ? "The Eye of Oasis • Watching Over"
              : closeProgress < 0.8
              ? "Sealing Sanctuary • Eyelids Closing"
              : "Sanctuary Sealed • Resting in Peace"}
          </span>
        </div>

        {/* The Interactive Closing Eye Canvas Port */}
        <div className="relative size-64 sm:size-80 rounded-full p-1.5 bg-linear-to-tr from-amber-600 via-amber-400 to-teal-400 shadow-[0_15px_50px_-10px_rgba(245,158,11,0.35)] overflow-hidden my-4 group">
          {/* Rotating dashed glyph border */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-200/50 animate-[spin_40s_linear_infinite] pointer-events-none" />

          {/* Inner canvas */}
          <div className="relative size-full rounded-full overflow-hidden bg-slate-950 border border-amber-300/40 shadow-inner">
            <canvas
              ref={canvasRef}
              className="size-full object-cover"
            />
          </div>
        </div>

        {/* Closing Narrative & Heading */}
        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-6">
          {closeProgress > 0.75 ? "Your Sanctuary is Sealed" : "The Journey Concludes"}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
          Clean Sweep Oasis LTD provides dependable, fully-insured property support with high standards and genuine care. From single visits to multi-year commercial partnerships.
        </p>

        {/* Trust verification pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-300">
          <span className="flex items-center gap-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 px-3.5 py-1.5">
            <ShieldCheck className="size-4 text-teal-400" />
            Public Liability Insured (£5M)
          </span>
          <span className="rounded-full bg-slate-900/80 border border-slate-700/80 px-3.5 py-1.5">
            Certified COSHH & Health-and-Safety
          </span>
          <span className="rounded-full bg-slate-900/80 border border-slate-700/80 px-3.5 py-1.5 text-amber-300 font-semibold">
            5.0 ★ Client Feedback
          </span>
        </div>

        {/* Action Buttons: Awaken Again or Instant Booking */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 px-6 py-3 text-sm font-bold text-slate-950 shadow-xl hover:brightness-110 transition-all cursor-pointer group"
          >
            <ArrowUp className="size-4 group-hover:-translate-y-0.5 transition-transform" />
            <span>Awaken Again (Scroll to Top)</span>
          </button>

          <button
            type="button"
            onClick={() => openBooking()}
            className="inline-flex items-center gap-2 rounded-2xl bg-teal-600/90 hover:bg-teal-500 border border-teal-400/50 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all cursor-pointer"
          >
            <Calendar className="size-4" />
            <span>Book a Clean</span>
          </button>

          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition-all"
          >
            <Phone className="size-4 text-teal-400" />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </section>
  );
}

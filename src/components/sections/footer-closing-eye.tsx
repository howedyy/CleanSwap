"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowUp, Calendar, Phone, ShieldCheck } from "lucide-react";
import { useBooking } from "@/components/booking/booking-provider";
import { SITE } from "@/lib/site";

const CLOSING_FRAME_PATHS = [
  "/eye-sequence/logo-frame-3.png", // 0% scroll: Fully open (original brand logo)
  "/eye-sequence/logo-frame-2.png", // 50% scroll: Halfway closing
  "/eye-sequence/logo-frame-1.png", // 100% scroll: Fully closed & sealed
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

    CLOSING_FRAME_PATHS.forEach((src, idx) => {
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
        img.onerror = () => console.error("Failed to load closing logo frame:", src);
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
    let clock = 0;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;

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
      clock += 0.02;
      smoothP += (targetP - smoothP) * 0.12;
      setCloseProgress(smoothP);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep Dark Slate Background
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, width, height);

      // Ambient sapphire glow behind seal
      const auraGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.min(width, height) * 0.45
      );
      auraGrad.addColorStop(0, "rgba(56, 182, 255, 0.28)");
      auraGrad.addColorStop(0.5, "rgba(10, 52, 99, 0.18)");
      auraGrad.addColorStop(1, "rgba(2, 6, 23, 0)");
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, width, height);

      // 3 frames: 0 (Open) -> 1 (Halfway) -> 2 (Closed)
      const mapped = smoothP * 2;
      const fIdx = Math.min(1, Math.floor(mapped));
      const blend = mapped - fIdx;

      const imgA = imagesRef.current[fIdx] || imagesRef.current[0];
      const imgB = imagesRef.current[Math.min(2, fIdx + 1)] || imgA;

      if (imgA && imgA.complete) {
        ctx.save();
        const centerX = width / 2;
        const centerY = height / 2;
        const levitation = Math.sin(clock * 1.5) * 6;

        ctx.translate(centerX, centerY + levitation);

        // Calculate size
        const baseW = Math.min(width * 0.65, 340);
        const baseH = baseW * (imgA.height / imgA.width);

        // Draw Frame A directly with zero outer box/frame
        ctx.drawImage(imgA, -baseW / 2, -baseH / 2, baseW, baseH);

        // Cross-dissolve into Frame B as eyelids close
        if (imgB && imgB.complete && imgB !== imgA && blend > 0) {
          ctx.globalAlpha = Math.max(0, Math.min(1, blend));
          ctx.drawImage(imgB, -baseW / 2, -baseH / 2, baseW, baseH);
          ctx.globalAlpha = 1.0;
        }

        ctx.restore();
      }

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
      className="relative w-full bg-slate-950 py-24 sm:py-32 overflow-hidden border-t border-slate-800"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-7 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left Column: Interactive 3D Sealing Canvas */}
          <div className="relative flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-4/3 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

              <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 border border-teal-500/40 px-3 py-1 text-[11px] font-semibold text-teal-300 backdrop-blur-md">
                  <Sparkles className="size-3 text-amber-400" />
                  {closeProgress < 0.35
                    ? "Clean Sweep Oasis • Active"
                    : closeProgress < 0.75
                    ? "Sanctuary Preserved • Sealing"
                    : "Clean Sweep Oasis • Sealed"}
                </span>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
                  {Math.round(closeProgress * 100)}%
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400 text-center max-w-sm">
              Our sacred standard of cleanliness protects your home, office, and commercial space across Suffolk, Cambridgeshire & Cambridge.
            </p>
          </div>

          {/* Right Column: High Conversion Sanctuary CTA */}
          <div className="flex flex-col items-start lg:pl-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 border border-teal-500/30 px-3.5 py-1 text-xs font-semibold text-teal-300 mb-4">
              <ShieldCheck className="size-3.5 text-teal-400" />
              Trusted Family-Run Partner
            </span>

            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Ready to experience spotless spaces with zero hassle?
            </h2>

            <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-lg">
              Whether you need regular contract office cleaning, bespoke commercial property support, end of tenancy turnovers, or certified confined space decontamination, our family team delivers flawless standards every time.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => openBooking({ frequency: "one-off" })}
                className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-teal-500 to-amber-500 hover:from-teal-400 hover:to-amber-400 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-xl transition-all cursor-pointer hover:shadow-teal-500/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calendar className="size-4" />
                <span>Book a Clean in 60s</span>
              </button>

              <a
                href={SITE.phoneHref}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-teal-400"
              >
                <Phone className="size-4 text-teal-400" />
                <span>Call {SITE.phoneDisplay}</span>
              </a>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-800/80 flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-400">Available across Suffolk, Cambridgeshire & Cambridge</span>
              </div>

              <button
                type="button"
                onClick={scrollToTop}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer group"
              >
                <span>Back to top</span>
                <ArrowUp className="size-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

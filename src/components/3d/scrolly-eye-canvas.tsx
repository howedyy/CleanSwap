"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, ChevronDown, ArrowDown } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

const FRAME_PATHS = [
  "/eye-sequence/frame-1.jpg", // 1. Closed luxury gold eye
  "/eye-sequence/frame-2.jpg", // 2. Opening halfway - turquoise gleam
  "/eye-sequence/frame-3.jpg", // 3. Fully open - crystalline turquoise & gold
  "/eye-sequence/frame-4.jpg", // 4. Portal zoom - rays & deep pupil
];

const STAGES = [
  { threshold: 0.0, title: "The Sleeping Relic", subtitle: "Scroll down to awaken the sacred Eye of Horus" },
  { threshold: 0.25, title: "Unsealing the Gaze", subtitle: "Golden eyelids reveal the turquoise iris" },
  { threshold: 0.55, title: "The Awakened Vision", subtitle: "Sacred geometry and pristine clarity" },
  { threshold: 0.85, title: "Entering Clean Sweep Oasis", subtitle: "Journeying into professional sanctuary" },
];

export function ScrollyEyeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([null, null, null, null]);
  const [imagesReady, setImagesReady] = useState(false);
  const [currentStage, setCurrentStage] = useState(STAGES[0]);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mouse tilt for interactive 3D parallax feel
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Preload frames with cache fallback
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    FRAME_PATHS.forEach((src, idx) => {
      const img = new Image();
      img.src = src;

      const handleLoaded = () => {
        loadedCount++;
        loadedImages[idx] = img;
        imagesRef.current[idx] = img;

        // Start rendering as soon as frame 1 is ready, or when all are loaded
        if (idx === 0 || loadedCount >= 2) {
          setImagesReady(true);
        }
      };

      if (img.complete && img.naturalWidth !== 0) {
        handleLoaded();
      } else {
        img.onload = handleLoaded;
        img.onerror = () => {
          console.error(`Failed to load frame: ${src}`);
        };
      }
    });
  }, []);

  // Track Mouse Move for subtle 3D parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    mousePos.current.targetX = (e.clientX / innerWidth - 0.5) * 40;
    mousePos.current.targetY = (e.clientY / innerHeight - 0.5) * 30;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Main Render & Scroll Loop
  useEffect(() => {
    if (!imagesReady) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let targetProgress = 0;
    let smoothProgress = 0;

    // Floating gold dust particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2.2 + 1,
      speedY: Math.random() * 0.0009 + 0.0003,
      speedX: (Math.random() - 0.5) * 0.0004,
      opacity: Math.random() * 0.7 + 0.2,
    }));

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }
    };

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      const currentScroll = -rect.top;

      const progress = totalScrollable > 0 ? Math.max(0, Math.min(1, currentScroll / totalScrollable)) : 0;
      targetProgress = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();
    handleScroll();

    const render = () => {
      // Smooth lerp
      smoothProgress += (targetProgress - smoothProgress) * 0.14;
      setScrollProgress(smoothProgress);

      // Mouse lerp
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;

      // Update Stage text
      let activeStage = STAGES[0];
      for (let i = STAGES.length - 1; i >= 0; i--) {
        if (smoothProgress >= STAGES[i].threshold) {
          activeStage = STAGES[i];
          break;
        }
      }
      setCurrentStage(activeStage);

      // Canvas Dimensions
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clear with deep luxurious Egyptian ink
      ctx.fillStyle = "#070b11";
      ctx.fillRect(0, 0, width, height);

      // Determine blend between keyframes
      // We have 4 frames: indices 0, 1, 2, 3
      const mappedVal = smoothProgress * 3; // 0 to 3
      const frameIndex = Math.min(2, Math.floor(mappedVal));
      const blend = mappedVal - frameIndex; // 0 to 1

      const imgA = imagesRef.current[frameIndex] || imagesRef.current[0];
      const imgB = imagesRef.current[Math.min(3, frameIndex + 1)] || imgA;

      if (imgA && imgA.complete) {
        // Base zoom scale: zoom in as scroll progresses, with aggressive zoom on final phase
        let scale = 1.0 + smoothProgress * 0.28;
        if (smoothProgress > 0.82) {
          const finalPhase = (smoothProgress - 0.82) / 0.18;
          scale += Math.pow(finalPhase, 2.5) * 2.2;
        }

        // Draw image cover with mouse parallax tilt
        const drawFrame = (img: HTMLImageElement, alpha: number) => {
          if (!img || !img.width) return;
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

          const imgAspect = img.width / img.height;
          const canvasAspect = width / height;

          let renderW = width;
          let renderH = height;

          if (canvasAspect > imgAspect) {
            renderW = width * scale;
            renderH = (width / imgAspect) * scale;
          } else {
            renderH = height * scale;
            renderW = (height * imgAspect) * scale;
          }

          // Center position + parallax offset
          const offsetX = (width - renderW) / 2 + mousePos.current.x * (scale * 0.5);
          const offsetY = (height - renderH) / 2 + mousePos.current.y * (scale * 0.5);

          ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
          ctx.restore();
        };

        // Draw base image
        drawFrame(imgA, 1.0);

        // Cross-dissolve into next image
        if (imgB && imgB.complete && imgB !== imgA && blend > 0) {
          drawFrame(imgB, blend);
        }
      }

      // Draw subtle ambient golden floating dust particles
      ctx.save();
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < 0) p.y = 1;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;

        const px = p.x * width + mousePos.current.x * 0.15;
        const py = p.y * height + mousePos.current.y * 0.15;

        ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity * (1 - smoothProgress * 0.5)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // Final Portal Fade-Out to Website Hero
      if (smoothProgress > 0.85) {
        const portalOpacity = (smoothProgress - 0.85) / 0.15;
        const grad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          10,
          width / 2,
          height / 2,
          width * 0.85
        );
        grad.addColorStop(0, `rgba(45, 212, 191, ${portalOpacity * 0.9})`);
        grad.addColorStop(0.5, `rgba(245, 158, 11, ${portalOpacity * 0.65})`);
        grad.addColorStop(1, `rgba(240, 253, 250, ${portalOpacity})`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [imagesReady]);

  const handleScrollDown = () => {
    const heroElem = document.getElementById("home");
    if (heroElem) {
      heroElem.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight * 2.8, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[280vh] bg-[#070b11] select-none"
    >
      {/* Sticky Canvas Viewport (100vh pinned) */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between items-center z-10">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Top Header Crest */}
        <div className="relative z-20 w-full pt-6 px-6 flex justify-between items-center max-w-7xl mx-auto">
          <BrandLogo variant="dark" />

          <button
            type="button"
            onClick={handleScrollDown}
            className="flex items-center gap-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 border border-amber-500/40 px-4 py-2 text-xs font-semibold text-amber-200 backdrop-blur-md transition-all cursor-pointer shadow-xl group"
          >
            <span>Skip to Website</span>
            <ChevronDown className="size-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Bottom Floating Interactive Card / Scroll HUD */}
        <div className="relative z-20 pb-10 px-5 flex flex-col items-center max-w-xl text-center w-full">
          <div className="rounded-3xl border border-amber-500/40 bg-slate-950/75 p-5 sm:p-6 shadow-2xl backdrop-blur-xl w-full">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="size-4 text-amber-400 animate-spin" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-teal-400">
                Phase {Math.min(4, Math.floor(scrollProgress * 3.5) + 1)} of 4 • {Math.round(scrollProgress * 100)}%
              </span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white transition-all">
              {currentStage.title}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              {currentStage.subtitle}
            </p>

            {/* Progress Bar */}
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-linear-to-r from-amber-400 via-teal-400 to-emerald-300 transition-all duration-150"
                style={{ width: `${Math.max(8, scrollProgress * 100)}%` }}
              />
            </div>
          </div>

          {/* Bouncing Scroll Down Prompt */}
          <button
            type="button"
            onClick={handleScrollDown}
            className="mt-5 flex flex-col items-center gap-1.5 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer group"
          >
            <span className="text-[10px] font-semibold tracking-widest uppercase">
              {scrollProgress > 0.8 ? "Entering Sanctuary" : "Scroll down to awaken"}
            </span>
            <div className="flex size-7 items-center justify-center rounded-full bg-white/10 border border-white/15 group-hover:bg-amber-500/20 group-hover:border-amber-400/50 transition-all">
              <ArrowDown className="size-3.5 text-amber-300 animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

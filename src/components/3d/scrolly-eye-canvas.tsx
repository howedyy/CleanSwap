"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

const FRAME_PATHS = [
  "/eye-sequence/logo-frame-1.png", // 1. Closed Eye (resting peacefully)
  "/eye-sequence/logo-frame-2.png", // 2. Half-Open Eye (peering gaze)
  "/eye-sequence/logo-frame-3.png", // 3. Fully Open Eye (100% Original Brand Logo)
  "/eye-sequence/logo-frame-4.png", // 4. Awakened Eye (starburst glint & iris bloom)
];

const STAGES = [
  {
    threshold: 0.0,
    title: "Clean Sweep Oasis",
    subtitle: "Scroll down to awaken the 3D brand eye",
  },
  {
    threshold: 0.25,
    title: "Unsealing the Gaze",
    subtitle: "High standards, tailored care & trusted property support",
  },
  {
    threshold: 0.55,
    title: "The Awakened Vision",
    subtitle: "Serving Suffolk, Cambridgeshire & Cambridge with pride",
  },
  {
    threshold: 0.85,
    title: "Entering Sanctuary",
    subtitle: "Step into our professional cleaning & property services",
  },
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

  // Preload logo frames (frame 1 prioritized for instant first paint)
  useEffect(() => {
    FRAME_PATHS.forEach((src, idx) => {
      const img = new Image();
      if (idx === 0) {
        (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "high";
      }
      img.src = src;

      const handleLoaded = () => {
        imagesRef.current[idx] = img;
        if (idx === 0 || !imagesRef.current[0]) {
          setImagesReady(true);
        }
      };

      if (img.complete && img.naturalWidth !== 0) {
        handleLoaded();
      } else {
        img.onload = handleLoaded;
        img.onerror = () => {
          console.error(`Failed to load logo frame: ${src}`);
        };
      }
    });
  }, []);

  // Track Mouse Move for interactive 3D perspective
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    mousePos.current.targetX = (e.clientX / innerWidth - 0.5) * 45;
    mousePos.current.targetY = (e.clientY / innerHeight - 0.5) * 35;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Main 3D Canvas Loop (starts immediately without waiting for all frames)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let targetProgress = 0;
    let smoothProgress = 0;
    let clock = 0;

    // Floating Stardust Particles
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2.4 + 0.8,
      speedY: Math.random() * 0.0008 + 0.0003,
      speedX: (Math.random() - 0.5) * 0.0003,
      opacity: Math.random() * 0.7 + 0.2,
      hue: Math.random() > 0.35 ? "cyan" : "amber",
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
      clock += 0.02;

      // Smooth scroll lerp
      smoothProgress += (targetProgress - smoothProgress) * 0.12;
      setScrollProgress(smoothProgress);

      // Smooth mouse lerp
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

      // 1. Cinematic Luxury Sapphire & Ink Gradient Background
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        60,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      bgGrad.addColorStop(0, "#0b192e");
      bgGrad.addColorStop(0.5, "#060f1c");
      bgGrad.addColorStop(1, "#03070d");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Ambient Sapphire Pulsing Nebula Core
      const auraPulse = 0.85 + Math.sin(clock * 1.8) * 0.15 + smoothProgress * 0.35;
      const auraGrad = ctx.createRadialGradient(
        width / 2 + mousePos.current.x * 0.2,
        height / 2 + mousePos.current.y * 0.2,
        20,
        width / 2,
        height / 2,
        280 * auraPulse
      );
      auraGrad.addColorStop(0, "rgba(56, 182, 255, 0.35)");
      auraGrad.addColorStop(0.4, "rgba(10, 52, 99, 0.2)");
      auraGrad.addColorStop(1, "rgba(3, 7, 13, 0)");
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Stardust Particles with 3D Depth
      ctx.save();
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < 0) p.y = 1;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;

        const px = p.x * width + mousePos.current.x * 0.25;
        const py = p.y * height + mousePos.current.y * 0.25;

        ctx.fillStyle =
          p.hue === "cyan"
            ? `rgba(56, 182, 255, ${p.opacity * (1 - smoothProgress * 0.4)})`
            : `rgba(245, 158, 11, ${p.opacity * (1 - smoothProgress * 0.4)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 5. DETERMINE THE OPEN/CLOSE FRAME BLEND
      // 4 frames:
      // index 0: Closed
      // index 1: Half-Open
      // index 2: Fully Open (original)
      // index 3: Awakened
      const mappedVal = smoothProgress * 3; // 0 to 3
      const frameIndex = Math.min(2, Math.floor(mappedVal));
      const blend = mappedVal - frameIndex; // 0 to 1

      const imgA = imagesRef.current[frameIndex] || imagesRef.current[0];
      const imgB = imagesRef.current[Math.min(3, frameIndex + 1)] || imgA;

      if (imgA && imgA.complete) {
        ctx.save();

        // 3D Perspective Transformations based on scroll and cursor
        const levitationY = Math.sin(clock * 1.6) * 10;
        const tiltX = (mousePos.current.y / 35) * 0.18 - (smoothProgress - 0.5) * 0.22;
        const tiltY = (mousePos.current.x / 45) * 0.22;

        // Dynamic 3D Scale: smooth growth and final portal zoom
        let scale = 1.0 + smoothProgress * 0.35;
        if (smoothProgress > 0.82) {
          const finalPhase = (smoothProgress - 0.82) / 0.18;
          scale += Math.pow(finalPhase, 2.5) * 3.2;
        }

        const baseWidth = Math.min(width * 0.72, 460);
        const baseHeight = baseWidth * (imgA.height / imgA.width);

        const renderW = baseWidth * scale;
        const renderH = baseHeight * scale;

        const centerX = width / 2 + mousePos.current.x * (scale * 0.45);
        const centerY = height / 2 + levitationY + mousePos.current.y * (scale * 0.4);

        ctx.translate(centerX, centerY);

        // Apply 3D Shear & Tilt Transformation Matrix
        ctx.transform(
          Math.cos(tiltY),
          Math.sin(tiltX) * 0.3,
          -Math.sin(tiltY) * 0.3,
          Math.cos(tiltX),
          0,
          0
        );

        // 5B. Draw Frame A directly with zero outer box/frame/glow
        ctx.save();
        ctx.drawImage(imgA, -renderW / 2, -renderH / 2, renderW, renderH);

        // 5C. Cross-dissolve into Frame B on scroll
        if (imgB && imgB.complete && imgB !== imgA && blend > 0) {
          ctx.globalAlpha = Math.max(0, Math.min(1, blend));
          ctx.drawImage(imgB, -renderW / 2, -renderH / 2, renderW, renderH);
        }

        // 5D. Specular Light Sweep directly across Logo pixels (no rectangular box)
        const sweepProgress = (clock * 0.4 + smoothProgress * 1.5) % 3;
        if (sweepProgress < 1.4) {
          const sweepX = -renderW + sweepProgress * (renderW * 1.6);
          const sweepGrad = ctx.createLinearGradient(
            sweepX - 50 * scale,
            -renderH / 2,
            sweepX + 50 * scale,
            renderH / 2
          );
          sweepGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
          sweepGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.35)");
          sweepGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.globalCompositeOperation = "source-atop";
          ctx.fillStyle = sweepGrad;
          ctx.fillRect(-renderW / 2, -renderH / 2, renderW, renderH);
        }
        ctx.restore();

        ctx.restore();
      }

      // 6. Final Portal Transition to Website (Pristine White & Teal Bloom)
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
        grad.addColorStop(0, `rgba(56, 182, 255, ${portalOpacity * 0.95})`);
        grad.addColorStop(0.45, `rgba(13, 148, 136, ${portalOpacity * 0.75})`);
        grad.addColorStop(1, `rgba(248, 250, 252, ${portalOpacity})`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateCanvasSize);
      cancelAnimationFrame(animId);
    };
  }, []);

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
      className="relative w-full h-[280vh] bg-[#03070d] select-none"
    >
      {/* Sticky Canvas Viewport (100vh pinned) */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between items-center z-10">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Instant SSR/First-Paint Placeholder Eye before Canvas hydrates */}
        {!imagesReady && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="absolute size-[420px] rounded-full bg-radial from-sky-400/25 via-sky-900/10 to-transparent blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/eye-sequence/logo-frame-1.png"
              alt="Clean Sweep Oasis Brand Eye"
              width={460}
              height={218}
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              className="relative w-[72vw] max-w-[460px] h-auto object-contain"
            />
          </div>
        )}

        {/* Top Header Crest */}
        <div className="relative z-20 w-full pt-6 px-6 flex justify-between items-center max-w-7xl mx-auto">
          <BrandLogo variant="dark" />

          <button
            type="button"
            onClick={handleScrollDown}
            className="flex items-center gap-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 border border-teal-500/40 px-4 py-2 text-xs font-semibold text-teal-200 backdrop-blur-md transition-all cursor-pointer shadow-xl group"
          >
            <span>Skip to Website</span>
            <ChevronDown className="size-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Bottom Floating Interactive Card / Scroll HUD */}
        <div className="relative z-20 pb-10 px-5 flex flex-col items-center max-w-xl text-center w-full">
          <div className="rounded-3xl border border-teal-500/40 bg-slate-950/80 p-5 sm:p-6 shadow-2xl backdrop-blur-xl w-full">
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
                className="h-full rounded-full bg-linear-to-r from-teal-400 via-sky-400 to-amber-400 transition-all duration-150"
                style={{ width: `${Math.max(8, scrollProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

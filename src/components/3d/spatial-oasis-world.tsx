"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { isWebGLAvailable, isMobileDevice } from "./webgl-check";

export function SpatialOasisWorld() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isWebGLAvailable()) return;
    const container = containerRef.current;
    if (!container) return;

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf0fdfa, 0.018);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    const isMobile = isMobileDevice();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const goldDirectional = new THREE.DirectionalLight(0xf59e0b, 2.5);
    goldDirectional.position.set(-6, 8, 4);
    scene.add(goldDirectional);

    const tealDirectional = new THREE.DirectionalLight(0x0d9488, 2.8);
    tealDirectional.position.set(6, -4, 5);
    scene.add(tealDirectional);

    // --- 1. 3D GOLD & TURQUOISE DUST PARTICLE VORTEX ---
    const particleCount = isMobile ? 120 : 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    const goldColor = new THREE.Color(0xf59e0b);
    const tealColor = new THREE.Color(0x14b8a6);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 26;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const mix = Math.random();
      const c = mix > 0.4 ? goldColor : tealColor;
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;

      particleSpeeds[i] = 0.4 + Math.random() * 0.8;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.1 : 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- 2. THE HORIZON 3D EYE OF HORUS DISK & GLYPH HALOS ---
    const eyeHorizonGroup = new THREE.Group();
    eyeHorizonGroup.position.set(0, 0, -4);
    scene.add(eyeHorizonGroup);

    // Load the photorealistic Eye of Horus texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/client-logo-transparent.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const eyeGeo = new THREE.PlaneGeometry(2.4, 2.4 * (142 / 299));
      const eyeMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      });
      const eyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
      eyeHorizonGroup.add(eyeMesh);
    });

    // Dynamic Central Point Light
    const eyeGlow = new THREE.PointLight(0x38b6ff, 1.8, 8);
    eyeGlow.position.set(0, 0, 0.5);
    eyeHorizonGroup.add(eyeGlow);

    // --- Mouse Parallax & Scroll Physics ---
    let targetScroll = 0;
    let smoothScroll = 0;
    let scrollVelocity = 0;
    let lastScrollY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = docHeight > 0 ? scrollY / docHeight : 0;

      scrollVelocity = Math.abs(scrollY - lastScrollY);
      lastScrollY = scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();

    // --- Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll lerp
      smoothScroll += (targetScroll - smoothScroll) * 0.08;
      scrollVelocity *= 0.92;

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // 3D Camera Parallax
      camera.position.x = mouseX * 0.9;
      camera.position.y = -mouseY * 0.7;

      // --- HORIZON EYE 3D TRAJECTORY AS USER SCROLLS DOWN ---
      // Top (0.0): Centered high
      // About (0.15 - 0.35): Shifts left behind credentials
      // Services (0.35 - 0.60): Shifts right behind pricing cards
      // Process (0.60 - 0.85): Centers high as overhead beacon
      // Contact (0.85 - 1.0): Returns to grand center horizon
      const p = smoothScroll;
      let targetX = 0;
      let targetY = 0;
      let targetZ = -4.5;
      let targetRotY = 0;
      let targetRotX = 0;

      if (p < 0.2) {
        // Top entrance
        targetX = 0;
        targetY = 0.5;
        targetZ = -4.2;
      } else if (p < 0.42) {
        // About Section: Float Upper-Left
        const localT = (p - 0.2) / 0.22;
        targetX = -3.2 + localT * 0.4;
        targetY = 1.2 - localT * 0.3;
        targetZ = -4.8;
        targetRotY = 0.25;
        targetRotX = -0.1;
      } else if (p < 0.68) {
        // Services Section: Float Right
        const localT = (p - 0.42) / 0.26;
        targetX = 3.2 - localT * 0.3;
        targetY = 0.6 + localT * 0.4;
        targetZ = -4.2;
        targetRotY = -0.28;
        targetRotX = 0.12;
      } else if (p < 0.88) {
        // Process Section: Overhead Beacon Center
        targetX = 0;
        targetY = 2.0;
        targetZ = -5.0;
        targetRotY = Math.sin(elapsedTime * 0.5) * 0.08;
      } else {
        // Contact & Footer: Gracefully descend and dissolve into the stars
        targetX = 0;
        targetY = -2.5;
        targetZ = -7.0;
      }

      // Smooth eye scale & fade near footer so it never obstructs footer text
      const horizonScale = p > 0.82 ? Math.max(0.01, 1 - (p - 0.82) / 0.12) : 1;
      eyeHorizonGroup.scale.setScalar(horizonScale);

      // Smooth eye movement
      eyeHorizonGroup.position.x += (targetX - eyeHorizonGroup.position.x) * 0.08;
      eyeHorizonGroup.position.y += (targetY - eyeHorizonGroup.position.y) * 0.08;
      eyeHorizonGroup.position.z += (targetZ - eyeHorizonGroup.position.z) * 0.08;
      eyeHorizonGroup.rotation.y += (targetRotY - eyeHorizonGroup.rotation.y) * 0.08;
      eyeHorizonGroup.rotation.x += (targetRotX - eyeHorizonGroup.rotation.x) * 0.08;

      // --- DUST PARTICLES SPEED DYNAMICS ON SCROLL ---
      const pos = particleGeo.attributes.position.array as Float32Array;
      const speedBoost = 1 + scrollVelocity * 0.08;

      for (let i = 0; i < particleCount; i++) {
        // Float particles up and toward camera
        pos[i * 3 + 2] += (particleSpeeds[i] * 0.04) * speedBoost;
        pos[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.005;

        // Reset if behind camera
        if (pos[i * 3 + 2] > 7) {
          pos[i * 3 + 2] = -14;
          pos[i * 3] = (Math.random() - 0.5) * 26;
          pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none opacity-90 overflow-hidden"
    />
  );
}

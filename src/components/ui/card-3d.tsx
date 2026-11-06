"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // max tilt angle in degrees, default 12
  glare?: boolean;
}

export function Card3D({
  children,
  className = "",
  depth = 12,
  glare = true,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -depth;
      const rotateY = ((x - centerX) / centerX) * depth;
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setTilt({ rotateX, rotateY, glareX, glareY, isHovered: true });
    },
    [depth]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false });
  }, []);

  return (
    <div
      style={{ perspective: 1100 }}
      className="relative w-full h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 30, rotateX: 8 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${
            tilt.isHovered ? "scale3d(1.02, 1.02, 1.02)" : "scale3d(1, 1, 1)"
          }`,
          transition: tilt.isHovered ? "transform 0.08s ease-out" : "transform 0.5s ease-out",
        }}
        className={`relative h-full overflow-hidden transition-shadow duration-300 ${className} ${
          tilt.isHovered ? "shadow-[0_20px_40px_-15px_rgba(13,148,136,0.22)]" : "shadow-xs"
        }`}
      >
        {/* Child Content rendered in 3D preserve context */}
        <div style={{ transformStyle: "preserve-3d" }} className="h-full w-full flex flex-col">
          {children}
        </div>

        {/* Dynamic Specular Glass Glare overlay */}
        {glare && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[inherit]"
            style={{
              opacity: tilt.isHovered ? 1 : 0,
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)`,
              mixBlendMode: "overlay",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

// 3D Pop Element: items with this wrapper float forward on the Z-axis
export function Pop3D({
  children,
  z = 35,
  className = "",
}: {
  children: React.ReactNode;
  z?: number;
  className?: string;
}) {
  return (
    <div
      style={{
        transform: `translateZ(${z}px)`,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

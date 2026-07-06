"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function Grain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 256;
    canvas.height = 256;

    const imageData = ctx.createImageData(256, 256);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 40;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 30;
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.35]"
      style={{ mixBlendMode: "soft-light" }}
    />
  );
}

export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-white to-orange-50/30" />

      {/* Large ambient blob 1 */}
      <motion.div
        className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(255,107,26,0.15) 0%, transparent 70%)" }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Large ambient blob 2 */}
      <motion.div
        className="absolute -bottom-64 -right-48 h-[700px] w-[700px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, rgba(19,35,63,0.12) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], x: [0, -30, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Mid-right warm glow */}
      <motion.div
        className="absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(255,107,26,0.12) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], y: [0, -15, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom-left subtle navy */}
      <motion.div
        className="absolute -bottom-32 left-1/4 h-[400px] w-[400px] rounded-full opacity-8"
        style={{ background: "radial-gradient(circle, rgba(19,35,63,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <Grain />
    </div>
  );
}

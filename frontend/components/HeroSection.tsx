"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function SchoolIllustration() {
  return (
    <motion.svg
      viewBox="0 0 400 300"
      className="h-full w-full"
      fill="none"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* School building */}
      <motion.rect
        x="120" y="100" width="160" height="120" rx="10"
        fill="#13233F" opacity="0.92"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 0.92 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />

      {/* Windows */}
      {[
        { x: 135, y: 112 },
        { x: 185, y: 112 },
        { x: 235, y: 112 },
        { x: 135, y: 148 },
        { x: 185, y: 148 },
        { x: 235, y: 148 },
      ].map((w, i) => (
        <motion.rect
          key={i}
          x={w.x} y={w.y} width="30" height="28" rx="4"
          fill="#FF6B1A" opacity="0.15"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
        />
      ))}

      {/* Door */}
      <motion.rect
        x="180" y="175" width="40" height="45" rx="6"
        fill="#FF6B1A" opacity="0.35"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        style={{ transformOrigin: "bottom" }}
      />

      {/* Roof */}
      <motion.path
        d="M110 105 L200 60 L290 105"
        fill="#13233F"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />

      {/* Flag */}
      <motion.line
        x1="200" y1="60" x2="200" y2="45"
        stroke="#FF6B1A" strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      />
      <motion.path
        d="M200 45 L215 50 L200 55"
        fill="#FF6B1A"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      />

      {/* Students walking */}
      {[
        { cx: 100, cy: 190, color: "#13233F", delay: 0.4 },
        { cx: 85, cy: 200, color: "#FF6B1A", delay: 0.6 },
        { cx: 115, cy: 195, color: "#13233F", delay: 0.8 },
        { cx: 300, cy: 185, color: "#FF6B1A", delay: 0.5 },
        { cx: 315, cy: 195, color: "#13233F", delay: 0.7 },
      ].map((s, i) => (
        <motion.g
          key={i}
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: [0, -10, 0], opacity: 1 }}
          transition={{ duration: 0.6, delay: s.delay, repeat: Infinity, repeatDelay: 3 }}
        >
          <circle cx={s.cx} cy={s.cy} r="5" fill={s.color} opacity="0.8" />
          <rect x={s.cx - 4} y={s.cy + 5} width="8" height="12" rx="2" fill={s.color} opacity="0.6" />
        </motion.g>
      ))}

      {/* Laptop */}
      <motion.g
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        <rect x="290" y="138" width="50" height="32" rx="4" fill="#13233F" />
        <rect x="294" y="142" width="42" height="24" rx="2" fill="#FF6B1A" opacity="0.15" />
        <path d="M290 170 L296 188 L334 188 L340 170" fill="#13233F" opacity="0.7" />
        {/* Screen glow */}
        <motion.rect
          x="296" y="144" width="38" height="20" rx="1"
          fill="none" stroke="#FF6B1A" strokeWidth="0.5"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.g>

      {/* Charts / dashboard elements */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <rect x="290" y="148" width="14" height="4" rx="1" fill="#FF6B1A" opacity="0.4" />
        <rect x="306" y="150" width="10" height="2" rx="1" fill="#13233F" opacity="0.3" />
        <rect x="318" y="149" width="10" height="3" rx="1" fill="#10B981" opacity="0.3" />
      </motion.g>

      {/* Decorative dots */}
      {[
        { cx: 60, cy: 130, r: 2, delay: 0 },
        { cx: 340, cy: 120, r: 1.5, delay: 0.2 },
        { cx: 50, cy: 170, r: 2, delay: 0.4 },
        { cx: 350, cy: 160, r: 1.5, delay: 0.6 },
        { cx: 200, cy: 45, r: 2, delay: 0.8 },
      ].map((d, i) => (
        <motion.circle
          key={i}
          cx={d.cx} cy={d.cy} r={d.r}
          fill="#FF6B1A"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, delay: d.delay, repeat: Infinity }}
        />
      ))}
    </motion.svg>
  );
}

export default function HeroSection() {
  const { utilisateur, ecole } = useAuth();

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Card background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/20 to-white" />
      <div className="absolute inset-0 bg-gradient-premium opacity-[0.02]" />

      <div className="relative grid gap-6 p-6 md:p-8 lg:grid-cols-5">
        {/* Text */}
        <motion.div
          className="flex flex-col justify-center lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div
            className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#FF6B1A]/8 px-3 py-1 text-xs font-medium text-[#FF6B1A]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Sparkles className="h-3 w-3" />
            Tableau de bord
          </motion.div>

          <h1 className="text-2xl font-bold text-[#13233F] md:text-3xl">
            Bonjour, {utilisateur?.nom?.split(" ")[0] ?? "Administrateur"} <span className="inline-block animate-float">👋</span>
          </h1>
          <p className="mt-2 text-base text-gray-400 md:text-lg">
            Bienvenue sur <span className="font-semibold text-[#13233F]">Alt-Q Plus</span>
          </p>
          <p className="mt-0.5 text-sm text-gray-400">
            {ecole?.nom} &mdash; Votre établissement fonctionne parfaitement aujourd&apos;hui.
          </p>

          <motion.button
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-[#13233F] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#13233F]/20 transition-all hover:bg-[#13233F]/90 hover:shadow-xl hover:shadow-[#13233F]/30 active:scale-[0.98]"
            whileHover={{ gap: "12px" }}
            whileTap={{ scale: 0.97 }}
          >
            Voir les rapports
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>

        {/* Illustration */}
        <motion.div
          className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="h-56 w-full">
            <SchoolIllustration />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

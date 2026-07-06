"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Sparkline from "./Sparkline";

type StatsCardProps = {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  sparklineData?: number[];
  variant?: "default" | "accent" | "secondary" | "success" | "info";
  delay?: number;
};

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const variantStyles = {
  default: {
    card: "bg-white border-gray-100",
    icon: "text-[#FF6B1A] bg-[#FF6B1A]/8",
    value: "text-[#13233F]",
    label: "text-gray-400",
    trendUp: "text-green-600 bg-green-50",
    trendDown: "text-red-500 bg-red-50",
    sparkline: "#FF6B1A",
  },
  accent: {
    card: "bg-gradient-to-br from-[#FF6B1A] to-[#FF6B1A]/90 border-[#FF6B1A]/20 text-white",
    icon: "text-white bg-white/15",
    value: "text-white",
    label: "text-white/60",
    trendUp: "text-white bg-white/15",
    trendDown: "text-white/70 bg-white/10",
    sparkline: "rgba(255,255,255,0.7)",
  },
  secondary: {
    card: "bg-[#13233F] border-[#13233F]/10 text-white",
    icon: "text-white bg-white/10",
    value: "text-white",
    label: "text-white/50",
    trendUp: "text-white bg-white/15",
    trendDown: "text-white/70 bg-white/10",
    sparkline: "rgba(255,255,255,0.6)",
  },
  success: {
    card: "bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400/20 text-white",
    icon: "text-white bg-white/15",
    value: "text-white",
    label: "text-white/60",
    trendUp: "text-white bg-white/15",
    trendDown: "text-white/70 bg-white/10",
    sparkline: "rgba(255,255,255,0.7)",
  },
  info: {
    card: "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400/20 text-white",
    icon: "text-white bg-white/15",
    value: "text-white",
    label: "text-white/60",
    trendUp: "text-white bg-white/15",
    trendDown: "text-white/70 bg-white/10",
    sparkline: "rgba(255,255,255,0.7)",
  },
};

export default function StatsCard({
  title, value, prefix = "", suffix = "", icon: Icon, trend,
  sparklineData, variant = "default", delay = 0,
}: StatsCardProps) {
  const s = variantStyles[variant];

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-xl",
        s.card,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      {/* Shine overlay on hover */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-full h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="relative flex items-start justify-between">
        <div className={cn("rounded-xl p-2.5", s.icon)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-2">
          {sparklineData && (
            <Sparkline data={sparklineData} color={s.sparkline} delay={delay} />
          )}
          {trend && (
            <span
              className={cn(
                "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                trend.positive ? s.trendUp : s.trendDown,
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      </div>

      <div className="relative mt-4">
        <p className={cn("text-2xl font-bold tracking-tight", s.value)}>
          <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
        </p>
        <p className={cn("mt-0.5 text-sm", s.label)}>{title}</p>
      </div>
    </motion.div>
  );
}

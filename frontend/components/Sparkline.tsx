"use client";

import { motion } from "framer-motion";

type SparklineProps = {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  delay?: number;
};

export default function Sparkline({
  data,
  color = "#FF6B1A",
  height = 32,
  width = 80,
  delay = 0,
}: SparklineProps) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const pathD = `M${points.join(" L")}`;

  return (
    <svg width={width} height={height} className="shrink-0 overflow-visible">
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 1.5, delay, ease: "easeInOut" }}
      />
      <motion.circle
        cx={points.length > 0 ? points[points.length - 1].split(",")[0] : 0}
        cy={points.length > 0 ? points[points.length - 1].split(",")[1] : 0}
        r="2.5"
        fill={color}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 0.4, delay: delay + 1.5 }}
      />
    </svg>
  );
}

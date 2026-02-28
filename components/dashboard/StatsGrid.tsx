"use client";

import { motion } from "framer-motion";
import { Flame, Target, Zap, Trophy } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface StatsGridProps {
  streak: number;
  completedToday: number;
  totalToday: number;
  totalXp: number;
  level: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

export function StatsGrid({
  streak,
  completedToday,
  totalToday,
  totalXp,
  level,
}: StatsGridProps) {
  const { t } = useTranslation();
  const stats = [
    {
      label: t.dashboard.streak,
      value: `${streak}d`,
      icon: Flame,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      label: t.dashboard.today,
      value: `${completedToday}/${totalToday}`,
      icon: Target,
      color: "#34d399",
      bg: "rgba(34, 197, 94, 0.1)",
    },
    {
      label: t.dashboard.totalXp,
      value: totalXp >= 1000 ? `${(totalXp / 1000).toFixed(1)}K` : `${totalXp}`,
      icon: Zap,
      color: "#a78bfa",
      bg: "rgba(139, 92, 246, 0.1)",
    },
    {
      label: t.dashboard.level,
      value: `${level}`,
      icon: Trophy,
      color: "#60a5fa",
      bg: "rgba(59, 130, 246, 0.1)",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-4 gap-2"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={item}
          className="glass-card p-3 flex flex-col items-center gap-1.5"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: stat.bg }}
          >
            <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
          </div>
          <span className="text-sm font-bold text-white">{stat.value}</span>
          <span className="text-[11px] text-slate-400">{stat.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { xpForLevel, xpForNextLevel } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface XpBarProps {
  level: number;
  currentXp: number;
  showLabel?: boolean;
}

export function XpBar({ level, currentXp, showLabel = true }: XpBarProps) {
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForNextLevel(level);
  const progress = ((currentXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <motion.div
              className="flex items-center justify-center w-6 h-6 rounded-lg gradient-primary text-white text-[10px] font-bold"
              whileHover={{ scale: 1.1 }}
            >
              {level}
            </motion.div>
            <span className="text-slate-400">Level {level}</span>
          </div>
          <div className="flex items-center gap-1 text-[#a78bfa]">
            <Sparkles className="h-3 w-3" />
            <span className="font-medium">
              {currentXp - currentLevelXp} / {nextLevelXp - currentLevelXp} XP
            </span>
          </div>
        </div>
      )}
      <Progress value={Math.min(progress, 100)} className="h-2" />
    </div>
  );
}

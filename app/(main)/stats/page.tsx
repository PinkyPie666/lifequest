"use client";

import { motion } from "framer-motion";
import { useUserStore } from "@/stores/useUserStore";
import { useHabitStore } from "@/stores/useHabitStore";
import { cn } from "@/lib/utils";

const ACHIEVEMENTS = [
  { icon: "🎯", name: "First Step", desc: "ทำ habit แรก", req: 1, type: "total" },
  { icon: "🔥", name: "On Fire", desc: "Streak 7 วัน", req: 7, type: "streak" },
  { icon: "💪", name: "Unstoppable", desc: "Streak 14 วัน", req: 14, type: "streak" },
  { icon: "🏆", name: "Champion", desc: "Streak 30 วัน", req: 30, type: "streak" },
  { icon: "⭐", name: "Half Century", desc: "ทำสำเร็จ 50 ครั้ง", req: 50, type: "total" },
  { icon: "💯", name: "Centurion", desc: "ทำสำเร็จ 100 ครั้ง", req: 100, type: "total" },
  { icon: "✨", name: "Perfect Week", desc: "Perfect 7 วัน", req: 7, type: "perfect" },
  { icon: "👑", name: "Habit Master", desc: "Streak 66 วัน", req: 66, type: "streak" },
  { icon: "🌟", name: "Superstar", desc: "Level 10", req: 10, type: "level" },
];

export default function StatsPage() {
  const { user } = useUserStore();
  const { habits } = useHabitStore();

  if (!user) return null;

  const activeHabits = habits.filter((h) => h.isActive);
  const xpForNext = user.level * user.level * 100;
  const xpPct = Math.min(100, Math.round((user.totalXp / xpForNext) * 100));
  const daysActive = Math.max(1, Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / 86400000));

  const isUnlocked = (ach: typeof ACHIEVEMENTS[0]) => {
    switch (ach.type) {
      case "total": return user.totalCompletions >= ach.req;
      case "streak": return user.longestStreak >= ach.req;
      case "perfect": return user.perfectDays >= ach.req;
      case "level": return user.level >= ach.req;
      default: return false;
    }
  };

  const getProgress = (ach: typeof ACHIEVEMENTS[0]) => {
    switch (ach.type) {
      case "total": return user.totalCompletions;
      case "streak": return user.longestStreak;
      case "perfect": return user.perfectDays;
      case "level": return user.level;
      default: return 0;
    }
  };

  const unlockedCount = ACHIEVEMENTS.filter(isUnlocked).length;

  return (
    <div className="px-4 pt-6 pb-28 safe-top space-y-4">
      <div className="fixed inset-0 scanline pointer-events-none z-10" />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-pixel text-[13px] text-[#fbbf24] retro-text-shadow">📊 ADVENTURER STATS</h1>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-2"
      >
        {[
          { emoji: "✅", value: user.totalCompletions, label: "COMPLETED" },
          { emoji: "🔥", value: user.longestStreak, label: "BEST STREAK" },
          { emoji: "⚡", value: user.totalXp.toLocaleString(), label: "TOTAL XP" },
          { emoji: "⭐", value: user.perfectDays, label: "PERFECT DAYS" },
          { emoji: "📅", value: daysActive, label: "DAYS ACTIVE" },
          { emoji: "📋", value: activeHabits.length, label: "ACTIVE QUESTS" },
        ].map((s) => (
          <div key={s.label} className="pixel-card p-3 text-center">
            <span className="text-xl">{s.emoji}</span>
            <p className="font-pixel text-sm text-white mt-1">{s.value}</p>
            <p className="font-pixel text-[6px] text-[#94a3b8]">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="pixel-card p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-pixel text-[9px] text-[#fbbf24]">⭐ LEVEL {user.level}</span>
          <span className="font-pixel text-[8px] text-[#94a3b8]">{user.totalXp}/{xpForNext} XP</span>
        </div>
        <div className="h-5 bg-[#1a1a3a] border-2 border-[#2a2a5a]">
          <motion.div
            className="xp-bar h-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <p className="font-pixel text-[7px] text-[#94a3b8] mt-1 text-center">
          อีก {xpForNext - user.totalXp} XP ถึง Level {user.level + 1}
        </p>
      </motion.div>

      {/* Habit Breakdown */}
      {activeHabits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pixel-card p-4"
        >
          <p className="font-pixel text-[9px] text-[#fbbf24] mb-3">🎯 QUEST BREAKDOWN</p>
          <div className="space-y-3">
            {activeHabits.map((h) => (
              <div key={h.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">{h.emoji} {h.name}</span>
                  <span className="font-pixel text-[7px] text-[#fbbf24]">🔥{h.currentStreak}</span>
                </div>
                <div className="h-3 bg-[#1a1a3a] border border-[#2a2a5a]">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: h.totalCompletions > 0 ? `${Math.min(100, h.totalCompletions * 5)}%` : "0%",
                      background: h.totalCompletions >= 20 ? "linear-gradient(90deg, #22c55e, #4ade80)" : h.totalCompletions >= 10 ? "linear-gradient(90deg, #fbbf24, #fde047)" : "linear-gradient(90deg, #ef4444, #f87171)",
                    }}
                  />
                </div>
                <div className="flex justify-between font-pixel text-[6px] text-[#475569] mt-0.5">
                  <span>{h.totalCompletions} DONE</span>
                  <span>BEST: {h.longestStreak}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="pixel-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="font-pixel text-[9px] text-[#fbbf24]">🏆 ACHIEVEMENTS</p>
          <p className="font-pixel text-[7px] text-[#94a3b8]">{unlockedCount}/{ACHIEVEMENTS.length}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = isUnlocked(ach);
            const progress = getProgress(ach);
            return (
              <div
                key={ach.name}
                className={cn(
                  "pixel-card p-2 text-center transition-all",
                  unlocked
                    ? "border-[#fbbf24]/50 bg-[#fbbf24]/5"
                    : "opacity-50"
                )}
              >
                <span className="text-xl block mb-0.5">{unlocked ? ach.icon : "🔒"}</span>
                <span className="font-pixel text-[6px] text-white block">{ach.name}</span>
                {unlocked ? (
                  <span className="font-pixel text-[5px] text-[#22c55e]">✓ UNLOCKED</span>
                ) : (
                  <span className="font-pixel text-[5px] text-[#475569]">{progress}/{ach.req}</span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

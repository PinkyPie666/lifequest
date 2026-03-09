"use client";

import { motion } from "framer-motion";
import { useUserStore } from "@/stores/useUserStore";
import { cn } from "@/lib/utils";

const NPC_PLAYERS = [
  { name: "ShadowMaster", emoji: "🐉", level: 42, xp: 176400, streak: 45 },
  { name: "ZenWarrior", emoji: "🧙", level: 38, xp: 144400, streak: 32 },
  { name: "HabitHero", emoji: "🦁", level: 35, xp: 122500, streak: 28 },
  { name: "QuestKing", emoji: "👑", level: 30, xp: 90000, streak: 21 },
  { name: "MindForge", emoji: "🤖", level: 27, xp: 72900, streak: 19 },
  { name: "IronWill", emoji: "🐺", level: 25, xp: 62500, streak: 15 },
  { name: "NightOwl", emoji: "🦉", level: 22, xp: 48400, streak: 12 },
  { name: "DawnRiser", emoji: "🌅", level: 18, xp: 32400, streak: 10 },
  { name: "FocusFlow", emoji: "🎯", level: 15, xp: 22500, streak: 8 },
];

function getRankEmoji(rank: number) {
  if (rank === 1) return "👑";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export default function LeaderboardPage() {
  const { user } = useUserStore();

  // Insert user into leaderboard
  const allPlayers = user
    ? [
        ...NPC_PLAYERS,
        { name: user.displayName, emoji: user.avatarEmoji, level: user.level, xp: user.totalXp, streak: user.streakDays },
      ].sort((a, b) => b.xp - a.xp)
    : NPC_PLAYERS;

  const myRankIdx = user ? allPlayers.findIndex((p) => p.name === user.displayName) : -1;

  return (
    <div className="px-4 pt-6 pb-28 safe-top space-y-4">
      <div className="fixed inset-0 scanline pointer-events-none z-10" />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-pixel text-[13px] text-[#fbbf24] retro-text-shadow">🏆 LEADERBOARD</h1>
        <p className="text-sm text-[#94a3b8] mt-1">แข่งขันกับนักผจญภัยคนอื่น</p>
      </motion.div>

      {/* My Rank */}
      {user && myRankIdx >= 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pixel-card p-4 border-[#8b5cf6]"
        >
          <div className="flex items-center gap-3">
            <span className="font-pixel text-[10px] text-[#fbbf24] w-8 text-center">
              {getRankEmoji(myRankIdx + 1)}
            </span>
            <span className="text-2xl">{user.avatarEmoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">
                {user.displayName}
                <span className="font-pixel text-[7px] text-[#8b5cf6] ml-1">(YOU)</span>
              </p>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[7px] text-[#94a3b8]">Lv.{user.level}</span>
                <span className="font-pixel text-[7px] text-[#fbbf24]">{user.totalXp.toLocaleString()} XP</span>
                <span className="font-pixel text-[7px] text-orange-400">🔥{user.streakDays}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-2">
        {allPlayers.map((entry, i) => {
          const isMe = user && entry.name === user.displayName;
          const isTop3 = i < 3;
          return (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className={cn(
                "pixel-card p-3 flex items-center gap-3 transition-all",
                isMe && "border-[#8b5cf6] bg-[#8b5cf6]/5",
                isTop3 && !isMe && (i === 0 ? "border-[#fbbf24]/50" : "")
              )}
            >
              <span className={cn(
                "font-pixel text-[10px] w-8 text-center",
                i === 0 ? "text-[#fbbf24]" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-[#475569]"
              )}>
                {getRankEmoji(i + 1)}
              </span>

              <span className="text-xl flex-shrink-0">{entry.emoji}</span>

              <div className="flex-1 min-w-0">
                <p className={cn("text-sm truncate", isMe ? "text-white" : "text-[#e2e8f0]")}>
                  {entry.name}
                  {isMe && <span className="font-pixel text-[6px] text-[#8b5cf6] ml-1">(YOU)</span>}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-[7px] text-[#94a3b8]">Lv.{entry.level}</span>
                  <span className="font-pixel text-[7px] text-orange-400">🔥{entry.streak}</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-pixel text-[9px] text-[#fbbf24]">{entry.xp.toLocaleString()}</p>
                <p className="font-pixel text-[6px] text-[#475569]">XP</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info */}
      <div className="pixel-card p-3">
        <p className="font-pixel text-[7px] text-[#475569] text-center">
          💡 ทำภารกิจเพิ่มเพื่อไต่อันดับ!
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { Trophy, Medal, Crown, Flame, ChevronUp } from "lucide-react";

const LEADERBOARD = [
  { rank: 1, name: "ShadowMaster", level: 42, xp: 176400, streak: 45, initials: "SM" },
  { rank: 2, name: "ZenWarrior", level: 38, xp: 144400, streak: 32, initials: "ZW" },
  { rank: 3, name: "HabitHero", level: 35, xp: 122500, streak: 28, initials: "HH" },
  { rank: 4, name: "QuestKing", level: 30, xp: 90000, streak: 21, initials: "QK" },
  { rank: 5, name: "MindForge", level: 27, xp: 72900, streak: 19, initials: "MF" },
  { rank: 6, name: "IronWill", level: 25, xp: 62500, streak: 15, initials: "IW" },
  { rank: 7, name: "NightOwl", level: 22, xp: 48400, streak: 12, initials: "NO" },
  { rank: 8, name: "Quest Hero", level: 8, xp: 5200, streak: 7, initials: "QH" },
  { rank: 9, name: "DawnRiser", level: 18, xp: 32400, streak: 10, initials: "DR" },
  { rank: 10, name: "FocusFlow", level: 15, xp: 22500, streak: 8, initials: "FF" },
];


function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
  return null;
}

function getRankColor(rank: number) {
  if (rank === 1) return "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30";
  if (rank === 2) return "from-gray-300/10 to-gray-400/5 border-gray-400/20";
  if (rank === 3) return "from-amber-600/10 to-amber-700/5 border-amber-600/20";
  return "";
}

export default function LeaderboardPage() {
  const { t } = useTranslation();
  const TABS = [t.leaderboard.weekly, t.leaderboard.monthly, t.leaderboard.allTime];
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const myRank = LEADERBOARD.find((e) => e.initials === "QH");

  return (
    <div className="px-4 pt-12 safe-top space-y-5 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-[#a78bfa]" />
          <h1 className="text-2xl font-bold text-white">{t.leaderboard.title}</h1>
        </div>
        <p className="text-sm text-slate-400 mt-0.5">
          {t.leaderboard.subtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-1 p-1 rounded-xl bg-white/5"
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
              activeTab === tab
                ? "gradient-primary text-white shadow"
                : "text-slate-400 hover:text-white"
            )}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {myRank && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 border-quest-purple/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 text-center">
              <span className="text-sm font-bold text-[#a78bfa]">#{myRank.rank}</span>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarFallback>{myRank.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{myRank.name} <span className="text-[11px] text-[#a78bfa]">{t.leaderboard.you}</span></p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-slate-400">Lv.{myRank.level}</span>
                <span className="text-[11px] text-[#a78bfa]">{myRank.xp.toLocaleString()} XP</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-success text-xs">
              <ChevronUp className="h-3 w-3" />
              <span>+2</span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        {LEADERBOARD.map((entry, i) => {
          const isTop3 = entry.rank <= 3;
          const isMe = entry.initials === "QH";
          return (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className={cn(
                "glass-card p-3 flex items-center gap-3 transition-all",
                isTop3 && `bg-gradient-to-r ${getRankColor(entry.rank)}`,
                isMe && "ring-1 ring-quest-purple/40"
              )}
            >
              <div className="w-8 text-center flex-shrink-0">
                {getRankIcon(entry.rank) || (
                  <span className="text-sm font-bold text-slate-500">
                    {entry.rank}
                  </span>
                )}
              </div>
              <Avatar className="h-9 w-9">
                <AvatarFallback className={isTop3 ? "text-xs" : "text-xs"}>
                  {entry.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">
                  {entry.name}
                  {isMe && <span className="text-[11px] text-[#a78bfa] ml-1">{t.leaderboard.you}</span>}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-slate-400">
                    Lv.{entry.level}
                  </span>
                  <span className="flex items-center gap-0.5 text-[11px] text-orange-400">
                    <Flame className="h-2.5 w-2.5" />
                    {entry.streak}d
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold gradient-text">
                  {entry.xp.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400">XP</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getCurrentUser, fetchLeaderboard } from "@/lib/supabase/api";

interface LeaderEntry {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  level: number;
  total_xp: number;
  current_streak: number;
}

function getRankEmoji(rank: number) {
  if (rank === 1) return "👑";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) { router.replace("/login"); return; }
      setMyId(user.id);
      const { data } = await fetchLeaderboard(20);
      setEntries((data as LeaderEntry[]) || []);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-float">🏆</div>
          <p className="font-game text-sm text-[#94a3b8]">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-28 safe-top space-y-4">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-lg text-white">🏆 Leaderboard</h1>
        <p className="text-sm text-[#94a3b8] mt-1">แข่งขันกับนักผจญภัยคนอื่น</p>
      </motion.div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {entries.length > 0 ? entries.map((entry, i) => {
          const isMe = entry.id === myId;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              className={cn(
                "game-card p-3.5 flex items-center gap-3 transition-all",
                isMe && "border-[#8b5cf6]/50 bg-[#8b5cf6]/5"
              )}
            >
              <span className={cn(
                "font-heading text-base w-8 text-center",
                i === 0 ? "text-[#fbbf24]" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-[#475569]"
              )}>
                {getRankEmoji(i + 1)}
              </span>

              <div className="w-10 h-10 rounded-xl bg-[#1a1a3a] border border-[#2a2a5a] flex items-center justify-center text-lg flex-shrink-0">
                {entry.avatar_url ? (
                  <img src={entry.avatar_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                ) : "⚔️"}
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-game truncate", isMe ? "text-white" : "text-[#e2e8f0]")}>
                  {entry.username || entry.full_name || "นักผจญภัย"}
                  {isMe && <span className="font-game text-xs text-[#8b5cf6] ml-1">(คุณ)</span>}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-game text-xs text-[#94a3b8]">Lv.{entry.level}</span>
                  {entry.current_streak > 0 && (
                    <span className="font-game text-xs text-orange-400">🔥{entry.current_streak}</span>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-heading text-sm text-[#fbbf24]">{entry.total_xp.toLocaleString()}</p>
                <p className="font-game text-xs text-[#475569]">XP</p>
              </div>
            </motion.div>
          );
        }) : (
          <div className="game-card p-8 text-center">
            <p className="text-4xl mb-3">🏆</p>
            <p className="font-game text-sm text-[#94a3b8]">ยังไม่มีข้อมูล Leaderboard</p>
            <p className="text-xs text-[#475569] mt-1">ทำภารกิจเพื่อขึ้นอันดับ!</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="game-card p-3">
        <p className="font-game text-xs text-[#475569] text-center">
          💡 ทำภารกิจเพิ่มเพื่อไต่อันดับ!
        </p>
      </div>
    </div>
  );
}

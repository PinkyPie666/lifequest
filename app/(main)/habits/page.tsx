"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, fetchHabits, deleteHabit } from "@/lib/supabase/api";
import type { HabitRow } from "@/types/database";

const CATEGORIES = [
  { id: "all", label: "ทั้งหมด", emoji: "📋" },
  { id: "health", label: "สุขภาพ", emoji: "❤️" },
  { id: "mental", label: "จิตใจ", emoji: "🧠" },
  { id: "finance", label: "การเงิน", emoji: "💰" },
  { id: "learning", label: "เรียนรู้", emoji: "📚" },
  { id: "work", label: "งาน", emoji: "💼" },
];

export default function HabitsPage() {
  const router = useRouter();
  const { play } = useSoundEffect();
  const [habits, setHabits] = useState<HabitRow[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) { router.replace("/login"); return; }
      const { data } = await fetchHabits(user.id);
      setHabits(data);
      setLoading(false);
    }
    load();
  }, [router]);

  const filteredHabits = habits.filter((h) => activeFilter === "all" || h.category === activeFilter);

  const handleDelete = useCallback(async () => {
    if (deleteId) {
      play("error");
      await deleteHabit(deleteId);
      setHabits((prev) => prev.filter((h) => h.id !== deleteId));
      setDeleteId(null);
    }
  }, [deleteId, play]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-float">📋</div>
          <p className="font-game text-sm text-[#94a3b8]">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-28 safe-top space-y-4">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="font-heading text-lg text-white">📋 Quest Log</h1>
        <Link
          href="/habits/new/edit"
          onClick={() => play("click")}
          className="game-btn game-btn-primary px-3 py-1.5 text-xs font-game"
        >
          + สร้างใหม่
        </Link>
      </motion.div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { play("click"); setActiveFilter(cat.id); }}
            className={cn(
              "game-card px-3 py-2 font-game text-xs whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5",
              activeFilter === cat.id
                ? "border-[#fbbf24]/50 bg-[#fbbf24]/10 text-[#fbbf24]"
                : "text-[#475569] hover:text-[#94a3b8]"
            )}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Habit List */}
      <div className="space-y-2">
        {filteredHabits.length > 0 ? (
          filteredHabits.map((habit, i) => {
            const xp = habit.importance ? habit.importance * 10 + 5 : 15;
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="game-card p-3.5 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1a1a3a] border border-[#2a2a5a] flex items-center justify-center text-xl flex-shrink-0">
                  {habit.emoji || "📌"}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-game truncate">{habit.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-game text-xs text-[#8b5cf6]">+{xp} XP</span>
                    {habit.reminder_time && (
                      <span className="font-game text-xs text-[#475569]">⏰ {habit.reminder_time}</span>
                    )}
                    {habit.current_streak > 0 && (
                      <span className="font-game text-xs text-orange-400">🔥{habit.current_streak}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1.5 flex-shrink-0">
                  <Link
                    href={`/habits/${habit.id}/edit`}
                    onClick={() => play("click")}
                    className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#2a2a5a] bg-[#0c0c1d] hover:bg-[#1e1e3a] text-sm transition-colors"
                  >
                    ✏️
                  </Link>
                  <button
                    onClick={() => { play("click"); setDeleteId(habit.id); }}
                    className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#2a2a5a] bg-[#0c0c1d] hover:bg-[#ef4444]/20 text-sm transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="game-card p-10 text-center">
            <p className="text-5xl mb-3 animate-float">🗡️</p>
            <p className="font-game text-sm text-[#94a3b8] mb-2">ยังไม่มีภารกิจ</p>
            <p className="text-sm text-[#475569] mb-4">สร้างภารกิจแรกของคุณเลย!</p>
            <Link href="/habits/new/edit">
              <button
                onClick={() => play("click")}
                className="game-btn game-btn-primary px-6 py-2.5 text-sm font-game"
              >
                สร้างภารกิจใหม่
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {habits.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="game-card p-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-game text-xs text-[#94a3b8]">ภารกิจทั้งหมด</span>
            <span className="font-game text-sm text-[#fbbf24]">{habits.length}</span>
          </div>
        </motion.div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4" onClick={() => setDeleteId(null)}>
          <div className="game-card p-6 w-full max-w-xs text-center space-y-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-3xl">🗑️</p>
            <p className="font-heading text-base text-[#ef4444]">ลบภารกิจ?</p>
            <p className="text-sm text-[#94a3b8]">ลบภารกิจนี้ถาวร ไม่สามารถกู้คืนได้</p>
            <div className="flex gap-3">
              <button onClick={() => { play("click"); setDeleteId(null); }} className="flex-1 game-btn game-btn-secondary py-2.5 font-game text-sm">ยกเลิก</button>
              <button onClick={handleDelete} className="flex-1 game-btn game-btn-danger py-2.5 font-game text-sm">ลบเลย</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useHabitStore } from "@/stores/useHabitStore";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CATEGORIES = [
  { id: "all", label: "ALL", emoji: "📋" },
  { id: "health", label: "HEALTH", emoji: "❤️" },
  { id: "mental", label: "MIND", emoji: "🧠" },
  { id: "finance", label: "MONEY", emoji: "💰" },
  { id: "learning", label: "LEARN", emoji: "📚" },
  { id: "work", label: "WORK", emoji: "💼" },
];

export default function HabitsPage() {
  const { habits, removeHabit } = useHabitStore();
  const { play } = useSoundEffect();
  const [activeFilter, setActiveFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const activeHabits = habits.filter((h) => h.isActive);
  const filteredHabits = activeHabits.filter((h) => activeFilter === "all" || h.category === activeFilter);

  const handleDelete = useCallback(() => {
    if (deleteId) {
      play("error");
      removeHabit(deleteId);
      setDeleteId(null);
    }
  }, [deleteId, removeHabit, play]);

  return (
    <div className="px-4 pt-6 pb-28 safe-top space-y-4">
      <div className="fixed inset-0 scanline pointer-events-none z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="font-pixel text-[13px] text-[#fbbf24] retro-text-shadow">📋 QUEST LOG</h1>
        <Link
          href="/habits/new/edit"
          onClick={() => play("click")}
          className="font-pixel text-[8px] text-white pixel-btn bg-[#8b5cf6] hover:bg-[#7c3aed] px-3 py-1"
        >
          + NEW QUEST
        </Link>
      </motion.div>

      {/* Category Filters */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { play("click"); setActiveFilter(cat.id); }}
            className={cn(
              "pixel-card px-3 py-1.5 font-pixel text-[7px] whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1",
              activeFilter === cat.id
                ? "border-[#fbbf24] bg-[#fbbf24]/10 text-[#fbbf24]"
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
          filteredHabits.map((habit, i) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="pixel-card p-3 flex items-center gap-3"
            >
              <div className="text-2xl flex-shrink-0">{habit.emoji || "📌"}</div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{habit.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-pixel text-[7px] text-[#8b5cf6]">+{habit.xpReward || 15} XP</span>
                  {habit.reminderTime && (
                    <span className="font-pixel text-[7px] text-[#475569]">⏰ {habit.reminderTime}</span>
                  )}
                  {habit.currentStreak > 0 && (
                    <span className="font-pixel text-[7px] text-orange-400">🔥{habit.currentStreak}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-1 flex-shrink-0">
                <Link
                  href={`/habits/${habit.id}/edit`}
                  onClick={() => play("click")}
                  className="w-8 h-8 flex items-center justify-center border-2 border-[#2a2a5a] bg-[#0c0c1d] hover:bg-[#1e1e3a] text-xs transition-colors"
                >
                  ✏️
                </Link>
                <button
                  onClick={() => { play("click"); setDeleteId(habit.id); }}
                  className="w-8 h-8 flex items-center justify-center border-2 border-[#2a2a5a] bg-[#0c0c1d] hover:bg-[#ef4444]/20 text-xs transition-colors"
                >
                  🗑️
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="pixel-card p-10 text-center">
            <p className="text-5xl mb-3 animate-float-pixel">🗡️</p>
            <p className="font-pixel text-[10px] text-[#94a3b8] mb-2">NO QUESTS FOUND</p>
            <p className="text-sm text-[#475569] mb-4">สร้างภารกิจแรกของคุณ!</p>
            <Link href="/habits/new/edit">
              <button
                onClick={() => play("click")}
                className="pixel-btn bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-pixel text-[9px] py-2 px-6"
              >
                CREATE QUEST
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {activeHabits.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pixel-card p-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-pixel text-[7px] text-[#94a3b8]">ACTIVE QUESTS</span>
            <span className="font-pixel text-[8px] text-[#fbbf24]">{activeHabits.length}</span>
          </div>
        </motion.div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4" onClick={() => setDeleteId(null)}>
          <div className="pixel-card p-5 w-full max-w-xs text-center space-y-3" onClick={(e) => e.stopPropagation()}>
            <p className="text-3xl">🗑️</p>
            <p className="font-pixel text-[10px] text-[#ef4444]">DELETE QUEST?</p>
            <p className="text-sm text-[#94a3b8]">ลบภารกิจนี้ถาวร?</p>
            <div className="flex gap-3">
              <button onClick={() => { play("click"); setDeleteId(null); }} className="flex-1 pixel-btn bg-[#1e1e3a] text-[#94a3b8] font-pixel text-[9px] py-2">CANCEL</button>
              <button onClick={handleDelete} className="flex-1 pixel-btn bg-[#ef4444] text-white font-pixel text-[9px] py-2">DELETE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

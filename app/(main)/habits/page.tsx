"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";
import { useHabitStore } from "@/stores/useHabitStore";
import { Plus, Search, Filter, Settings, Flame, Bell, BellOff, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "health", label: "Health", color: "#ef4444" },
  { id: "mental", label: "Mental", color: "#a78bfa" },
  { id: "finance", label: "Finance", color: "#34d399" },
  { id: "learning", label: "Learning", color: "#f59e0b" },
  { id: "work", label: "Work", color: "#60a5fa" },
];

export default function HabitsPage() {
  const { t } = useTranslation();
  const { habits } = useHabitStore();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showSearch, setShowSearch] = useState(false);

  const handleComplete = useCallback((habitId: string) => {
    setCompletedIds((prev) =>
      prev.includes(habitId) ? prev.filter((id) => id !== habitId) : [...prev, habitId]
    );
  }, []);

  const activeHabits = habits.filter((h) => h.isActive);
  const sortedHabits = [...activeHabits].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const filteredHabits = sortedHabits.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "all" || h.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="px-4 pt-12 pb-28 safe-top space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-white">{t.habits.myHabits}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="h-5 w-5" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Input
              placeholder={t.habits.searchHabits}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0",
              activeFilter === cat.id
                ? cat.id === "all"
                  ? "gradient-primary text-white"
                  : "text-white"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            )}
            style={
              activeFilter === cat.id && cat.id !== "all"
                ? { backgroundColor: cat.color }
                : undefined
            }
          >
            {cat.id === "all" && <Filter className="h-3 w-3 inline mr-1" />}
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredHabits.length > 0 ? (
          filteredHabits.map((habit, i) => {
            const isCompleted = completedIds.includes(habit.id);
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  "glass-card p-4 flex items-center gap-3 transition-all",
                  isCompleted && "opacity-60"
                )}
              >
                <GripVertical className="h-4 w-4 text-slate-600 flex-shrink-0 cursor-grab" />

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleComplete(habit.id)}
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all",
                    isCompleted
                      ? "bg-emerald-500/20 border border-emerald-500/30"
                      : "bg-white/5 border border-white/10"
                  )}
                >
                  {isCompleted ? "✅" : (habit.emoji || habit.icon)}
                </motion.button>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium text-white truncate",
                    isCompleted && "line-through text-slate-500"
                  )}>
                    {habit.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {habit.reminderTime && (
                      <span className="text-[11px] text-slate-400">⏰ {habit.reminderTime}</span>
                    )}
                    {habit.reminderEnabled !== undefined && (
                      habit.reminderEnabled
                        ? <Bell className="h-3 w-3 text-[#a78bfa]" />
                        : <BellOff className="h-3 w-3 text-slate-600" />
                    )}
                    {habit.currentStreak > 0 && (
                      <span className="flex items-center gap-0.5 text-[11px] text-orange-400">
                        <Flame className="h-3 w-3" />
                        {habit.currentStreak}d
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/habits/${habit.id}/edit`}
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-5xl mb-4">🎯</p>
            <p className="text-sm text-slate-400 mb-4">{t.habits.noHabitsFound}</p>
            <Link href="/onboarding/setup">
              <Button size="sm" variant="outline">
                {t.onboarding.setupTitle}
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* FAB Button */}
      <Link
        href="/habits/new/edit"
        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-2xl gradient-primary shadow-lg shadow-quest-purple/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        <Plus className="h-6 w-6 text-white" />
      </Link>
    </div>
  );
}

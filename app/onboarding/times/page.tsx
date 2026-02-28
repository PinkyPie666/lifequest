"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { useHabitStore } from "@/stores/useHabitStore";
import { Clock, Bell, BellOff, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { HabitCategory } from "@/types";

export default function TimesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { selectedHabits, updateHabitTime, updateHabitReminder, targetWakeTime, targetSleepTime, reset } = useOnboardingStore();
  const { addHabit } = useHabitStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleStart = () => {
    selectedHabits.forEach((h, i) => {
      addHabit({
        id: `habit-${Date.now()}-${i}`,
        userId: "local",
        emoji: h.emoji,
        name: h.name,
        icon: h.emoji,
        category: h.category as HabitCategory,
        difficulty: "medium",
        frequency: "daily",
        targetDays: [0, 1, 2, 3, 4, 5, 6],
        reminderTime: h.reminderTime,
        reminderEnabled: h.reminderEnabled,
        importance: 5,
        sortOrder: i,
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        xpReward: 25,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      });
    });
    reset();
    router.push("/dashboard");
  };

  useEffect(() => {
    if (mounted && (!selectedHabits || selectedHabits.length === 0)) {
      router.push("/onboarding/setup");
    }
  }, [mounted, selectedHabits, router]);

  if (!mounted || !selectedHabits || selectedHabits.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-12 pb-8 safe-top safe-bottom">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-5 w-5 text-[#a78bfa]" />
          <h1 className="text-2xl font-bold text-white">{t.onboarding.timesTitle}</h1>
        </div>
        <p className="text-sm text-slate-400 mb-2">{t.onboarding.timesDesc}</p>
        {targetWakeTime && targetSleepTime && (
          <p className="text-xs text-slate-500 mb-6">
            🌅 {targetWakeTime} — 🌙 {targetSleepTime}
          </p>
        )}
      </motion.div>

      <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
        {selectedHabits.map((habit, i) => (
          <motion.div
            key={habit.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{habit.emoji}</span>
              <h3 className="text-sm font-semibold text-white flex-1">{habit.name}</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-slate-400">⏰</span>
                <input
                  type="time"
                  value={habit.reminderTime}
                  onChange={(e) => updateHabitTime(habit.name, e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#a78bfa] transition-colors [color-scheme:dark] flex-1"
                />
              </div>
              <button
                onClick={() => updateHabitReminder(habit.name, !habit.reminderEnabled)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  habit.reminderEnabled
                    ? "bg-[#a78bfa]/20 text-[#a78bfa]"
                    : "bg-white/5 text-slate-500"
                )}
              >
                {habit.reminderEnabled ? (
                  <Bell className="h-3.5 w-3.5" />
                ) : (
                  <BellOff className="h-3.5 w-3.5" />
                )}
                {t.onboarding.reminder}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <Button size="lg" className="w-full" onClick={handleStart}>
          {t.onboarding.startAdventureBtn}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.onboarding.back}
        </Button>
      </div>
    </div>
  );
}

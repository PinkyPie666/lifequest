"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "@/hooks/useTranslation";
import { useHabitStore } from "@/stores/useHabitStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Plus,
  Bell,
  Flame,
  Target,
  Star,
  TrendingUp,
  Check,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { t, locale } = useTranslation();
  const { habits } = useHabitStore();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [xpAnimations, setXpAnimations] = useState<{ id: string; xp: number; key: number }[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [skipHabitId, setSkipHabitId] = useState<string | null>(null);

  const activeHabits = useMemo(
    () => habits.filter((h) => h.isActive).sort((a, b) => {
      const timeA = a.reminderTime || "99:99";
      const timeB = b.reminderTime || "99:99";
      return timeA.localeCompare(timeB);
    }),
    [habits]
  );

  const totalToday = activeHabits.length;
  const completedToday = completedIds.length;
  const progressPct = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  const streakDays = 12; // TODO: compute from store
  const userLevel = 12;

  const handleComplete = useCallback((habitId: string) => {
    if (completedIds.includes(habitId)) return;
    const habit = activeHabits.find((h) => h.id === habitId);
    const xp = habit?.xpReward || 15;

    setCompletedIds((prev) => [...prev, habitId]);
    setXpAnimations((prev) => [...prev, { id: habitId, xp, key: Date.now() }]);

    // Vibration
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Check if all done
    if (completedIds.length + 1 >= totalToday && totalToday > 0) {
      setTimeout(() => setShowCelebration(true), 600);
    }
  }, [completedIds, activeHabits, totalToday]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSkip = (reason?: string) => {
    if (skipHabitId) {
      // Mark as skipped (just remove from checklist visually)
      setCompletedIds((prev) => [...prev, skipHabitId]);
    }
    setSkipHabitId(null);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.dashboard.goodMorning : hour < 17 ? t.dashboard.goodAfternoon : hour < 21 ? t.dashboard.goodEvening : t.dashboard.goodNight;
  const today = new Date().toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // SVG circular progress
  const circleR = 58;
  const circleC = 2 * Math.PI * circleR;
  const circleOffset = circleC - (progressPct / 100) * circleC;

  return (
    <div className="px-4 pt-12 pb-28 safe-top space-y-5">
      {/* ─── Header ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11">
            <AvatarFallback className="text-white bg-gradient-to-br from-[#a78bfa] to-[#6366f1] font-bold">
              QH
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-slate-400">{greeting}</p>
            <h1 className="text-lg font-bold text-white">Quest Hero</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-slate-400">{today}</p>
          <button className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center relative">
            <Bell className="h-4 w-4 text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </motion.div>

      {/* ─── Stats Row (horizontal scroll) ──── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-1"
      >
        {/* Streak */}
        <div className="glass-card p-4 min-w-[130px] flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-5 w-5 text-orange-400" />
            <span className="text-2xl font-bold text-white">{streakDays}</span>
          </div>
          <p className="text-[11px] text-slate-400">{t.dashboard.streakDays}</p>
        </div>
        {/* Today */}
        <div className="glass-card p-4 min-w-[130px] flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-5 w-5 text-emerald-400" />
            <span className="text-2xl font-bold text-white">{progressPct}%</span>
          </div>
          <p className="text-[11px] text-slate-400">{completedToday}/{totalToday} {t.dashboard.today}</p>
        </div>
        {/* Level */}
        <div className="glass-card p-4 min-w-[130px] flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-5 w-5 text-[#a78bfa]" />
            <span className="text-2xl font-bold text-white">Lv.{userLevel}</span>
          </div>
          <p className="text-[11px] text-slate-400">Silver 🥈</p>
        </div>
      </motion.div>

      {/* ─── Today's Progress (Circular) ────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 flex flex-col items-center"
      >
        <div className="relative w-36 h-36">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r={circleR} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <motion.circle
              cx="64"
              cy="64"
              r={circleR}
              fill="none"
              stroke="url(#progressGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circleC}
              initial={{ strokeDashoffset: circleC }}
              animate={{ strokeDashoffset: circleOffset }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{progressPct}%</span>
            <span className="text-xs text-slate-400">
              {t.dashboard.habitsOf.replace("{done}", String(completedToday)).replace("{total}", String(totalToday))}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ─── Habit Checklist ─────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white">📋 {t.dashboard.todaysQuests}</h2>
          <Button asChild variant="ghost" size="sm" className="text-[#a78bfa] text-xs">
            <Link href="/habits">
              <Plus className="h-3.5 w-3.5 mr-1" />
              {t.dashboard.add}
            </Link>
          </Button>
        </div>

        {activeHabits.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center">
            <p className="text-4xl mb-3">🎯</p>
            <p className="text-sm text-slate-400 mb-3">{t.habits.noHabitsFound}</p>
            <Link href="/onboarding/setup">
              <Button size="sm">{t.onboarding.setupTitle}</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {activeHabits.map((habit, i) => {
              const isCompleted = completedIds.includes(habit.id);
              const xp = habit.xpReward || 15;
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "glass-card p-4 relative overflow-hidden transition-all",
                    isCompleted && "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Check circle */}
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => handleComplete(habit.id)}
                      onContextMenu={(e) => { e.preventDefault(); setSkipHabitId(habit.id); }}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-all",
                        isCompleted
                          ? "bg-emerald-500/20 border border-emerald-500/40"
                          : "bg-white/5 border border-white/10"
                      )}
                    >
                      {isCompleted ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                          <Check className="h-5 w-5 text-emerald-400" />
                        </motion.div>
                      ) : (
                        <span>{habit.emoji || habit.icon}</span>
                      )}
                    </motion.button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium text-white truncate",
                        isCompleted && "line-through text-slate-500"
                      )}>
                        {habit.name}
                      </p>
                      <p className={cn(
                        "text-[11px]",
                        isCompleted ? "text-emerald-400" : "text-[#a78bfa]"
                      )}>
                        {isCompleted
                          ? t.dashboard.xpEarned.replace("{xp}", String(xp))
                          : t.dashboard.xpReward.replace("{xp}", String(xp))}
                      </p>
                    </div>

                    {/* Right side: time + streak */}
                    <div className="flex flex-col items-end flex-shrink-0">
                      {habit.reminderTime && (
                        <span className={cn(
                          "text-xs font-medium",
                          isCompleted ? "text-emerald-400" : "text-slate-400"
                        )}>
                          {isCompleted ? "✓" : ""} {habit.reminderTime}
                        </span>
                      )}
                      {habit.currentStreak > 0 && (
                        <span className="flex items-center gap-0.5 text-[11px] text-orange-400">
                          <Flame className="h-3 w-3" />
                          {habit.currentStreak}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* XP float animation */}
                  <AnimatePresence>
                    {xpAnimations
                      .filter((a) => a.id === habit.id)
                      .map((a) => (
                        <motion.div
                          key={a.key}
                          initial={{ opacity: 1, y: 0 }}
                          animate={{ opacity: 0, y: -40 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute top-2 right-4 text-sm font-bold text-emerald-400 pointer-events-none"
                          onAnimationComplete={() =>
                            setXpAnimations((prev) => prev.filter((x) => x.key !== a.key))
                          }
                        >
                          +{a.xp} XP
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Quick Stats ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-3"
      >
        <div className="glass-card p-3 flex-1 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span className="text-xs text-slate-300">
            {t.dashboard.weekThisWeek.replace("{pct}", "85")}
          </span>
        </div>
        <div className="glass-card p-3 flex-1 flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-[#a78bfa] flex-shrink-0" />
          <span className="text-xs text-slate-300">
            {t.dashboard.weekCompare.replace("{pct}", "12")}
          </span>
        </div>
      </motion.div>

      {/* ─── Skip Dialog ─────────────────────── */}
      <AnimatePresence>
        {skipHabitId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-8"
            onClick={() => setSkipHabitId(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="glass-card p-5 max-w-sm w-full space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold text-white text-center">{t.dashboard.skipTitle}</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  t.dashboard.skipReasonSick,
                  t.dashboard.skipReasonNoTime,
                  t.dashboard.skipReasonForgot,
                  t.dashboard.skipReasonOther,
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => handleSkip(reason)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white hover:bg-white/10 transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <p className="text-xs text-amber-400 text-center">{t.dashboard.skipWarning}</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setSkipHabitId(null)}>
                  {t.dashboard.cancelBtn}
                </Button>
                <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white shadow-none" onClick={() => handleSkip()}>
                  {t.dashboard.skipBtn}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Celebration Modal ───────────────── */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-card p-8 max-w-sm w-full text-center space-y-4"
            >
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                className="text-5xl"
              >
                🎉
              </motion.p>
              <h2 className="text-xl font-bold text-white">{t.dashboard.perfectDay}</h2>
              <p className="text-[#a78bfa] font-semibold">
                ⭐ {t.dashboard.bonusXp.replace("{xp}", "50")}
              </p>
              <p className="text-sm text-orange-400">
                🔥 {t.dashboard.streakCount.replace("{days}", String(streakDays + 1))}
              </p>
              <div className="flex gap-3 pt-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/stats">{t.dashboard.viewStats}</Link>
                </Button>
                <Button className="flex-1" onClick={() => setShowCelebration(false)}>
                  {t.dashboard.close}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/stores/useUserStore";
import { useHabitStore } from "@/stores/useHabitStore";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { user, addXp, addCoins, checkStreak, updateProfile } = useUserStore();
  const { habits } = useHabitStore();
  const { play } = useSoundEffect();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [xpAnimations, setXpAnimations] = useState<{ id: string; xp: number; key: number }[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!user || !user.onboardingCompleted) {
      router.replace("/");
      return;
    }
    checkStreak();
  }, [user, router, checkStreak]);

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

  const xpForNext = user ? (user.level * user.level * 100) : 100;
  const xpProgress = user ? Math.min(100, Math.round((user.totalXp / xpForNext) * 100)) : 0;

  const handleComplete = useCallback((habitId: string) => {
    if (completedIds.includes(habitId)) return;
    const habit = activeHabits.find((h) => h.id === habitId);
    const xp = habit?.xpReward || 15;

    play("complete");
    setCompletedIds((prev) => [...prev, habitId]);
    setXpAnimations((prev) => [...prev, { id: habitId, xp, key: Date.now() }]);
    addXp(xp);
    addCoins(Math.floor(xp / 3));
    updateProfile({ totalCompletions: (user?.totalCompletions || 0) + 1 });

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }

    if (completedIds.length + 1 >= totalToday && totalToday > 0) {
      setTimeout(() => {
        play("levelup");
        setShowCelebration(true);
        updateProfile({ perfectDays: (user?.perfectDays || 0) + 1 });
      }, 600);
    }
  }, [completedIds, activeHabits, totalToday, play, addXp, addCoins, updateProfile, user]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : hour < 21 ? "Good Evening" : "Good Night";

  if (!user) return null;

  return (
    <div className="px-4 pt-6 pb-28 safe-top space-y-4">
      <div className="fixed inset-0 scanline pointer-events-none z-10" />

      {/* ─── Player HUD Header ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pixel-card p-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl animate-float-pixel">{user.avatarEmoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-pixel text-sm text-white truncate">{user.displayName}</p>
              <span className="font-pixel text-[8px] text-[#fbbf24] bg-[#fbbf24]/10 px-2 py-0.5">
                Lv.{user.level}
              </span>
            </div>
            <p className="text-sm text-[#94a3b8]">{greeting} 👋</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1">
              <span className="text-sm">🪙</span>
              <span className="font-pixel text-[10px] text-[#fbbf24]">{user.coins}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">🔥</span>
              <span className="font-pixel text-[10px] text-orange-400">{user.streakDays}</span>
            </div>
          </div>
        </div>

        {/* HP / MP / XP Bars */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[7px] text-[#ef4444] w-6">HP</span>
            <div className="flex-1 h-3 bg-[#1a1a3a] border border-[#2a2a5a]">
              <div className="hp-bar h-full transition-all" style={{ width: `${Math.round((user.hp / user.maxHp) * 100)}%` }} />
            </div>
            <span className="font-pixel text-[7px] text-[#94a3b8] w-12 text-right">{user.hp}/{user.maxHp}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[7px] text-[#3b82f6] w-6">MP</span>
            <div className="flex-1 h-3 bg-[#1a1a3a] border border-[#2a2a5a]">
              <div className="mp-bar h-full transition-all" style={{ width: `${Math.round((user.mp / user.maxMp) * 100)}%` }} />
            </div>
            <span className="font-pixel text-[7px] text-[#94a3b8] w-12 text-right">{user.mp}/{user.maxMp}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[7px] text-[#fbbf24] w-6">XP</span>
            <div className="flex-1 h-3 bg-[#1a1a3a] border border-[#2a2a5a]">
              <div className="xp-bar h-full transition-all" style={{ width: `${xpProgress}%` }} />
            </div>
            <span className="font-pixel text-[7px] text-[#94a3b8] w-12 text-right">{user.totalXp}/{xpForNext}</span>
          </div>
        </div>
      </motion.div>

      {/* ─── Quick Stats ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-2"
      >
        <div className="pixel-card p-3 text-center">
          <p className="text-xl mb-1">🔥</p>
          <p className="font-pixel text-sm text-white">{user.streakDays}</p>
          <p className="font-pixel text-[6px] text-[#94a3b8]">STREAK</p>
        </div>
        <div className="pixel-card p-3 text-center">
          <p className="text-xl mb-1">🎯</p>
          <p className="font-pixel text-sm text-white">{progressPct}%</p>
          <p className="font-pixel text-[6px] text-[#94a3b8]">TODAY</p>
        </div>
        <div className="pixel-card p-3 text-center">
          <p className="text-xl mb-1">⚡</p>
          <p className="font-pixel text-sm text-white">{user.totalXp}</p>
          <p className="font-pixel text-[6px] text-[#94a3b8]">TOTAL XP</p>
        </div>
      </motion.div>

      {/* ─── Today's Quests ────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-pixel text-[11px] text-[#fbbf24] retro-text-shadow">
            📋 TODAY&apos;S QUESTS
          </h2>
          <Link
            href="/habits/new/edit"
            className="font-pixel text-[8px] text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
            onClick={() => play("click")}
          >
            + ADD
          </Link>
        </div>

        {activeHabits.length === 0 ? (
          <div className="pixel-card p-8 text-center">
            <p className="text-4xl mb-3 animate-float-pixel">🗡️</p>
            <p className="font-pixel text-[10px] text-[#94a3b8] mb-4">NO QUESTS YET</p>
            <p className="text-sm text-[#475569] mb-4">สร้างภารกิจแรกของคุณ!</p>
            <Link href="/habits/new/edit">
              <button
                onClick={() => play("click")}
                className="pixel-btn bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-pixel text-[10px] py-2 px-6 tracking-wider"
              >
                CREATE QUEST
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {activeHabits.map((habit, i) => {
              const isCompleted = completedIds.includes(habit.id);
              const xp = habit.xpReward || 15;
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => handleComplete(habit.id)}
                    disabled={isCompleted}
                    className={cn(
                      "pixel-card p-3 w-full text-left relative overflow-hidden transition-all",
                      isCompleted
                        ? "opacity-50 border-[#22c55e]/30"
                        : "hover:bg-[#1a1a3a] active:translate-x-1 active:translate-y-1"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 flex items-center justify-center text-lg border-2 transition-all flex-shrink-0",
                        isCompleted
                          ? "border-[#22c55e] bg-[#22c55e]/20"
                          : "border-[#2a2a5a] bg-[#0c0c1d]"
                      )}>
                        {isCompleted ? (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.6 }}
                            className="text-[#22c55e] font-pixel text-[10px]"
                          >
                            ✓
                          </motion.span>
                        ) : (
                          <span>{habit.emoji || "📌"}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-retro truncate",
                          isCompleted ? "line-through text-[#475569]" : "text-white"
                        )}>
                          {habit.name}
                        </p>
                        <p className={cn(
                          "font-pixel text-[7px]",
                          isCompleted ? "text-[#22c55e]" : "text-[#8b5cf6]"
                        )}>
                          {isCompleted ? `+${xp} XP EARNED` : `+${xp} XP`}
                        </p>
                      </div>

                      <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                        {habit.reminderTime && (
                          <span className="font-pixel text-[7px] text-[#475569]">{habit.reminderTime}</span>
                        )}
                        {habit.currentStreak > 0 && (
                          <span className="font-pixel text-[7px] text-orange-400">🔥{habit.currentStreak}</span>
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
                            animate={{ opacity: 0, y: -30 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute top-1 right-3 font-pixel text-[10px] text-[#fbbf24] pointer-events-none retro-text-shadow"
                            onAnimationComplete={() =>
                              setXpAnimations((prev) => prev.filter((x) => x.key !== a.key))
                            }
                          >
                            +{a.xp} XP ⭐
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </button>
                </motion.div>
              );
            })}

            {/* Progress bar */}
            <div className="pixel-card p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-pixel text-[7px] text-[#94a3b8]">QUEST PROGRESS</span>
                <span className="font-pixel text-[7px] text-[#fbbf24]">{completedToday}/{totalToday}</span>
              </div>
              <div className="h-4 bg-[#1a1a3a] border border-[#2a2a5a]">
                <motion.div
                  className="xp-bar h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ─── Celebration Modal ───────────────── */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="pixel-card p-8 max-w-sm w-full text-center space-y-4"
            >
              <motion.p
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                className="text-6xl"
              >
                �
              </motion.p>
              <h2 className="font-pixel text-lg text-[#fbbf24] retro-glow">PERFECT DAY!</h2>
              <p className="font-pixel text-[10px] text-[#8b5cf6]">⭐ +50 BONUS XP</p>
              <p className="text-sm text-orange-400">🔥 Streak: {user.streakDays + 1} วัน</p>
              <div className="flex gap-3 pt-2">
                <Link href="/stats" className="flex-1">
                  <button
                    onClick={() => { play("click"); setShowCelebration(false); }}
                    className="w-full pixel-btn bg-[#1e1e3a] hover:bg-[#2a2a5a] text-[#94a3b8] font-pixel text-[9px] py-2"
                  >
                    VIEW STATS
                  </button>
                </Link>
                <button
                  onClick={() => { play("click"); setShowCelebration(false); }}
                  className="flex-1 pixel-btn bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-pixel text-[9px] py-2"
                >
                  CONTINUE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

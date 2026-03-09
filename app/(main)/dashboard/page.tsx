"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, fetchHabits, fetchTodayLogs, checkInHabit, getOrCreateProfile } from "@/lib/supabase/api";
import type { HabitRow, HabitLog, Profile } from "@/types/database";

export default function DashboardPage() {
  const router = useRouter();
  const { play } = useSoundEffect();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [habits, setHabits] = useState<HabitRow[]>([]);
  const [todayLogs, setTodayLogs] = useState<HabitLog[]>([]);
  const [xpAnimations, setXpAnimations] = useState<{ id: string; xp: number; key: number }[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const [profileRes, habitsRes, logsRes] = await Promise.all([
        getOrCreateProfile(user.id, {
          email: user.email,
          full_name: user.user_metadata?.full_name ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? null,
        }),
        fetchHabits(user.id),
        fetchTodayLogs(user.id),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      setHabits(habitsRes.data);
      setTodayLogs(logsRes.data);
      setLoading(false);
    }
    loadData();
  }, [router]);

  const completedIds = useMemo(
    () => todayLogs.filter((l) => l.is_completed).map((l) => l.habit_id),
    [todayLogs]
  );

  // Sort: uncompleted first (by reminder_time), then completed at bottom
  const sortedHabits = useMemo(() => {
    const uncompleted = habits
      .filter((h) => !completedIds.includes(h.id))
      .sort((a, b) => (a.reminder_time || "99:99").localeCompare(b.reminder_time || "99:99"));
    const completed = habits
      .filter((h) => completedIds.includes(h.id))
      .sort((a, b) => (a.reminder_time || "99:99").localeCompare(b.reminder_time || "99:99"));
    return [...uncompleted, ...completed];
  }, [habits, completedIds]);

  const totalToday = habits.length;
  const completedToday = completedIds.length;
  const progressPct = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const xpForNext = profile ? (profile.level * profile.level * 100) : 100;
  const xpProgress = profile ? Math.min(100, Math.round((profile.total_xp / xpForNext) * 100)) : 0;

  const handleComplete = useCallback(async (habitId: string) => {
    if (completedIds.includes(habitId) || !profile) return;
    const habit = habits.find((h) => h.id === habitId);
    const xp = habit?.importance ? habit.importance * 10 + 5 : 15;

    play("complete");
    setXpAnimations((prev) => [...prev, { id: habitId, xp, key: Date.now() }]);

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }

    const { data } = await checkInHabit(habitId, profile.id, xp);
    if (data) {
      setTodayLogs((prev) => [...prev.filter((l) => l.habit_id !== habitId), data]);
      // Refresh profile for updated XP
      const profileRes = await getOrCreateProfile(profile.id);
      if (profileRes.data) setProfile(profileRes.data);
    }

    if (completedIds.length + 1 >= totalToday && totalToday > 0) {
      setTimeout(() => {
        play("levelup");
        setShowCelebration(true);
      }, 600);
    }
  }, [completedIds, habits, totalToday, play, profile]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "สวัสดีตอนเช้า" : hour < 17 ? "สวัสดีตอนบ่าย" : hour < 21 ? "สวัสดีตอนเย็น" : "ราตรีสวัสดิ์";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-float">⚔️</div>
          <p className="font-game text-sm" style={{ color: "var(--theme-text-dim)" }}>กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3 px-6">
          <div className="text-5xl">⚠️</div>
          <p className="font-heading text-base" style={{ color: "var(--theme-text)" }}>ไม่พบข้อมูลโปรไฟล์</p>
          <p className="font-body text-sm" style={{ color: "var(--theme-text-dim)" }}>กรุณาตรวจสอบการตั้งค่า Supabase</p>
          <button onClick={() => router.replace("/login")} className="game-btn bg-purple-600 text-white font-heading text-sm px-4 py-2 rounded-xl">
            กลับหน้า Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-28 safe-top space-y-4">

      {/* ─── Player HUD Header ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-card p-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 20%, transparent), color-mix(in srgb, var(--theme-secondary) 20%, transparent))", borderColor: "var(--theme-border)" }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
            ) : "⚔️"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-heading text-base truncate" style={{ color: "var(--theme-text)" }}>{profile.username || profile.full_name || "นักผจญภัย"}</p>
              <span className="font-game text-xs px-2 py-0.5 rounded-md" style={{ color: "var(--theme-xp)", background: "color-mix(in srgb, var(--theme-xp) 10%, transparent)" }}>
                Lv.{profile.level}
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--theme-text-dim)" }}>{greeting} 👋</p>
          </div>
          <div className="text-right flex-shrink-0 space-y-0.5">
            <div className="flex items-center gap-1 justify-end">
              <span className="text-sm">🔥</span>
              <span className="font-game text-sm text-orange-400">{profile.current_streak}</span>
            </div>
          </div>
        </div>

        {/* HP / MP / XP Bars */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-game text-xs w-7" style={{ color: "var(--theme-hp)" }}>HP</span>
            <div className="flex-1 bar-track h-3.5">
              <div className="hp-bar h-full transition-all duration-500" style={{ width: "100%" }} />
            </div>
            <span className="font-game text-xs w-16 text-right" style={{ color: "var(--theme-text-dim)" }}>100/100</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-game text-xs w-7" style={{ color: "var(--theme-mp)" }}>MP</span>
            <div className="flex-1 bar-track h-3.5">
              <div className="mp-bar h-full transition-all duration-500" style={{ width: "100%" }} />
            </div>
            <span className="font-game text-xs w-16 text-right" style={{ color: "var(--theme-text-dim)" }}>50/50</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-game text-xs w-7" style={{ color: "var(--theme-xp)" }}>XP</span>
            <div className="flex-1 bar-track h-3.5">
              <div className="xp-bar h-full transition-all duration-500" style={{ width: `${xpProgress}%` }} />
            </div>
            <span className="font-game text-xs w-16 text-right" style={{ color: "var(--theme-text-dim)" }}>{profile.total_xp}/{xpForNext}</span>
          </div>
        </div>
      </motion.div>

      {/* ─── Quest Progress (replaces streak/today/xp cards) ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="game-card p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-game text-sm" style={{ color: "var(--theme-xp)" }}>◆ Quest Progress</span>
          <span className="font-game text-sm" style={{ color: "var(--theme-text)" }}>{completedToday}/{totalToday}</span>
        </div>
        <div className="bar-track h-5">
          <motion.div
            className="xp-bar h-full flex items-center justify-center"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6 }}
          >
            {progressPct > 15 && (
              <span className="font-game text-xs text-[#1a1a2e]">{progressPct}%</span>
            )}
          </motion.div>
        </div>
        {progressPct === 100 && (
          <p className="text-center text-sm font-game mt-1.5" style={{ color: "var(--theme-success)" }}>🎉 ภารกิจวันนี้ครบแล้ว!</p>
        )}
      </motion.div>

      {/* ─── Today's Quests ────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-base" style={{ color: "var(--theme-text)" }}>
            ⚔️ Today&apos;s Quests
          </h2>
          <Link
            href="/habits/new/edit"
            className="game-btn game-btn-primary px-3 py-1.5 text-xs font-game"
            onClick={() => play("click")}
          >
            + เพิ่ม
          </Link>
        </div>

        {habits.length === 0 ? (
          <div className="game-card p-8 text-center">
            <p className="text-4xl mb-3 animate-float">🗡️</p>
            <p className="font-game text-sm mb-4" style={{ color: "var(--theme-text-dim)" }}>ยังไม่มีภารกิจ</p>
            <p className="text-sm mb-4" style={{ color: "var(--theme-text-muted)" }}>สร้างภารกิจแรกของคุณเลย!</p>
            <Link href="/habits/new/edit">
              <button
                onClick={() => play("click")}
                className="game-btn game-btn-primary px-6 py-2.5 text-sm font-game"
              >
                สร้างภารกิจใหม่
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {sortedHabits.map((habit, i) => {
                const isCompleted = completedIds.includes(habit.id);
                const xp = habit.importance ? habit.importance * 10 + 5 : 15;
                return (
                  <motion.div
                    key={habit.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.03, layout: { duration: 0.3 } }}
                  >
                    <button
                      onClick={() => handleComplete(habit.id)}
                      disabled={isCompleted}
                      className={cn(
                        "game-card p-3.5 w-full text-left relative overflow-hidden transition-all",
                        isCompleted
                          ? "opacity-50 border-[#22c55e]/20"
                          : "hover:border-[#8b5cf6]/40 active:scale-[0.98]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all flex-shrink-0 border"
                          style={{
                            background: isCompleted ? "color-mix(in srgb, var(--theme-success) 15%, transparent)" : "var(--theme-bg-dark)",
                            borderColor: isCompleted ? "color-mix(in srgb, var(--theme-success) 40%, transparent)" : "var(--theme-border)",
                          }}
                        >
                          {isCompleted ? (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", bounce: 0.6 }}
                              className="text-base"
                              style={{ color: "var(--theme-success)" }}
                            >
                              ✓
                            </motion.span>
                          ) : (
                            <span>{habit.emoji || "📌"}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={cn("text-sm font-game truncate", isCompleted ? "line-through" : "")}
                            style={{ color: isCompleted ? "var(--theme-text-muted)" : "var(--theme-text)" }}
                          >
                            {habit.name}
                          </p>
                          <p
                            className="font-game text-xs"
                            style={{ color: isCompleted ? "var(--theme-success)" : "var(--theme-primary)" }}
                          >
                            {isCompleted ? `+${xp} XP Earned` : `+${xp} XP`}
                          </p>
                        </div>

                        <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                          {habit.reminder_time && (
                            <span className="font-game text-xs" style={{ color: "var(--theme-text-muted)" }}>{habit.reminder_time}</span>
                          )}
                          {habit.current_streak > 0 && (
                            <span className="font-game text-xs text-orange-400">🔥{habit.current_streak}</span>
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
                              className="absolute top-1 right-3 font-game text-sm text-[#fbbf24] pointer-events-none"
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
            </AnimatePresence>
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
              className="game-card p-8 max-w-sm w-full text-center space-y-4"
            >
              <motion.p
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                className="text-6xl"
              >
                🏆
              </motion.p>
              <h2 className="font-heading text-2xl retro-glow" style={{ color: "var(--theme-xp)" }}>Perfect Day!</h2>
              <p className="font-game text-sm" style={{ color: "var(--theme-primary)" }}>⭐ +50 Bonus XP</p>
              <p className="text-sm text-orange-400">🔥 Streak: {(profile?.current_streak || 0) + 1} วัน</p>
              <div className="flex gap-3 pt-2">
                <Link href="/stats" className="flex-1">
                  <button
                    onClick={() => { play("click"); setShowCelebration(false); }}
                    className="w-full game-btn game-btn-secondary py-2.5 text-sm font-game"
                  >
                    ดูสถิติ
                  </button>
                </Link>
                <button
                  onClick={() => { play("click"); setShowCelebration(false); }}
                  className="flex-1 game-btn game-btn-primary py-2.5 text-sm font-game"
                >
                  ดำเนินการต่อ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

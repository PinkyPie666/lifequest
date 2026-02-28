"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  Award,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// ─── Demo data (replace with real queries when Supabase is wired) ────
const DEMO_WEEKLY = [
  { day: "mon", pct: 100 },
  { day: "tue", pct: 75 },
  { day: "wed", pct: 50 },
  { day: "thu", pct: 100 },
  { day: "fri", pct: 25 },
  { day: "sat", pct: 80 },
  { day: "sun", pct: 60 },
];

const DEMO_HABIT_BREAKDOWN = [
  { emoji: "🌅", name: "ตื่นเช้า", done: 23, total: 25, pct: 92, bestStreak: 14 },
  { emoji: "🏃", name: "ออกกำลังกาย", done: 17, total: 25, pct: 68, bestStreak: 8 },
  { emoji: "📚", name: "อ่านหนังสือ", done: 11, total: 25, pct: 45, bestStreak: 5 },
  { emoji: "💧", name: "ดื่มน้ำ", done: 20, total: 25, pct: 80, bestStreak: 12 },
];

// Heatmap: 4 weeks x 7 days (0=none, 1=<50%, 2=50-99%, 3=100%)
const DEMO_HEATMAP = [
  [3, 3, 3, 2, 1, 3, 3],
  [3, 2, 3, 3, 3, 0, 2],
  [3, 3, 3, 2, 3, 3, 3],
  [3, 3, 1, 2, 3, 3, 3],
];

const DEMO_DAY_ANALYSIS = [
  { day: "mon", pct: 92 },
  { day: "tue", pct: 88 },
  { day: "wed", pct: 78 },
  { day: "thu", pct: 85 },
  { day: "fri", pct: 62 },
  { day: "sat", pct: 45 },
  { day: "sun", pct: 55 },
];

const ACHIEVEMENTS = [
  { icon: "🎯", name: "First Step", desc: "First check-in", unlocked: true },
  { icon: "🔥", name: "On Fire", desc: "7-day streak", unlocked: true },
  { icon: "💪", name: "Unstoppable", desc: "14-day streak", unlocked: true },
  { icon: "🏆", name: "Champion", desc: "30-day streak", unlocked: false },
  { icon: "⭐", name: "Half Century", desc: "50 completions", unlocked: true },
  { icon: "💯", name: "Centurion", desc: "100 completions", unlocked: false },
  { icon: "✨", name: "Perfect Week", desc: "100% for 7 days", unlocked: true },
  { icon: "👑", name: "Habit Master", desc: "66-day streak", unlocked: false },
  { icon: "🌟", name: "Superstar", desc: "Level 10", unlocked: false },
];

type Period = "7d" | "30d" | "all";

export default function StatsPage() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>("30d");

  const dayKeys = useMemo(
    () => [t.stats.mon, t.stats.tue, t.stats.wed, t.stats.thu, t.stats.fri, t.stats.sat, t.stats.sun],
    [t]
  );

  const chartData = DEMO_WEEKLY.map((d) => ({
    day: t.stats[d.day as keyof typeof t.stats] || d.day,
    percentage: d.pct,
  }));

  // Demo overview
  const overview = {
    totalCompletions: 127,
    bestStreak: 21,
    totalXp: 2450,
    completionRate: 78,
  };

  const weekDelta = 12; // +12% vs last week

  // Level info
  const userLevel = 12;
  const userXp = 2450;
  const nextLevelXp = 3000;
  const xpToGo = nextLevelXp - userXp;

  const bestDayIdx = DEMO_DAY_ANALYSIS.reduce((best, d, i) => (d.pct > DEMO_DAY_ANALYSIS[best].pct ? i : best), 0);
  const worstDayIdx = DEMO_DAY_ANALYSIS.reduce((worst, d, i) => (d.pct < DEMO_DAY_ANALYSIS[worst].pct ? i : worst), 0);

  const heatColors = ["bg-white/[0.03]", "bg-red-500/40", "bg-amber-500/50", "bg-emerald-500/60"];

  return (
    <div className="px-4 pt-12 safe-top space-y-5 pb-28">
      {/* ─── Header + Period Selector ───── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">📊 {t.stats.statistics}</h1>
        <div className="flex gap-2 mt-3">
          {(["7d", "30d", "all"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                period === p
                  ? "gradient-primary text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              )}
            >
              {p === "7d" ? t.stats.period7d : p === "30d" ? t.stats.period30d : t.stats.periodAll}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ─── Overview Stats (2x2) ───────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="glass-card p-4">
          <p className="text-2xl font-bold text-white">✅ {overview.totalCompletions}</p>
          <p className="text-[11px] text-slate-400">{t.stats.totalCompletions}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-2xl font-bold text-white">🔥 {overview.bestStreak}</p>
          <p className="text-[11px] text-slate-400">{t.stats.bestStreak}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-2xl font-bold text-white">⭐ {overview.totalXp.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">{t.stats.xpThisMonth}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-2xl font-bold text-white">📈 {overview.completionRate}%</p>
          <p className="text-[11px] text-slate-400">{t.stats.completionRate}</p>
        </div>
      </motion.div>

      {/* ─── Weekly Chart (Recharts) ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-4 w-4 text-[#a78bfa]" />
          <h3 className="text-sm font-semibold text-white">{t.stats.weeklyActivity}</h3>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(15,15,26,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                color: "#fff",
                fontSize: 12,
              }}
              formatter={(value: number | undefined) => [`${value ?? 0}%`, ""]}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Area
              type="monotone"
              dataKey="percentage"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#colorProgress)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ─── Week Comparison ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">{t.stats.weekComparison}</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-1 text-lg font-bold",
            weekDelta > 0 ? "text-emerald-400" : weekDelta < 0 ? "text-red-400" : "text-slate-400"
          )}>
            {weekDelta > 0 ? <ArrowUp className="h-5 w-5" /> : weekDelta < 0 ? <ArrowDown className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
            {weekDelta > 0
              ? t.stats.weekUp.replace("{pct}", String(weekDelta))
              : weekDelta < 0
                ? t.stats.weekDown.replace("{pct}", String(Math.abs(weekDelta)))
                : t.stats.weekSame}
          </div>
        </div>
        {/* Mini sparkline via 4-week bars */}
        <div className="flex items-end gap-1.5 mt-3 h-10">
          {[62, 70, 74, 85].map((v, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${v}%` }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className={cn(
                "flex-1 rounded-t-md",
                i === 3 ? "gradient-primary" : "bg-white/10"
              )}
            />
          ))}
        </div>
        <div className="flex gap-1.5 mt-1">
          {["W1", "W2", "W3", "W4"].map((w, i) => (
            <span key={w} className={cn("flex-1 text-center text-[10px]", i === 3 ? "text-[#a78bfa]" : "text-slate-500")}>{w}</span>
          ))}
        </div>
      </motion.div>

      {/* ─── Habit Breakdown ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-[#a78bfa]" />
          <h3 className="text-sm font-semibold text-white">🎯 {t.stats.habitBreakdown}</h3>
        </div>
        <div className="space-y-4">
          {DEMO_HABIT_BREAKDOWN.map((h) => (
            <div key={h.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">
                  {h.emoji} {h.name}
                </span>
                <span className="text-sm font-bold text-white">{h.pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden mb-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${h.pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background: h.pct >= 80 ? "linear-gradient(90deg, #34d399, #22c55e)" : h.pct >= 50 ? "linear-gradient(90deg, #fbbf24, #f59e0b)" : "linear-gradient(90deg, #f87171, #ef4444)",
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {t.stats.daysCount.replace("{done}", String(h.done)).replace("{total}", String(h.total))}
                </span>
                <span>🔥 {t.stats.best}: {h.bestStreak}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Calendar Heatmap ────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-[#a78bfa]" />
          <h3 className="text-sm font-semibold text-white">📅 {t.stats.calendarHeatmap}</h3>
        </div>
        {/* Day headers */}
        <div className="grid grid-cols-8 gap-1.5 mb-1">
          <span className="text-[10px] text-slate-500" />
          {dayKeys.map((d) => (
            <span key={d} className="text-[10px] text-slate-500 text-center">{d}</span>
          ))}
        </div>
        {/* Weeks */}
        {DEMO_HEATMAP.map((week, wi) => (
          <div key={wi} className="grid grid-cols-8 gap-1.5 mb-1.5">
            <span className="text-[10px] text-slate-500 flex items-center">W{wi + 1}</span>
            {week.map((val, di) => (
              <div
                key={di}
                className={cn(
                  "aspect-square rounded-md transition-colors",
                  heatColors[val]
                )}
              />
            ))}
          </div>
        ))}
        {/* Legend */}
        <div className="flex items-center gap-3 mt-3 justify-center">
          {[
            { color: heatColors[3], label: t.stats.legend100 },
            { color: heatColors[2], label: t.stats.legend50 },
            { color: heatColors[1], label: t.stats.legendLow },
            { color: heatColors[0], label: t.stats.legendNone },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1">
              <div className={cn("w-3 h-3 rounded-sm", l.color)} />
              <span className="text-[10px] text-slate-500">{l.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Day Analysis ────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="glass-card p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-3">📆 {t.stats.dayAnalysis}</h3>
        {/* Bar chart per day */}
        <div className="flex items-end gap-2 h-24 mb-2">
          {DEMO_DAY_ANALYSIS.map((d, i) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-slate-400">{d.pct}%</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${d.pct}%` }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={cn(
                  "w-full rounded-t-md",
                  i === bestDayIdx ? "bg-emerald-500" : i === worstDayIdx ? "bg-red-400" : "bg-white/15"
                )}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          {DEMO_DAY_ANALYSIS.map((d) => (
            <span key={d.day} className="flex-1 text-center text-[10px] text-slate-500">
              {t.stats[d.day as keyof typeof t.stats] || d.day}
            </span>
          ))}
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-medium">{t.stats.bestDay}:</span>
            <span className="text-white">
              {dayKeys[bestDayIdx]} ({DEMO_DAY_ANALYSIS[bestDayIdx].pct}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-medium">{t.stats.worstDay}:</span>
            <span className="text-white">
              {dayKeys[worstDayIdx]} ({DEMO_DAY_ANALYSIS[worstDayIdx].pct}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#a78bfa] font-medium">{t.stats.insight}:</span>
            <span className="text-slate-400">
              {worstDayIdx >= 5 ? t.stats.insightWeekend : t.stats.insightConsistent}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ─── Level Progress ──────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-[#a78bfa]" />
            <h3 className="text-sm font-semibold text-white">⭐ Level {userLevel}</h3>
          </div>
          <span className="text-sm text-amber-400 font-medium">🥈 Silver</span>
        </div>
        <div className="w-full h-3 rounded-full bg-white/[0.06] overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(userXp / nextLevelXp) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full gradient-primary"
          />
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">{userXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</span>
          <span className="text-slate-500">
            {t.stats.toNextRank
              .replace("{xp}", String(xpToGo))
              .replace("{rank}", "Gold")
              .replace("{days}", "5")}
          </span>
        </div>
      </motion.div>

      {/* ─── Achievements ────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-4 w-4 text-[#a78bfa]" />
          <h3 className="text-sm font-semibold text-white">{t.stats.achievements}</h3>
          <span className="text-[11px] text-slate-400 ml-auto">
            {ACHIEVEMENTS.filter((a) => a.unlocked).length}/{ACHIEVEMENTS.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ACHIEVEMENTS.map((ach) => (
            <motion.div
              key={ach.name}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "rounded-xl p-3 text-center transition-all",
                ach.unlocked
                  ? "glass-card"
                  : "bg-white/[0.02] border border-white/5 opacity-40"
              )}
            >
              <span className="text-2xl block mb-1">{ach.icon}</span>
              <span className="text-[11px] font-medium block leading-tight text-white">
                {ach.name}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {ach.desc}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

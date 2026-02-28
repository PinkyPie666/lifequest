"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ArrowLeft,
  Flame,
  Trophy,
  Calendar,
  TrendingUp,
  Check,
  Edit3,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HABIT_CATEGORIES, DIFFICULTY_LEVELS } from "@/lib/constants";

const DEMO_HABIT = {
  id: "1",
  name: "Morning Meditation",
  icon: "🧘",
  description: "Practice mindfulness meditation every morning to start the day with clarity and focus.",
  category: "mind" as const,
  difficulty: "easy" as const,
  frequency: "daily" as const,
  currentStreak: 7,
  longestStreak: 14,
  totalCompletions: 42,
  xpReward: 10,
  createdAt: "2025-01-15",
};

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEK_STATUS = [true, true, true, false, true, true, true];

export default function HabitDetailPage() {
  const params = useParams(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const category = HABIT_CATEGORIES.find((c) => c.id === DEMO_HABIT.category);
  const difficulty = DIFFICULTY_LEVELS.find((d) => d.id === DEMO_HABIT.difficulty);

  return (
    <div className="px-4 pt-12 safe-top space-y-5 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Button asChild variant="ghost" size="icon">
          <Link href="/habits">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-bold flex-1 text-white">{t.habits.habitDetails}</h1>
        <Button variant="ghost" size="icon">
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 text-center"
      >
        <div className="text-5xl mb-3">{DEMO_HABIT.icon}</div>
        <h2 className="text-xl font-bold mb-1 text-white">{DEMO_HABIT.name}</h2>
        <p className="text-sm text-slate-400 mb-3">
          {DEMO_HABIT.description}
        </p>
        <div className="flex items-center justify-center gap-3">
          <span
            className="text-xs px-2 py-1 rounded-lg font-medium"
            style={{
              backgroundColor: `${category?.color}20`,
              color: category?.color,
            }}
          >
            {category?.label}
          </span>
          <span
            className="text-xs px-2 py-1 rounded-lg font-medium"
            style={{
              backgroundColor: `${difficulty?.color}20`,
              color: difficulty?.color,
            }}
          >
            {difficulty?.label} · +{DEMO_HABIT.xpReward} XP
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="glass-card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-2">
            <Flame className="h-5 w-5 text-orange-400" />
          </div>
          <p className="text-lg font-bold text-white">{DEMO_HABIT.currentStreak}</p>
          <p className="text-[11px] text-slate-400">{t.habits.currentStreak}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-quest-purple/10 flex items-center justify-center mx-auto mb-2">
            <Trophy className="h-5 w-5 text-[#a78bfa]" />
          </div>
          <p className="text-lg font-bold text-white">{DEMO_HABIT.longestStreak}</p>
          <p className="text-[11px] text-slate-400">{t.habits.bestStreak}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-quest-blue/10 flex items-center justify-center mx-auto mb-2">
            <Calendar className="h-5 w-5 text-[#60a5fa]" />
          </div>
          <p className="text-lg font-bold text-white">{DEMO_HABIT.totalCompletions}</p>
          <p className="text-[11px] text-slate-400">{t.habits.totalDone}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4"
      >
        <h3 className="text-sm font-semibold mb-3 text-white">{t.habits.thisWeek}</h3>
        <div className="grid grid-cols-7 gap-2">
          {WEEK_DAYS.map((day, i) => (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] text-slate-400">{day}</span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${
                  WEEK_STATUS[i]
                    ? "bg-success/20 text-success"
                    : "bg-white/5 text-slate-500"
                }`}
              >
                {WEEK_STATUS[i] ? (
                  <Check className="h-4 w-4" />
                ) : (
                  "—"
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">{t.habits.monthlyProgress}</h3>
          <span className="text-xs text-[#a78bfa] font-medium">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            85%
          </span>
        </div>
        <Progress value={85} className="h-3" />
        <p className="text-[11px] text-slate-400 mt-2">
          {t.habits.daysCompleted.replace("{done}", "26").replace("{total}", "30")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4"
      >
        <h3 className="text-sm font-semibold mb-3 text-white">{t.habits.totalXpEarned}</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-2xl font-bold gradient-text">
              {DEMO_HABIT.totalCompletions * DEMO_HABIT.xpReward} XP
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t.habits.fromCompletions.replace("{count}", String(DEMO_HABIT.totalCompletions))}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
            <span className="text-2xl">{DEMO_HABIT.icon}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Check, Flame, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types";
import { HABIT_CATEGORIES, DIFFICULTY_LEVELS } from "@/lib/constants";
import Link from "next/link";

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onComplete: (habitId: string) => void;
  index?: number;
}

export function HabitCard({ habit, isCompleted, onComplete, index = 0 }: HabitCardProps) {
  const category = HABIT_CATEGORIES.find((c) => c.id === habit.category);
  const difficulty = DIFFICULTY_LEVELS.find((d) => d.id === habit.difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        "glass-card p-4 flex items-center gap-3 transition-all",
        isCompleted && "opacity-70"
      )}
    >
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => !isCompleted && onComplete(habit.id)}
        className={cn(
          "flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all",
          isCompleted
            ? "bg-success/20 text-success"
            : "bg-white/5 border border-white/10 hover:border-quest-purple/50"
        )}
      >
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <Check className="h-5 w-5" />
          </motion.div>
        ) : (
          <span>{habit.icon}</span>
        )}
      </motion.button>

      <Link href={`/habits/${habit.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              "font-medium text-sm truncate text-white",
              isCompleted && "line-through text-slate-500"
            )}
          >
            {habit.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="text-[11px] px-1.5 py-0.5 rounded-md font-medium"
            style={{
              backgroundColor: `${category?.color}20`,
              color: category?.color,
            }}
          >
            {category?.label}
          </span>
          <span
            className="text-[11px] px-1.5 py-0.5 rounded-md font-medium"
            style={{
              backgroundColor: `${difficulty?.color}20`,
              color: difficulty?.color,
            }}
          >
            +{habit.xpReward} XP
          </span>
          {habit.currentStreak > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] text-orange-400">
              <Flame className="h-3 w-3" />
              {habit.currentStreak}
            </span>
          )}
        </div>
      </Link>

      <Link href={`/habits/${habit.id}`} className="flex-shrink-0">
        <ChevronRight className="h-4 w-4 text-slate-500" />
      </Link>
    </motion.div>
  );
}

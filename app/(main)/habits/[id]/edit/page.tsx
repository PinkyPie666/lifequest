"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useHabitStore } from "@/stores/useHabitStore";
import type { HabitCategory } from "@/types";
import {
  ArrowLeft,
  Save,
  Trash2,
  Archive,
  Bell,
  BellOff,
  Clock,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const EMOJI_LIST = [
  "🌅", "🏃", "💧", "🥗", "😴", "🚿", "🧘", "📝", "🙏", "📵",
  "🚫", "🍺", "🎮", "💰", "🐷", "📊", "📚", "🎧", "💻", "🇬🇧",
  "📋", "🎯", "✅", "💪", "🧠", "❤️", "⭐", "🔥", "💎", "🌟",
  "🎨", "🎵", "🍎", "🥤", "🚶", "🧹", "📱", "✍️", "🌿", "☀️",
];

const CATEGORY_OPTIONS = [
  { id: "health", label: "Health", emoji: "🏃" },
  { id: "mental", label: "Mental", emoji: "🧠" },
  { id: "finance", label: "Finance", emoji: "💰" },
  { id: "learning", label: "Learning", emoji: "📚" },
  { id: "work", label: "Work", emoji: "💼" },
  { id: "other", label: "Other", emoji: "✨" },
];

export default function EditHabitPage() {
  const router = useRouter();
  const params = useParams();
  const habitId = params.id as string;
  const { t } = useTranslation();
  const { habits, updateHabit, removeHabit } = useHabitStore();

  const habit = habits.find((h) => h.id === habitId);

  const [emoji, setEmoji] = useState(habit?.emoji || habit?.icon || "🎯");
  const [name, setName] = useState(habit?.name || "");
  const [description, setDescription] = useState(habit?.description || "");
  const [category, setCategory] = useState<string>(habit?.category || "other");
  const [reminderTime, setReminderTime] = useState(habit?.reminderTime || "08:00");
  const [reminderEnabled, setReminderEnabled] = useState(habit?.reminderEnabled ?? true);
  const [importance, setImportance] = useState(habit?.importance ?? 5);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isNew = habitId === "new";

  useEffect(() => {
    if (!isNew && !habit) {
      router.push("/habits");
    }
  }, [isNew, habit, router]);

  const handleSave = () => {
    if (!name.trim()) return;

    if (isNew) {
      const { addHabit } = useHabitStore.getState();
      addHabit({
        id: `habit-${Date.now()}`,
        userId: "local",
        emoji,
        name: name.trim(),
        description: description.trim() || undefined,
        icon: emoji,
        category: category as HabitCategory,
        difficulty: "medium",
        frequency: "daily",
        targetDays: [0, 1, 2, 3, 4, 5, 6],
        reminderTime,
        reminderEnabled,
        importance,
        sortOrder: habits.length,
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        xpReward: Math.round(importance * 5),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      });
    } else {
      updateHabit(habitId, {
        emoji,
        name: name.trim(),
        description: description.trim() || undefined,
        icon: emoji,
        category: category as HabitCategory,
        reminderTime,
        reminderEnabled,
        importance,
        xpReward: Math.round(importance * 5),
        updatedAt: new Date().toISOString(),
      });
    }
    router.push("/habits");
  };

  const handleDelete = () => {
    removeHabit(habitId);
    router.push("/habits");
  };

  const handleArchive = () => {
    updateHabit(habitId, { isActive: false, updatedAt: new Date().toISOString() });
    router.push("/habits");
  };

  return (
    <div className="px-4 pt-12 pb-8 safe-top space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
          <ArrowLeft className="h-4 w-4 text-slate-400" />
        </button>
        <h1 className="text-lg font-bold text-white flex-1">
          {isNew ? t.onboarding.addHabit : t.onboarding.editHabit}
        </h1>
      </motion.div>

      {/* Emoji picker */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <p className="text-xs text-slate-400 mb-2">{t.onboarding.emojiPicker}</p>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center text-3xl hover:bg-white/10 transition-colors"
        >
          {emoji}
        </button>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 glass-card p-3 grid grid-cols-8 gap-2"
          >
            {EMOJI_LIST.map((e) => (
              <button
                key={e}
                onClick={() => { setEmoji(e); setShowEmojiPicker(false); }}
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center text-lg hover:bg-white/10 transition-colors",
                  emoji === e && "bg-[#a78bfa]/20 ring-1 ring-[#a78bfa]"
                )}
              >
                {e}
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Name */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <p className="text-xs text-slate-400 mb-2">{t.onboarding.habitName}</p>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.onboarding.habitName}
        />
      </motion.div>

      {/* Description */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <p className="text-xs text-slate-400 mb-2">{t.onboarding.habitDesc}</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.onboarding.habitDesc}
          rows={2}
          className="flex w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a78bfa] transition-colors resize-none"
        />
      </motion.div>

      {/* Category */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p className="text-xs text-slate-400 mb-2">{t.onboarding.category}</p>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={cn(
                "glass-card p-3 flex flex-col items-center gap-1 transition-all text-center",
                category === cat.id && "border-[#a78bfa]/50 bg-[#a78bfa]/10"
              )}
            >
              <span className="text-lg">{cat.emoji}</span>
              <span className="text-[11px] text-white font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Reminder time + toggle */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <p className="text-xs text-slate-400 mb-2">{t.onboarding.reminderTimeLabel}</p>
        <div className="glass-card p-4 flex items-center gap-3">
          <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="bg-transparent text-white text-sm font-medium focus:outline-none flex-1 [color-scheme:dark]"
          />
          <button
            onClick={() => setReminderEnabled(!reminderEnabled)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              reminderEnabled
                ? "bg-[#a78bfa]/20 text-[#a78bfa]"
                : "bg-white/5 text-slate-500"
            )}
          >
            {reminderEnabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
            {t.onboarding.enableReminder}
          </button>
        </div>
      </motion.div>

      {/* Importance slider */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-slate-400">{t.onboarding.importance}</p>
          <p className="text-xs text-[#a78bfa] font-medium">{importance}/10 → {Math.round(importance * 5)} XP</p>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={importance}
          onChange={(e) => setImportance(Number(e.target.value))}
          className="w-full accent-[#a78bfa] h-2"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="space-y-3 pt-2">
        <Button size="lg" className="w-full" onClick={handleSave} disabled={!name.trim()}>
          <Save className="h-4 w-4 mr-2" />
          {t.onboarding.save}
        </Button>

        {!isNew && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleArchive}
            >
              <Archive className="h-4 w-4 mr-2" />
              {t.onboarding.archive}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 text-red-400 border-red-400/20 hover:bg-red-400/10 hover:text-red-400"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t.onboarding.delete}
            </Button>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
        >
          <div className="glass-card p-6 max-w-sm w-full space-y-4">
            <p className="text-sm text-white font-medium text-center">{t.onboarding.deleteConfirm}</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                {t.onboarding.cancel}
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDelete}
              >
                {t.onboarding.delete}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

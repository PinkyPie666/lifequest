"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useHabitStore } from "@/stores/useHabitStore";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import type { HabitCategory } from "@/types";
import { useRouter, useParams } from "next/navigation";

const EMOJI_LIST = [
  "🌅", "🏃", "💧", "🥗", "😴", "🚿", "🧘", "📝", "🙏", "📵",
  "🚫", "🍺", "🎮", "💰", "🐷", "📊", "📚", "🎧", "💻", "🇬🇧",
  "📋", "🎯", "✅", "💪", "🧠", "❤️", "⭐", "🔥", "💎", "🌟",
  "🎨", "🎵", "🍎", "🥤", "🚶", "🧹", "📱", "✍️", "🌿", "☀️",
];

const CATEGORY_OPTIONS = [
  { id: "health", label: "HEALTH", emoji: "❤️" },
  { id: "mental", label: "MIND", emoji: "🧠" },
  { id: "finance", label: "MONEY", emoji: "💰" },
  { id: "learning", label: "LEARN", emoji: "📚" },
  { id: "work", label: "WORK", emoji: "💼" },
  { id: "other", label: "OTHER", emoji: "✨" },
];

export default function EditHabitPage() {
  const router = useRouter();
  const params = useParams();
  const habitId = params.id as string;
  const { play } = useSoundEffect();
  const { habits, updateHabit, removeHabit } = useHabitStore();

  const habit = habits.find((h) => h.id === habitId);
  const isNew = habitId === "new";

  const [emoji, setEmoji] = useState(habit?.emoji || habit?.icon || "🎯");
  const [name, setName] = useState(habit?.name || "");
  const [description, setDescription] = useState(habit?.description || "");
  const [category, setCategory] = useState<string>(habit?.category || "other");
  const [reminderTime, setReminderTime] = useState(habit?.reminderTime || "08:00");
  const [importance, setImportance] = useState(habit?.importance ?? 5);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isNew && !habit) {
      router.push("/habits");
    }
  }, [isNew, habit, router]);

  const handleSave = () => {
    if (!name.trim()) return;
    play("success");

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
        reminderEnabled: true,
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
        importance,
        xpReward: Math.round(importance * 5),
        updatedAt: new Date().toISOString(),
      });
    }
    router.push("/habits");
  };

  const handleDelete = () => {
    play("error");
    removeHabit(habitId);
    router.push("/habits");
  };

  return (
    <div className="px-4 pt-6 pb-8 safe-top space-y-4">
      <div className="fixed inset-0 scanline pointer-events-none z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={() => { play("click"); router.back(); }}
          className="pixel-btn bg-[#1e1e3a] hover:bg-[#2a2a5a] text-[#94a3b8] font-pixel text-[9px] px-3 py-1"
        >
          ← BACK
        </button>
        <h1 className="font-pixel text-[12px] text-[#fbbf24] retro-text-shadow flex-1">
          {isNew ? "⚔️ NEW QUEST" : "✏️ EDIT QUEST"}
        </h1>
      </motion.div>

      {/* Emoji picker */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <p className="font-pixel text-[8px] text-[#94a3b8] mb-2">ICON</p>
        <button
          onClick={() => { play("click"); setShowEmojiPicker(!showEmojiPicker); }}
          className="w-14 h-14 pixel-card flex items-center justify-center text-3xl hover:bg-[#1a1a3a] transition-colors"
        >
          {emoji}
        </button>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 pixel-card p-3 grid grid-cols-8 gap-2"
          >
            {EMOJI_LIST.map((e) => (
              <button
                key={e}
                onClick={() => { play("coin"); setEmoji(e); setShowEmojiPicker(false); }}
                className={cn(
                  "w-9 h-9 flex items-center justify-center text-lg border-2 transition-all",
                  emoji === e
                    ? "border-[#fbbf24] bg-[#fbbf24]/10"
                    : "border-[#2a2a5a] hover:border-[#8b5cf6]"
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
        <p className="font-pixel text-[8px] text-[#94a3b8] mb-2">QUEST NAME</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="เช่น ออกกำลังกาย, อ่านหนังสือ..."
          className="w-full bg-[#0c0c1d] border-2 border-[#2a2a5a] px-4 py-3 text-lg text-white placeholder-[#475569] focus:border-[#8b5cf6] focus:outline-none transition-colors font-retro"
          autoFocus={isNew}
        />
      </motion.div>

      {/* Description */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <p className="font-pixel text-[8px] text-[#94a3b8] mb-2">DESCRIPTION (OPTIONAL)</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="รายละเอียดเพิ่มเติม..."
          rows={2}
          className="w-full bg-[#0c0c1d] border-2 border-[#2a2a5a] px-4 py-2 text-sm text-white placeholder-[#475569] focus:border-[#8b5cf6] focus:outline-none transition-colors font-retro resize-none"
        />
      </motion.div>

      {/* Category */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p className="font-pixel text-[8px] text-[#94a3b8] mb-2">CATEGORY</p>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { play("click"); setCategory(cat.id); }}
              className={cn(
                "pixel-card p-2 flex flex-col items-center gap-1 transition-all text-center",
                category === cat.id
                  ? "border-[#8b5cf6] bg-[#8b5cf6]/10 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                  : "hover:bg-white/5"
              )}
            >
              <span className="text-lg">{cat.emoji}</span>
              <span className="font-pixel text-[7px] text-white">{cat.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Reminder time */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <p className="font-pixel text-[8px] text-[#94a3b8] mb-2">⏰ REMINDER TIME</p>
        <div className="pixel-card p-3 flex items-center gap-3">
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="bg-transparent text-white text-lg font-retro focus:outline-none flex-1 [color-scheme:dark]"
          />
        </div>
      </motion.div>

      {/* Importance / XP */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-2">
          <p className="font-pixel text-[8px] text-[#94a3b8]">⚡ DIFFICULTY</p>
          <p className="font-pixel text-[8px] text-[#fbbf24]">{importance}/10 → +{Math.round(importance * 5)} XP</p>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={importance}
          onChange={(e) => setImportance(Number(e.target.value))}
          className="w-full accent-[#8b5cf6] h-2"
        />
        <div className="flex justify-between font-pixel text-[6px] text-[#475569] mt-1">
          <span>EASY</span>
          <span>MEDIUM</span>
          <span>LEGENDARY</span>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="space-y-3 pt-2">
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full pixel-btn bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-pixel text-sm py-3 tracking-wider transition-colors"
        >
          💾 {isNew ? "CREATE QUEST" : "SAVE CHANGES"}
        </button>

        {!isNew && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                play("click");
                updateHabit(habitId, { isActive: false, updatedAt: new Date().toISOString() });
                router.push("/habits");
              }}
              className="flex-1 pixel-btn bg-[#1e1e3a] hover:bg-[#2a2a5a] text-[#94a3b8] font-pixel text-[9px] py-2"
            >
              📦 ARCHIVE
            </button>
            <button
              onClick={() => { play("click"); setShowDeleteConfirm(true); }}
              className="flex-1 pixel-btn bg-[#ef4444]/20 hover:bg-[#ef4444]/30 text-[#ef4444] font-pixel text-[9px] py-2"
            >
              🗑 DELETE
            </button>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div className="pixel-card p-5 max-w-xs w-full text-center space-y-3" onClick={(e) => e.stopPropagation()}>
            <p className="text-3xl">⚠️</p>
            <p className="font-pixel text-[10px] text-[#ef4444]">DELETE THIS QUEST?</p>
            <p className="text-sm text-[#94a3b8]">ลบภารกิจนี้ถาวร ไม่สามารถกู้คืนได้!</p>
            <div className="flex gap-3">
              <button
                onClick={() => { play("click"); setShowDeleteConfirm(false); }}
                className="flex-1 pixel-btn bg-[#1e1e3a] text-[#94a3b8] font-pixel text-[9px] py-2"
              >
                CANCEL
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 pixel-btn bg-[#ef4444] text-white font-pixel text-[9px] py-2"
              >
                DELETE
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getCurrentUser, fetchHabitById, createHabit, updateHabit, deleteHabit, fetchHabits } from "@/lib/supabase/api";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { useRouter, useParams } from "next/navigation";

const EMOJI_LIST = [
  "🌅", "🏃", "💧", "🥗", "😴", "🚿", "🧘", "📝", "🙏", "📵",
  "🚫", "🍺", "🎮", "💰", "🐷", "📊", "📚", "🎧", "💻", "🇬🇧",
  "📋", "🎯", "✅", "💪", "🧠", "❤️", "⭐", "🔥", "💎", "🌟",
  "🎨", "🎵", "🍎", "🥤", "🚶", "🧹", "📱", "✍️", "🌿", "☀️",
];

const CATEGORY_OPTIONS = [
  { id: "health", label: "สุขภาพ", emoji: "❤️" },
  { id: "mental", label: "จิตใจ", emoji: "🧠" },
  { id: "finance", label: "การเงิน", emoji: "💰" },
  { id: "learning", label: "เรียนรู้", emoji: "📚" },
  { id: "work", label: "งาน", emoji: "💼" },
  { id: "other", label: "อื่นๆ", emoji: "✨" },
];

export default function EditHabitPage() {
  const router = useRouter();
  const params = useParams();
  const habitId = params.id as string;
  const { play } = useSoundEffect();
  const isNew = habitId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [emoji, setEmoji] = useState("🎯");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [reminderTime, setReminderTime] = useState("08:00");
  const [importance, setImportance] = useState(5);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadData = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) { router.push("/login"); return; }
    setUserId(user.id);

    if (!isNew) {
      const { data } = await fetchHabitById(habitId);
      if (!data) { router.push("/habits"); return; }
      setEmoji(data.emoji || "🎯");
      setName(data.name);
      setDescription(data.description || "");
      setCategory(data.category || "other");
      setReminderTime(data.reminder_time || "08:00");
      setImportance(data.importance ?? 5);
    }
    setLoading(false);
  }, [habitId, isNew, router]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async () => {
    if (!name.trim() || !userId) return;
    setSaving(true);
    play("success");

    if (isNew) {
      const { data: allHabits } = await fetchHabits(userId);
      const { error } = await createHabit({
        user_id: userId,
        emoji,
        name: name.trim(),
        description: description.trim() || null,
        category,
        reminder_time: reminderTime,
        reminder_enabled: true,
        importance,
        sort_order: allHabits.length,
      });
      if (error) { console.error("Create habit error:", error); setSaving(false); return; }
    } else {
      const { error } = await updateHabit(habitId, {
        emoji,
        name: name.trim(),
        description: description.trim() || null,
        category,
        reminder_time: reminderTime,
        importance,
      });
      if (error) { console.error("Update habit error:", error); setSaving(false); return; }
    }
    router.push("/habits");
  };

  const handleArchive = async () => {
    play("click");
    await updateHabit(habitId, { is_active: false });
    router.push("/habits");
  };

  const handleDelete = async () => {
    play("error");
    await deleteHabit(habitId);
    router.push("/habits");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-body text-sm text-slate-400">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-24 safe-top space-y-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={() => { play("click"); router.back(); }}
          className="game-btn bg-slate-700 hover:bg-slate-600 text-slate-300 font-heading text-xs px-3 py-1.5 rounded-lg"
        >
          ← กลับ
        </button>
        <h1 className="font-heading text-lg text-amber-400 flex-1">
          {isNew ? "⚔️ สร้างภารกิจใหม่" : "✏️ แก้ไขภารกิจ"}
        </h1>
      </motion.div>

      {/* Emoji picker */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <p className="font-heading text-xs text-slate-400 mb-2">ไอคอน</p>
        <button
          onClick={() => { play("click"); setShowEmojiPicker(!showEmojiPicker); }}
          className="w-14 h-14 game-card flex items-center justify-center text-3xl hover:bg-white/5 transition-colors rounded-xl"
        >
          {emoji}
        </button>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 game-card p-3 grid grid-cols-8 gap-2 rounded-xl"
          >
            {EMOJI_LIST.map((e) => (
              <button
                key={e}
                onClick={() => { play("coin"); setEmoji(e); setShowEmojiPicker(false); }}
                className={cn(
                  "w-9 h-9 flex items-center justify-center text-lg rounded-lg border-2 transition-all",
                  emoji === e
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-transparent hover:border-purple-500/50"
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
        <p className="font-heading text-xs text-slate-400 mb-2">ชื่อภารกิจ</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="เช่น ออกกำลังกาย, อ่านหนังสือ..."
          className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-lg text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors font-body"
          autoFocus={isNew}
        />
      </motion.div>

      {/* Description */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <p className="font-heading text-xs text-slate-400 mb-2">รายละเอียด (ไม่จำเป็น)</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="รายละเอียดเพิ่มเติม..."
          rows={2}
          className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors font-body resize-none"
        />
      </motion.div>

      {/* Category */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p className="font-heading text-xs text-slate-400 mb-2">หมวดหมู่</p>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { play("click"); setCategory(cat.id); }}
              className={cn(
                "game-card p-2 flex flex-col items-center gap-1 transition-all text-center rounded-xl",
                category === cat.id
                  ? "border-purple-500 bg-purple-500/10 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                  : "hover:bg-white/5"
              )}
            >
              <span className="text-lg">{cat.emoji}</span>
              <span className="font-heading text-[10px] text-white">{cat.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Reminder time */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <p className="font-heading text-xs text-slate-400 mb-2">⏰ เวลาแจ้งเตือน</p>
        <div className="game-card p-3 flex items-center gap-3 rounded-xl">
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="bg-transparent text-white text-lg font-body focus:outline-none flex-1 [color-scheme:dark]"
          />
        </div>
      </motion.div>

      {/* Importance / XP */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-2">
          <p className="font-heading text-xs text-slate-400">⚡ ระดับความยาก</p>
          <p className="font-heading text-xs text-amber-400">{importance}/10 → +{Math.round(importance * 5)} XP</p>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={importance}
          onChange={(e) => setImportance(Number(e.target.value))}
          className="w-full accent-purple-500 h-2"
        />
        <div className="flex justify-between font-body text-[10px] text-slate-500 mt-1">
          <span>ง่าย</span>
          <span>ปานกลาง</span>
          <span>ตำนาน</span>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="space-y-3 pt-2">
        <button
          onClick={handleSave}
          disabled={!name.trim() || saving}
          className="w-full game-btn bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-heading text-sm py-3 rounded-xl tracking-wider transition-all shadow-lg"
        >
          {saving ? "กำลังบันทึก..." : (isNew ? "💾 สร้างภารกิจ" : "💾 บันทึกการเปลี่ยนแปลง")}
        </button>

        {!isNew && (
          <div className="flex gap-3">
            <button
              onClick={handleArchive}
              className="flex-1 game-btn bg-slate-700 hover:bg-slate-600 text-slate-300 font-heading text-xs py-2.5 rounded-xl"
            >
              📦 เก็บถาวร
            </button>
            <button
              onClick={() => { play("click"); setShowDeleteConfirm(true); }}
              className="flex-1 game-btn bg-red-500/20 hover:bg-red-500/30 text-red-400 font-heading text-xs py-2.5 rounded-xl"
            >
              🗑 ลบ
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
          <div className="game-card p-5 max-w-xs w-full text-center space-y-3 rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-3xl">⚠️</p>
            <p className="font-heading text-sm text-red-400">ลบภารกิจนี้?</p>
            <p className="text-sm text-slate-400 font-body">ลบภารกิจนี้ถาวร ไม่สามารถกู้คืนได้!</p>
            <div className="flex gap-3">
              <button
                onClick={() => { play("click"); setShowDeleteConfirm(false); }}
                className="flex-1 game-btn bg-slate-700 text-slate-300 font-heading text-xs py-2.5 rounded-xl"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 game-btn bg-red-500 text-white font-heading text-xs py-2.5 rounded-xl"
              >
                ลบเลย
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

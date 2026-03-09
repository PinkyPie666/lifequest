"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getCurrentUser, createPlaylist, addPlaylistItem, updatePlaylist } from "@/lib/supabase/api";
import { HABIT_TEMPLATES } from "@/lib/templates";

const GRADIENT_OPTIONS = [
  "from-purple-500 to-indigo-600",
  "from-orange-500 to-red-600",
  "from-emerald-500 to-teal-600",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-600",
  "from-cyan-400 to-blue-600",
  "from-fuchsia-400 to-pink-600",
  "from-violet-400 to-purple-600",
  "from-green-400 to-emerald-600",
  "from-sky-400 to-blue-600",
  "from-red-500 to-rose-700",
  "from-yellow-400 to-amber-600",
];

const EMOJI_LIST = [
  "🎮", "⚔️", "🔥", "💪", "🧘", "📚", "💰", "🌅", "🏃", "🎯",
  "✨", "🌟", "💎", "🏆", "🎨", "🧠", "❤️", "🚀", "🌿", "☀️",
];

interface PlaylistHabit {
  emoji: string;
  name: string;
  description: string;
  category: string;
  importance: number;
  reminder_time: string;
}

type Step = "info" | "browse" | "review";

export default function CreatePlaylistPage() {
  const router = useRouter();
  const { play } = useSoundEffect();

  const [step, setStep] = useState<Step>("info");
  const [emoji, setEmoji] = useState("🎮");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gradient, setGradient] = useState(GRADIENT_OPTIONS[0]);
  const [habits, setHabits] = useState<PlaylistHabit[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // All habits from all templates as a browse pool
  const allHabitsPool = HABIT_TEMPLATES.flatMap((t) =>
    t.habits.map((h) => ({ ...h, templateName: t.name, templateEmoji: t.emoji }))
  );

  const filteredPool = searchQuery
    ? allHabitsPool.filter(
        (h) =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allHabitsPool;

  const addHabit = useCallback(
    (habit: PlaylistHabit) => {
      play("success");
      setHabits((prev) => [...prev, habit]);
    },
    [play]
  );

  const removeHabit = useCallback(
    (index: number) => {
      play("click");
      setHabits((prev) => prev.filter((_, i) => i !== index));
    },
    [play]
  );

  const isAdded = (habitName: string) => habits.some((h) => h.name === habitName);

  const handlePublish = useCallback(
    async (publish: boolean) => {
      if (!name.trim() || habits.length === 0) return;
      setSaving(true);
      play("success");

      const user = await getCurrentUser();
      if (!user) { router.replace("/login"); return; }

      const { data: playlist } = await createPlaylist({
        user_id: user.id,
        emoji,
        name: name.trim(),
        description: description.trim() || undefined,
        gradient,
        is_published: publish,
      });

      if (playlist) {
        for (let i = 0; i < habits.length; i++) {
          const h = habits[i];
          await addPlaylistItem({
            playlist_id: playlist.id,
            emoji: h.emoji,
            name: h.name,
            description: h.description,
            category: h.category,
            importance: h.importance,
            reminder_time: h.reminder_time,
            sort_order: i,
          });
        }
        if (publish) {
          await updatePlaylist(playlist.id, { is_published: true });
        }
      }

      setSaving(false);
      router.push("/habits");
    },
    [name, description, emoji, gradient, habits, play, router]
  );

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--theme-bg)" }}>
      {/* Header */}
      <div className={cn("bg-gradient-to-br p-5 pb-4", gradient)}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => {
              play("click");
              if (step === "info") router.back();
              else if (step === "browse") setStep("info");
              else setStep("browse");
            }}
            className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 text-sm"
          >
            ←
          </button>
          <h1 className="font-heading text-base text-white drop-shadow flex-1">
            {step === "info" ? "สร้าง Playlist" : step === "browse" ? "เพิ่มภารกิจ" : "ตรวจสอบ"}
          </h1>
          {habits.length > 0 && (
            <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-game">
              {habits.length} ภารกิจ
            </span>
          )}
        </div>

        {/* Playlist preview */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { play("click"); setShowEmojiPicker(!showEmojiPicker); }}
            className="w-16 h-16 rounded-xl bg-black/20 backdrop-blur-sm flex items-center justify-center text-4xl border-2 border-white/20 active:scale-95 transition-transform"
          >
            {emoji}
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-heading text-lg text-white drop-shadow truncate">
              {name || "ชื่อ Playlist..."}
            </p>
            <p className="text-xs text-white/70 truncate">
              {description || "คำอธิบาย..."}
            </p>
          </div>
        </div>
      </div>

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 border-b"
            style={{ borderColor: "var(--theme-border)", background: "var(--theme-bg-card)" }}
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {EMOJI_LIST.map((e) => (
                <button
                  key={e}
                  onClick={() => { play("click"); setEmoji(e); setShowEmojiPicker(false); }}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-xl border-2 transition-all",
                    emoji === e ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]/10" : "border-transparent hover:bg-white/5"
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 pt-4 space-y-4">
        {/* ═══════ STEP 1: INFO ═══════ */}
        {step === "info" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div>
              <label className="font-game text-xs mb-2 block" style={{ color: "var(--theme-text-dim)" }}>ชื่อ Playlist</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น แผนพิชิตเป้าหมาย 2024"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none border transition-colors"
                style={{
                  background: "var(--theme-bg-card)",
                  borderColor: "var(--theme-border)",
                  color: "var(--theme-text)",
                }}
                autoFocus
              />
            </div>

            <div>
              <label className="font-game text-xs mb-2 block" style={{ color: "var(--theme-text-dim)" }}>คำอธิบาย (ไม่จำเป็น)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="อธิบาย playlist ของคุณ..."
                rows={2}
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none border transition-colors resize-none"
                style={{
                  background: "var(--theme-bg-card)",
                  borderColor: "var(--theme-border)",
                  color: "var(--theme-text)",
                }}
              />
            </div>

            <div>
              <label className="font-game text-xs mb-2 block" style={{ color: "var(--theme-text-dim)" }}>สีปก</label>
              <div className="flex flex-wrap gap-2">
                {GRADIENT_OPTIONS.map((g) => (
                  <button
                    key={g}
                    onClick={() => { play("click"); setGradient(g); }}
                    className={cn(
                      "w-10 h-10 rounded-lg bg-gradient-to-br transition-all border-2",
                      g,
                      gradient === g ? "border-white scale-110 shadow-lg" : "border-transparent"
                    )}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => { play("click"); setStep("browse"); }}
              disabled={!name.trim()}
              className={cn(
                "w-full py-3.5 rounded-xl font-heading text-base transition-all",
                name.trim()
                  ? "bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] text-white active:scale-[0.98]"
                  : "opacity-40 cursor-not-allowed bg-gray-500 text-gray-300"
              )}
            >
              ต่อไป — เลือกภารกิจ ➜
            </button>
          </motion.div>
        )}

        {/* ═══════ STEP 2: BROWSE & ADD ═══════ */}
        {step === "browse" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {/* Search */}
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 ค้นหาภารกิจ..."
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none border transition-colors"
                style={{
                  background: "var(--theme-bg-card)",
                  borderColor: "var(--theme-border)",
                  color: "var(--theme-text)",
                }}
              />
            </div>

            {/* Added count */}
            {habits.length > 0 && (
              <div className="flex items-center gap-2 py-1">
                <span className="font-game text-xs" style={{ color: "var(--theme-primary)" }}>
                  ✅ เพิ่มแล้ว {habits.length} ภารกิจ
                </span>
                <button
                  onClick={() => { play("click"); setStep("review"); }}
                  className="ml-auto font-game text-xs px-3 py-1 rounded-lg"
                  style={{ background: "var(--theme-primary)", color: "#fff" }}
                >
                  ดู Playlist →
                </button>
              </div>
            )}

            {/* Browse pool */}
            <div className="space-y-1.5">
              {filteredPool.map((habit, idx) => {
                const added = isAdded(habit.name);
                return (
                  <motion.div
                    key={`${habit.name}-${idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all",
                      added ? "opacity-50" : ""
                    )}
                    style={{
                      background: "var(--theme-bg-card)",
                      borderColor: added ? "var(--theme-primary)" : "var(--theme-border)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 border"
                      style={{ background: "var(--theme-bg-dark)", borderColor: "var(--theme-border)" }}
                    >
                      {habit.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-game truncate" style={{ color: "var(--theme-text)" }}>{habit.name}</p>
                      <p className="text-[11px] truncate" style={{ color: "var(--theme-text-muted)" }}>{habit.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (added) return;
                        addHabit({
                          emoji: habit.emoji,
                          name: habit.name,
                          description: habit.description,
                          category: habit.category,
                          importance: habit.importance,
                          reminder_time: habit.reminder_time,
                        });
                      }}
                      disabled={added}
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 transition-all active:scale-90",
                        added ? "bg-[var(--theme-primary)]/20 text-[var(--theme-primary)]" : "border-2"
                      )}
                      style={added ? {} : { borderColor: "var(--theme-border)", color: "var(--theme-text-dim)" }}
                    >
                      {added ? "✓" : "+"}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Next button */}
            {habits.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => { play("click"); setStep("review"); }}
                className="w-full py-3.5 rounded-xl font-heading text-base text-white transition-all active:scale-[0.98] sticky bottom-20 z-20 shadow-xl"
                style={{ background: `linear-gradient(to right, var(--theme-primary), var(--theme-secondary))` }}
              >
                ดู Playlist ({habits.length} ภารกิจ) ➜
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ═══════ STEP 3: REVIEW ═══════ */}
        {step === "review" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <p className="font-heading text-sm" style={{ color: "var(--theme-xp)" }}>
              ⚔️ ภารกิจใน Playlist ({habits.length})
            </p>

            {habits.map((habit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ background: "var(--theme-bg-card)", borderColor: "var(--theme-border)" }}
              >
                <span className="font-game text-xs w-5 text-center" style={{ color: "var(--theme-text-muted)" }}>
                  {idx + 1}
                </span>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 border"
                  style={{ background: "var(--theme-bg-dark)", borderColor: "var(--theme-border)" }}
                >
                  {habit.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-game" style={{ color: "var(--theme-text)" }}>{habit.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-game text-xs" style={{ color: "var(--theme-primary)" }}>+{habit.importance * 10 + 5} XP</span>
                    <span className="font-game text-xs" style={{ color: "var(--theme-text-muted)" }}>⏰ {habit.reminder_time}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeHabit(idx)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all active:scale-90"
                  style={{ color: "var(--theme-danger)" }}
                >
                  ✕
                </button>
              </motion.div>
            ))}

            <button
              onClick={() => { play("click"); setStep("browse"); }}
              className="w-full py-2.5 rounded-xl font-game text-sm border-2 border-dashed transition-all"
              style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-dim)" }}
            >
              + เพิ่มภารกิจอีก
            </button>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handlePublish(true)}
                disabled={saving || habits.length === 0}
                className={cn(
                  "w-full py-3.5 rounded-xl font-heading text-base text-white transition-all active:scale-[0.98]",
                  saving ? "opacity-50 cursor-wait" : ""
                )}
                style={{ background: `linear-gradient(to right, var(--theme-primary), var(--theme-secondary))` }}
              >
                {saving ? "⏳ กำลังบันทึก..." : "🚀 เผยแพร่ Playlist"}
              </button>
              <button
                onClick={() => handlePublish(false)}
                disabled={saving}
                className="w-full py-3 rounded-xl font-game text-sm border transition-all"
                style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-dim)" }}
              >
                💾 บันทึกแบบส่วนตัว
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

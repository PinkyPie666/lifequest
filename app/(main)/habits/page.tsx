"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, fetchHabits, deleteHabit, createHabit, toggleTemplateLike, fetchUserLikes } from "@/lib/supabase/api";
import type { HabitRow } from "@/types/database";
import { HABIT_TEMPLATES, TEMPLATE_CATEGORIES, type HabitTemplate, type TemplateCategory } from "@/lib/templates";

const MY_QUEST_CATEGORIES = [
  { id: "all", label: "ทั้งหมด", emoji: "📋" },
  { id: "health", label: "สุขภาพ", emoji: "❤️" },
  { id: "mental", label: "จิตใจ", emoji: "🧠" },
  { id: "finance", label: "การเงิน", emoji: "💰" },
  { id: "learning", label: "เรียนรู้", emoji: "📚" },
  { id: "work", label: "งาน", emoji: "💼" },
];

export default function HabitsPage() {
  const router = useRouter();
  const { play } = useSoundEffect();
  const [habits, setHabits] = useState<HabitRow[]>([]);
  const [activeTab, setActiveTab] = useState<"templates" | "my">("templates");
  const [activeFilter, setActiveFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState<TemplateCategory | "all">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<HabitTemplate | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) { router.replace("/login"); return; }
      setUserId(user.id);
      const [habitsRes, likesRes] = await Promise.all([
        fetchHabits(user.id),
        fetchUserLikes(user.id),
      ]);
      setHabits(habitsRes.data);
      const liked = new Set<string>();
      likesRes.data.forEach((l) => { if (l.template_id) liked.add(l.template_id); });
      setLikedIds(liked);
      // Init like counts from template popularity
      const counts: Record<string, number> = {};
      HABIT_TEMPLATES.forEach((t) => { counts[t.id] = t.popularity; });
      setLikeCounts(counts);
      setLoading(false);
    }
    load();
  }, [router]);

  const filteredHabits = habits.filter((h) => activeFilter === "all" || h.category === activeFilter);

  const popularTemplates = useMemo(() =>
    HABIT_TEMPLATES.filter((t) => t.isPopular).sort((a, b) => b.popularity - a.popularity),
    []
  );

  const filteredTemplates = useMemo(() =>
    templateFilter === "all"
      ? HABIT_TEMPLATES.sort((a, b) => b.popularity - a.popularity)
      : HABIT_TEMPLATES.filter((t) => t.category === templateFilter).sort((a, b) => b.popularity - a.popularity),
    [templateFilter]
  );

  const handleDelete = useCallback(async () => {
    if (deleteId) {
      play("error");
      await deleteHabit(deleteId);
      setHabits((prev) => prev.filter((h) => h.id !== deleteId));
      setDeleteId(null);
    }
  }, [deleteId, play]);

  const handleLike = useCallback(async (templateId: string) => {
    if (!userId) return;
    play("click");
    const wasLiked = likedIds.has(templateId);
    // Optimistic update
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (wasLiked) next.delete(templateId); else next.add(templateId);
      return next;
    });
    setLikeCounts((prev) => ({
      ...prev,
      [templateId]: (prev[templateId] || 0) + (wasLiked ? -1 : 1),
    }));
    await toggleTemplateLike(userId, templateId);
  }, [userId, likedIds, play]);

  const handleUseTemplate = useCallback(async (template: HabitTemplate) => {
    if (!userId || applying) return;
    setApplying(true);
    play("success");
    for (const h of template.habits) {
      await createHabit({
        user_id: userId,
        emoji: h.emoji,
        name: h.name,
        description: h.description,
        category: h.category,
        importance: h.importance,
        reminder_time: h.reminder_time,
        is_active: true,
        sort_order: 0,
      });
    }
    const { data } = await fetchHabits(userId);
    setHabits(data);
    setAppliedId(template.id);
    setApplying(false);
    setSelectedTemplate(null);
    setTimeout(() => setAppliedId(null), 3000);
  }, [userId, applying, play]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-float">📋</div>
          <p className="font-game text-sm" style={{ color: "var(--theme-text-dim)" }}>กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-5 pb-28 safe-top space-y-4">

      {/* ─── Tab Header ─────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-1 p-1 rounded-xl border" style={{ background: "color-mix(in srgb, var(--theme-bg-card) 80%, transparent)", borderColor: "color-mix(in srgb, var(--theme-border) 50%, transparent)" }}>
          <button
            onClick={() => { play("click"); setActiveTab("templates"); }}
            className={cn(
              "flex-1 py-2.5 rounded-lg font-heading text-sm transition-all text-center",
              activeTab === "templates" ? "text-white shadow-lg" : ""
            )}
            style={activeTab === "templates"
              ? { background: `linear-gradient(to right, var(--theme-primary), var(--theme-secondary))` }
              : { color: "var(--theme-text-dim)" }
            }
          >
            🎮 เทมเพลต
          </button>
          <button
            onClick={() => { play("click"); setActiveTab("my"); }}
            className={cn(
              "flex-1 py-2.5 rounded-lg font-heading text-sm transition-all text-center",
              activeTab === "my" ? "text-white shadow-lg" : ""
            )}
            style={activeTab === "my"
              ? { background: `linear-gradient(to right, var(--theme-primary), var(--theme-secondary))` }
              : { color: "var(--theme-text-dim)" }
            }
          >
            📋 ภารกิจของฉัน {habits.length > 0 && <span className="text-xs opacity-70">({habits.length})</span>}
          </button>
        </div>
      </motion.div>

      {/* Applied toast */}
      <AnimatePresence>
        {appliedId && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 left-4 right-4 z-50 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl p-3 text-center shadow-xl"
          >
            <p className="font-heading text-sm">✅ เพิ่มเทมเพลตเรียบร้อย!</p>
            <p className="text-xs opacity-80 mt-0.5">ดูได้ที่แท็บ &quot;ภารกิจของฉัน&quot;</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ TEMPLATES TAB ═══════════════ */}
      {activeTab === "templates" && (
        <motion.div
          key="templates"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          {/* ─── Popular Section ─────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏆</span>
              <h2 className="font-heading text-base text-[#fbbf24]">ยอดฮิต</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#fbbf24]/30 to-transparent" />
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
              {popularTemplates.map((tmpl, i) => (
                <motion.button
                  key={tmpl.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => { play("click"); setSelectedTemplate(tmpl); }}
                  className="flex-shrink-0 w-[260px] rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
                >
                  <div className={cn("bg-gradient-to-br p-4 pb-3 relative", tmpl.gradient)}>
                    <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <span className="font-game text-[10px] text-white/90">🔥 {(tmpl.popularity / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="text-4xl mb-2 drop-shadow-lg">{tmpl.emoji}</div>
                    <h3 className="font-heading text-sm text-white drop-shadow">{tmpl.name}</h3>
                  </div>
                  <div className="bg-[#13132b] p-3">
                    <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">{tmpl.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-game text-[10px] text-[#8b5cf6] bg-[#8b5cf6]/10 px-2 py-0.5 rounded-md">
                        {tmpl.habits.length} ภารกิจ
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleLike(tmpl.id); }}
                        className="ml-auto flex items-center gap-1 font-game text-[10px] transition-all active:scale-90"
                      >
                        <span className={likedIds.has(tmpl.id) ? "text-red-400" : "text-[#475569]"}>
                          {likedIds.has(tmpl.id) ? "❤️" : "🤍"}
                        </span>
                        <span className={likedIds.has(tmpl.id) ? "text-red-400" : "text-[#475569]"}>
                          {likeCounts[tmpl.id] ? (likeCounts[tmpl.id] > 1000 ? `${(likeCounts[tmpl.id] / 1000).toFixed(1)}k` : likeCounts[tmpl.id]) : 0}
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* ─── Category Filter ─────────────── */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { play("click"); setTemplateFilter(cat.id as TemplateCategory | "all"); }}
                className={cn(
                  "px-3 py-2 rounded-xl font-game text-xs whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5 border",
                  templateFilter === cat.id
                    ? "border-[#8b5cf6]/50 bg-[#8b5cf6]/15 text-[#c4b5fd]"
                    : "border-[#2a2a5a]/50 text-[#475569] hover:text-[#94a3b8] hover:border-[#475569]/50"
                )}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* ─── Template Grid ─────────────── */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">📦</span>
            <h2 className="font-heading text-sm text-white">
              {templateFilter === "all" ? "เทมเพลตทั้งหมด" : TEMPLATE_CATEGORIES.find((c) => c.id === templateFilter)?.label}
            </h2>
            <span className="font-game text-xs text-[#475569]">({filteredTemplates.length})</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredTemplates.map((tmpl, i) => (
              <motion.button
                key={tmpl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => { play("click"); setSelectedTemplate(tmpl); }}
                className="rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
              >
                <div className={cn("bg-gradient-to-br p-3 relative", tmpl.gradient)}>
                  <div className="text-3xl mb-1 drop-shadow-lg">{tmpl.emoji}</div>
                  <h3 className="font-heading text-xs text-white drop-shadow leading-tight">{tmpl.name}</h3>
                </div>
                <div className="bg-[#13132b] p-2.5">
                  <p className="text-[11px] text-[#94a3b8] line-clamp-2 leading-relaxed">{tmpl.description}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="font-game text-[9px] text-[#8b5cf6] bg-[#8b5cf6]/10 px-1.5 py-0.5 rounded">
                      {tmpl.habits.length} ภารกิจ
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLike(tmpl.id); }}
                      className="ml-auto flex items-center gap-0.5 font-game text-[9px] transition-all active:scale-90"
                    >
                      <span>{likedIds.has(tmpl.id) ? "❤️" : "🤍"}</span>
                      <span className={likedIds.has(tmpl.id) ? "text-red-400" : "text-[#475569]"}>
                        {likeCounts[tmpl.id] ? (likeCounts[tmpl.id] > 1000 ? `${(likeCounts[tmpl.id] / 1000).toFixed(1)}k` : likeCounts[tmpl.id]) : 0}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* ─── Create Custom CTA ─────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="game-card p-5 text-center border-dashed border-[#8b5cf6]/30"
          >
            <p className="text-3xl mb-2">✨</p>
            <p className="font-heading text-sm text-white mb-1">สร้างภารกิจเอง</p>
            <p className="text-xs text-[#94a3b8] mb-3">ไม่เจอที่ชอบ? ออกแบบภารกิจของคุณเอง!</p>
            <Link href="/habits/new/edit" onClick={() => play("click")}>
              <span className="game-btn game-btn-primary px-5 py-2 text-xs font-game inline-block">
                + สร้างภารกิจใหม่
              </span>
            </Link>
          </motion.div>
        </motion.div>
      )}

      {/* ═══════════════ MY QUESTS TAB ═══════════════ */}
      {activeTab === "my" && (
        <motion.div
          key="my"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {MY_QUEST_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { play("click"); setActiveFilter(cat.id); }}
                className="px-3 py-2 rounded-xl font-game text-xs whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5 border"
                style={activeFilter === cat.id
                  ? { borderColor: "color-mix(in srgb, var(--theme-xp) 50%, transparent)", background: "color-mix(in srgb, var(--theme-xp) 10%, transparent)", color: "var(--theme-xp)" }
                  : { borderColor: "color-mix(in srgb, var(--theme-border) 50%, transparent)", color: "var(--theme-text-muted)" }
                }
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Habit List */}
          <div className="space-y-2">
            {filteredHabits.length > 0 ? (
              filteredHabits.map((habit, i) => {
                const xp = habit.importance ? habit.importance * 10 + 5 : 15;
                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="game-card p-3.5 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl border flex items-center justify-center text-xl flex-shrink-0" style={{ background: "var(--theme-bg-dark)", borderColor: "var(--theme-border)" }}>
                      {habit.emoji || "📌"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-game truncate" style={{ color: "var(--theme-text)" }}>{habit.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-game text-xs" style={{ color: "var(--theme-primary)" }}>+{xp} XP</span>
                        {habit.reminder_time && (
                          <span className="font-game text-xs" style={{ color: "var(--theme-text-muted)" }}>⏰ {habit.reminder_time}</span>
                        )}
                        {habit.current_streak > 0 && (
                          <span className="font-game text-xs text-orange-400">🔥{habit.current_streak}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1.5 flex-shrink-0">
                      <Link
                        href={`/habits/${habit.id}/edit`}
                        onClick={() => play("click")}
                        className="w-9 h-9 rounded-lg flex items-center justify-center border text-sm transition-colors"
                        style={{ borderColor: "var(--theme-border)", background: "var(--theme-bg-dark)" }}
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => { play("click"); setDeleteId(habit.id); }}
                        className="w-9 h-9 rounded-lg flex items-center justify-center border text-sm transition-colors"
                        style={{ borderColor: "var(--theme-border)", background: "var(--theme-bg-dark)" }}
                      >
                        🗑️
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="game-card p-10 text-center">
                <p className="text-5xl mb-3 animate-float">🗡️</p>
                <p className="font-game text-sm mb-2" style={{ color: "var(--theme-text-dim)" }}>ยังไม่มีภารกิจ</p>
                <p className="text-sm mb-4" style={{ color: "var(--theme-text-muted)" }}>เลือกจากเทมเพลต หรือสร้างเอง!</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <button
                    onClick={() => { play("click"); setActiveTab("templates"); }}
                    className="game-btn game-btn-primary px-5 py-2.5 text-sm font-game"
                  >
                    🎮 ดูเทมเพลต
                  </button>
                  <Link href="/habits/new/edit">
                    <button
                      onClick={() => play("click")}
                      className="game-btn game-btn-secondary px-5 py-2.5 text-sm font-game"
                    >
                      + สร้างเอง
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          {habits.length > 0 && (
            <div className="game-card p-3 flex items-center justify-between">
              <span className="font-game text-xs" style={{ color: "var(--theme-text-dim)" }}>ภารกิจทั้งหมด</span>
              <span className="font-game text-sm" style={{ color: "var(--theme-xp)" }}>{habits.length}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* ═══════════════ TEMPLATE DETAIL MODAL ═══════════════ */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/80"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-[#0c0c1d] rounded-t-3xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient Header */}
              <div className={cn("bg-gradient-to-br p-6 relative", selectedTemplate.gradient)}>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white"
                >
                  ✕
                </button>
                <div className="text-5xl mb-3 drop-shadow-lg">{selectedTemplate.emoji}</div>
                <h2 className="font-heading text-xl text-white drop-shadow mb-1">{selectedTemplate.name}</h2>
                <p className="text-sm text-white/80">{selectedTemplate.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  {selectedTemplate.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                  <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                    🔥 {(selectedTemplate.popularity / 1000).toFixed(1)}k ผู้ใช้
                  </span>
                </div>
              </div>

              {/* Habit List */}
              <div className="p-4 overflow-y-auto max-h-[40vh]">
                <p className="font-heading text-sm text-[#fbbf24] mb-3">
                  ⚔️ ภารกิจในเทมเพลต ({selectedTemplate.habits.length})
                </p>
                <div className="space-y-2">
                  {selectedTemplate.habits.map((habit, idx) => (
                    <div key={idx} className="game-card p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1a1a3a] border border-[#2a2a5a] flex items-center justify-center text-xl flex-shrink-0">
                        {habit.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-game">{habit.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-game text-xs text-[#8b5cf6]">+{habit.importance * 10 + 5} XP</span>
                          <span className="font-game text-xs text-[#475569]">⏰ {habit.reminder_time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="p-4 border-t border-[#2a2a5a] space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLike(selectedTemplate.id)}
                    className={cn(
                      "px-4 py-3.5 rounded-xl font-heading text-base transition-all active:scale-[0.95] border",
                      likedIds.has(selectedTemplate.id)
                        ? "border-red-400/50 bg-red-400/10 text-red-400"
                        : "border-[#2a2a5a] text-[#94a3b8]"
                    )}
                  >
                    {likedIds.has(selectedTemplate.id) ? "❤️" : "🤍"}
                  </button>
                  <button
                    onClick={() => handleUseTemplate(selectedTemplate)}
                    disabled={applying}
                    className={cn(
                      "flex-1 py-3.5 rounded-xl font-heading text-base transition-all",
                      applying
                        ? "bg-[#475569] text-[#94a3b8] cursor-wait"
                        : "bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]"
                    )}
                  >
                    {applying ? "⏳ กำลังเพิ่ม..." : `✨ ใช้เทมเพลตนี้`}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4" onClick={() => setDeleteId(null)}>
          <div className="game-card p-6 w-full max-w-xs text-center space-y-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-3xl">🗑️</p>
            <p className="font-heading text-base text-[#ef4444]">ลบภารกิจ?</p>
            <p className="text-sm text-[#94a3b8]">ลบภารกิจนี้ถาวร ไม่สามารถกู้คืนได้</p>
            <div className="flex gap-3">
              <button onClick={() => { play("click"); setDeleteId(null); }} className="flex-1 game-btn game-btn-secondary py-2.5 font-game text-sm">ยกเลิก</button>
              <button onClick={handleDelete} className="flex-1 game-btn game-btn-danger py-2.5 font-game text-sm">ลบเลย</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

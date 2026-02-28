"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Settings,
  Pencil,
  X,
  Camera,
  Calendar,
  Trophy,
  Star,
} from "lucide-react";
import { RANK_TIERS } from "@/lib/constants";

// ─── Demo data ────────────────────────────────────────────
const USER_PROFILE = {
  fullName: "Quest Hero",
  username: "@questhero",
  email: "hero@lifequest.app",
  bio: "",
  level: 12,
  xp: 2450,
  totalXp: 2450,
  streak: 7,
  longestStreak: 21,
  habitsCompleted: 127,
  daysActive: 55,
  joinedAt: "January 2025",
  completionRate: 82,
};

const ACHIEVEMENTS = [
  { icon: "🎯", name: "First Step", desc: "First check-in", unlocked: true, progress: null },
  { icon: "🔥", name: "7 Days", desc: "7-day streak", unlocked: true, progress: null },
  { icon: "💪", name: "14 Days", desc: "14-day streak", unlocked: true, progress: null },
  { icon: "🏆", name: "30 Days", desc: "30-day streak", unlocked: false, progress: "16/30" },
  { icon: "⭐", name: "50 Done", desc: "50 completions", unlocked: true, progress: null },
  { icon: "💯", name: "Century", desc: "100 completions", unlocked: true, progress: null },
  { icon: "✨", name: "Perfect", desc: "Perfect week", unlocked: false, progress: "5/7" },
  { icon: "👑", name: "Master", desc: "66-day streak", unlocked: false, progress: "21/66" },
  { icon: "🌟", name: "Legend", desc: "Level 50", unlocked: false, progress: "12/50" },
  { icon: "💎", name: "Diamond", desc: "100-day streak", unlocked: false, progress: "21/100" },
];

const JOURNEY = [
  { date: "15 ม.ค.", event: "เริ่มการผจญภัย", emoji: "🚀" },
  { date: "22 ม.ค.", event: "Streak 7 วัน!", emoji: "🔥" },
  { date: "29 ม.ค.", event: "ขึ้น Level 10!", emoji: "⭐" },
  { date: "5 ก.พ.", event: "Silver Rank!", emoji: "🥈" },
];

function getCurrentRank(level: number) {
  let current: (typeof RANK_TIERS)[number] = RANK_TIERS[0];
  for (const tier of RANK_TIERS) {
    if (level >= tier.minLevel) current = tier;
  }
  return current;
}

function getNextRank(level: number) {
  for (const tier of RANK_TIERS) {
    if (level < tier.minLevel) return tier;
  }
  return null;
}

// ─── Edit Profile Modal ───────────────────────────────────
function EditProfileModal({
  open,
  onClose,
  t,
}: {
  open: boolean;
  onClose: () => void;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  const [displayName, setDisplayName] = useState(USER_PROFILE.fullName);
  const [username, setUsername] = useState(USER_PROFILE.username);
  const [bio, setBio] = useState(USER_PROFILE.bio);

  const handleSave = () => {
    // TODO: save to Supabase
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-full max-w-md glass-card p-6 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{t.profile.editModalTitle}</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Avatar */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">QH</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
                  <Camera className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
            </div>
            <p className="text-center text-[11px] text-slate-500 mb-5">{t.profile.avatarChange}</p>

            {/* Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t.profile.displayName}</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#8b5cf6] transition"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t.profile.username}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#8b5cf6] transition"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">{t.profile.bio}</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 100))}
                  placeholder={t.profile.bioPlaceholder}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-[#8b5cf6] transition resize-none"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block text-right">{bio.length}/100</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-5">
              <Button
                variant="outline"
                className="flex-1 border-white/10 text-slate-400"
                onClick={onClose}
              >
                {t.profile.cancel}
              </Button>
              <Button className="flex-1 gradient-primary text-white" onClick={handleSave}>
                {t.profile.save}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function ProfilePage() {
  const { t } = useTranslation();
  const [editOpen, setEditOpen] = useState(false);
  const rank = getCurrentRank(USER_PROFILE.level);
  const nextRank = getNextRank(USER_PROFILE.level);

  const xpForNextLevel = 3000;
  const xpToGo = nextRank ? (nextRank.minLevel * 500 - USER_PROFILE.totalXp) : 0;
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;

  return (
    <div className="px-4 pt-12 safe-top space-y-5 pb-28">
      {/* ─── Header ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-white">{t.profile.title}</h1>
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </motion.div>

      {/* ─── Avatar + Info ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 text-center"
      >
        <div className="relative inline-block">
          <Avatar className="h-24 w-24 mx-auto mb-3">
            <AvatarFallback className="text-3xl">QH</AvatarFallback>
          </Avatar>
          <button
            onClick={() => setEditOpen(true)}
            className="absolute bottom-2 right-0 w-7 h-7 rounded-full gradient-primary flex items-center justify-center shadow-lg"
          >
            <Camera className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
        <h2 className="text-xl font-bold text-white">{USER_PROFILE.fullName}</h2>
        <p className="text-xs text-slate-500">{USER_PROFILE.username}</p>
        {USER_PROFILE.bio ? (
          <p className="text-xs text-slate-400 mt-1">{USER_PROFILE.bio}</p>
        ) : (
          <p className="text-xs text-slate-600 mt-1 italic">{t.profile.noBio}</p>
        )}
        <Button
          variant="outline"
          size="sm"
          className="mt-3 border-white/10 text-xs text-slate-300 hover:text-white"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="h-3 w-3 mr-1.5" />
          {t.profile.editProfile}
        </Button>
      </motion.div>

      {/* ─── Level & Rank Card ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-[#a78bfa]" />
            <h3 className="text-sm font-semibold text-white">⭐ Level {USER_PROFILE.level}</h3>
          </div>
          <span
            className="text-sm font-medium px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${rank.color}20`, color: rank.color }}
          >
            {rank.name}
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-white/[0.06] overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(USER_PROFILE.xp / xpForNextLevel) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full gradient-primary"
          />
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">
            {USER_PROFILE.xp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
          </span>
          {nextRank && (
            <span className="text-slate-500">
              🎯 {t.profile.goalRank
                .replace("{rank}", nextRank.name)
                .replace("{xp}", String(xpToGo > 0 ? xpToGo.toLocaleString() : 0))}
            </span>
          )}
        </div>
      </motion.div>

      {/* ─── Stats Summary (horizontal scroll) ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4"
      >
        {[
          { emoji: "📅", value: USER_PROFILE.daysActive, label: t.profile.daysActive },
          { emoji: "✅", value: USER_PROFILE.habitsCompleted, label: t.profile.habitsCompleted },
          { emoji: "🔥", value: USER_PROFILE.longestStreak, label: t.profile.bestStreak },
          { emoji: "🏆", value: unlockedCount, label: t.profile.achievementCount },
        ].map((s) => (
          <div
            key={s.label}
            className="glass-card p-3 flex flex-col items-center gap-1 min-w-[80px] flex-shrink-0"
          >
            <span className="text-lg">{s.emoji}</span>
            <span className="text-lg font-bold text-white">{s.value}</span>
            <span className="text-[10px] text-slate-400 text-center whitespace-nowrap">{s.label}</span>
          </div>
        ))}
      </motion.div>

      {/* ─── Achievements ──────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-[#a78bfa]" />
            <h3 className="text-sm font-semibold text-white">🏅 {t.profile.achievementsTitle}</h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {t.profile.achievementsOf
              .replace("{done}", String(unlockedCount))
              .replace("{total}", String(ACHIEVEMENTS.length))}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {ACHIEVEMENTS.map((ach) => (
            <motion.div
              key={ach.name}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "rounded-xl p-2.5 text-center transition-all relative",
                ach.unlocked
                  ? "glass-card"
                  : "bg-white/[0.02] border border-white/5 opacity-50"
              )}
            >
              <span className="text-xl block mb-0.5">{ach.unlocked ? ach.icon : "🔒"}</span>
              <span className="text-[10px] font-medium block leading-tight text-white">
                {ach.name}
              </span>
              {ach.unlocked ? (
                <span className="text-[9px] text-emerald-400 block mt-0.5">✓</span>
              ) : (
                <span className="text-[9px] text-slate-500 block mt-0.5">{ach.progress}</span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Journey Timeline ──────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-[#a78bfa]" />
          <h3 className="text-sm font-semibold text-white">🗓️ {t.profile.journeyTitle}</h3>
        </div>
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-[9px] top-1 bottom-1 w-px bg-white/10" />
          <div className="space-y-4">
            {JOURNEY.map((item, i) => (
              <div key={i} className="relative flex items-start gap-3">
                {/* Dot */}
                <div className="absolute -left-6 top-0.5 w-[18px] h-[18px] rounded-full bg-[#1a1a2e] border-2 border-[#8b5cf6] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full gradient-primary" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">{item.date}</span>
                  <p className="text-xs text-white mt-0.5">
                    {item.emoji} {item.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Edit Profile Modal ────────────── */}
      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} t={t} />
    </div>
  );
}

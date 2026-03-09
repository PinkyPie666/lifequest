"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/stores/useUserStore";
import { useHabitStore } from "@/stores/useHabitStore";
import { useThemeStore, THEMES, type ThemeName } from "@/stores/useThemeStore";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { cn } from "@/lib/utils";
import Link from "next/link";

const RANK_TIERS = [
  { name: "Bronze", minLevel: 1, emoji: "🥉" },
  { name: "Silver", minLevel: 5, emoji: "🥈" },
  { name: "Gold", minLevel: 10, emoji: "🥇" },
  { name: "Platinum", minLevel: 20, emoji: "💎" },
  { name: "Diamond", minLevel: 35, emoji: "👑" },
  { name: "Mythic", minLevel: 50, emoji: "⚡" },
];

function getRank(level: number) {
  let rank = RANK_TIERS[0];
  for (const tier of RANK_TIERS) {
    if (level >= tier.minLevel) rank = tier;
  }
  return rank;
}

const AVATARS = ["⚔️", "🧙", "🏹", "💚", "🐉", "🦊", "🐺", "🦁", "🎮", "👾", "🤖", "💀"];

export default function ProfilePage() {
  const { user, updateProfile, reset } = useUserStore();
  const { habits } = useHabitStore();
  const { theme, setTheme } = useThemeStore();
  const { play } = useSoundEffect();
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || "");
  const [editBio, setEditBio] = useState(user?.bio || "");
  const [showReset, setShowReset] = useState(false);

  if (!user) return null;

  const rank = getRank(user.level);
  const xpForNext = user.level * user.level * 100;
  const xpPct = Math.min(100, Math.round((user.totalXp / xpForNext) * 100));
  const daysActive = Math.max(1, Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / 86400000));

  const handleSave = () => {
    play("success");
    updateProfile({ displayName: editName.trim() || user.displayName, bio: editBio });
    setEditOpen(false);
  };

  const handleAvatarChange = (emoji: string) => {
    play("coin");
    updateProfile({ avatarEmoji: emoji });
  };

  return (
    <div className="px-4 pt-6 pb-28 safe-top space-y-4">
      <div className="fixed inset-0 scanline pointer-events-none z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="font-pixel text-[13px] text-[#fbbf24] retro-text-shadow">👤 HERO PROFILE</h1>
        <Link
          href="/settings"
          onClick={() => play("navigate")}
          className="font-pixel text-[8px] text-[#8b5cf6] hover:text-[#a78bfa] pixel-btn bg-[#1e1e3a] px-3 py-1"
        >
          ⚙ SETTINGS
        </Link>
      </motion.div>

      {/* Character Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="pixel-card p-5 text-center"
      >
        <div className="text-5xl mb-3 animate-float-pixel">{user.avatarEmoji}</div>
        <h2 className="font-pixel text-lg text-white retro-text-shadow">{user.displayName}</h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="font-pixel text-[9px] text-[#fbbf24]">Lv.{user.level}</span>
          <span className="font-pixel text-[9px] text-[#8b5cf6]">{user.classType.toUpperCase()}</span>
          <span className="font-pixel text-[9px]" style={{ color: "#f59e0b" }}>{rank.emoji} {rank.name}</span>
        </div>
        {user.bio && <p className="text-sm text-[#94a3b8] mt-2">{user.bio}</p>}

        <button
          onClick={() => { play("click"); setEditOpen(true); setEditName(user.displayName); setEditBio(user.bio); }}
          className="pixel-btn bg-[#1e1e3a] hover:bg-[#2a2a5a] text-[#94a3b8] font-pixel text-[8px] py-2 px-4 mt-3"
        >
          ✏ EDIT PROFILE
        </button>
      </motion.div>

      {/* XP Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="pixel-card p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-pixel text-[8px] text-[#fbbf24]">LEVEL PROGRESS</span>
          <span className="font-pixel text-[8px] text-[#94a3b8]">Lv.{user.level} → Lv.{user.level + 1}</span>
        </div>
        <div className="h-5 bg-[#1a1a3a] border-2 border-[#2a2a5a]">
          <motion.div
            className="xp-bar h-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <p className="font-pixel text-[7px] text-[#94a3b8] mt-1 text-right">
          {user.totalXp} / {xpForNext} XP ({xpPct}%)
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-2"
      >
        {[
          { emoji: "📅", value: daysActive, label: "DAYS ACTIVE" },
          { emoji: "✅", value: user.totalCompletions, label: "COMPLETED" },
          { emoji: "🔥", value: user.longestStreak, label: "BEST STREAK" },
          { emoji: "🪙", value: user.coins, label: "COINS" },
          { emoji: "⭐", value: user.perfectDays, label: "PERFECT DAYS" },
          { emoji: "📋", value: habits.filter(h => h.isActive).length, label: "ACTIVE QUESTS" },
        ].map((s) => (
          <div key={s.label} className="pixel-card p-3 text-center">
            <span className="text-xl">{s.emoji}</span>
            <p className="font-pixel text-sm text-white mt-1">{s.value}</p>
            <p className="font-pixel text-[6px] text-[#94a3b8]">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Theme Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="pixel-card p-4"
      >
        <p className="font-pixel text-[9px] text-[#fbbf24] mb-3">🎨 THEME</p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(THEMES) as ThemeName[]).map((t) => (
            <button
              key={t}
              onClick={() => { play("toggle"); setTheme(t); }}
              className={cn(
                "pixel-card p-3 text-center transition-all",
                theme === t
                  ? "border-[#fbbf24] bg-[#fbbf24]/10 shadow-[0_0_10px_rgba(251,191,36,0.2)]"
                  : "hover:bg-white/5"
              )}
            >
              <div
                className="w-6 h-6 mx-auto mb-1 border-2"
                style={{
                  backgroundColor: THEMES[t].colors.bg,
                  borderColor: THEMES[t].colors.primary,
                }}
              />
              <p className="font-pixel text-[6px] text-white">{THEMES[t].label}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pixel-card p-4"
      >
        <p className="font-pixel text-[9px] text-[#ef4444] mb-3">⚠ DANGER ZONE</p>
        <button
          onClick={() => { play("error"); setShowReset(true); }}
          className="w-full pixel-btn bg-[#ef4444]/20 hover:bg-[#ef4444]/30 text-[#ef4444] font-pixel text-[9px] py-2"
        >
          🗑 RESET ALL DATA
        </button>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
            onClick={() => setEditOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="pixel-card p-5 w-full max-w-sm space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-pixel text-[12px] text-[#fbbf24] text-center">EDIT PROFILE</h2>

              {/* Avatar picker */}
              <div>
                <p className="font-pixel text-[8px] text-[#94a3b8] mb-2">AVATAR</p>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      onClick={() => handleAvatarChange(a)}
                      className={cn(
                        "text-2xl p-1 border-2 transition-all",
                        user.avatarEmoji === a
                          ? "border-[#fbbf24] bg-[#fbbf24]/10"
                          : "border-[#2a2a5a] hover:border-[#8b5cf6]"
                      )}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-pixel text-[8px] text-[#94a3b8] mb-1">NAME</p>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={20}
                  className="w-full bg-[#0c0c1d] border-2 border-[#2a2a5a] px-3 py-2 text-white font-retro focus:border-[#8b5cf6] focus:outline-none"
                />
              </div>

              <div>
                <p className="font-pixel text-[8px] text-[#94a3b8] mb-1">BIO</p>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value.slice(0, 100))}
                  placeholder="บอกเกี่ยวกับตัวคุณ..."
                  rows={2}
                  className="w-full bg-[#0c0c1d] border-2 border-[#2a2a5a] px-3 py-2 text-white font-retro focus:border-[#8b5cf6] focus:outline-none resize-none"
                />
                <p className="font-pixel text-[6px] text-[#475569] text-right">{editBio.length}/100</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { play("click"); setEditOpen(false); }}
                  className="flex-1 pixel-btn bg-[#1e1e3a] hover:bg-[#2a2a5a] text-[#94a3b8] font-pixel text-[9px] py-2"
                >
                  CANCEL
                </button>
                <button onClick={handleSave} className="flex-1 pixel-btn bg-[#22c55e] hover:bg-[#16a34a] text-white font-pixel text-[9px] py-2">
                  SAVE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirm Modal */}
      <AnimatePresence>
        {showReset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
            onClick={() => setShowReset(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="pixel-card p-5 w-full max-w-xs text-center space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-4xl">⚠️</p>
              <p className="font-pixel text-[10px] text-[#ef4444]">DELETE ALL DATA?</p>
              <p className="text-sm text-[#94a3b8]">ข้อมูลทั้งหมดจะหายไปถาวร ไม่สามารถกู้คืนได้!</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { play("click"); setShowReset(false); }}
                  className="flex-1 pixel-btn bg-[#1e1e3a] hover:bg-[#2a2a5a] text-[#94a3b8] font-pixel text-[9px] py-2"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => { play("error"); reset(); window.location.href = "/"; }}
                  className="flex-1 pixel-btn bg-[#ef4444] hover:bg-[#dc2626] text-white font-pixel text-[9px] py-2"
                >
                  DELETE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

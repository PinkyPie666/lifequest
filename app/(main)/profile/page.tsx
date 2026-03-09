"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, getProfile, updateProfile as updateProfileApi, fetchHabits, signOut } from "@/lib/supabase/api";
import type { HabitRow, Profile } from "@/types/database";

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

export default function ProfilePage() {
  const router = useRouter();
  const { play } = useSoundEffect();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [habits, setHabits] = useState<HabitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) { router.replace("/login"); return; }
      const [pRes, hRes] = await Promise.all([getProfile(user.id), fetchHabits(user.id)]);
      if (pRes.data) { setProfile(pRes.data); setEditName(pRes.data.username || pRes.data.full_name || ""); }
      setHabits(hRes.data);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-float">👤</div>
          <p className="font-game text-sm text-[#94a3b8]">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const rank = getRank(profile.level);
  const xpForNext = profile.level * profile.level * 100;
  const xpPct = Math.min(100, Math.round((profile.total_xp / xpForNext) * 100));
  const daysActive = Math.max(1, Math.floor((Date.now() - new Date(profile.created_at).getTime()) / 86400000));

  const handleSave = async () => {
    play("success");
    const { data } = await updateProfileApi(profile.id, { username: editName.trim() || profile.username });
    if (data) setProfile(data);
    setEditOpen(false);
  };

  const handleLogout = async () => {
    play("click");
    await signOut();
    router.replace("/");
  };

  return (
    <div className="px-4 pt-6 pb-28 safe-top space-y-4">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="font-heading text-lg text-white">👤 โปรไฟล์</h1>
        <Link
          href="/settings"
          onClick={() => play("navigate")}
          className="game-btn game-btn-secondary px-3 py-1.5 text-xs font-game"
        >
          ⚙ ตั้งค่า
        </Link>
      </motion.div>

      {/* Character Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="game-card p-5 text-center"
      >
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#8b5cf6]/30 to-[#6366f1]/30 flex items-center justify-center text-4xl border border-[#8b5cf6]/30 mb-3">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-xl object-cover" />
          ) : "⚔️"}
        </div>
        <h2 className="font-heading text-xl text-white">{profile.username || profile.full_name || "นักผจญภัย"}</h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="font-game text-sm text-[#fbbf24]">Lv.{profile.level}</span>
          <span className="font-game text-sm" style={{ color: "#f59e0b" }}>{rank.emoji} {rank.name}</span>
        </div>

        <button
          onClick={() => { play("click"); setEditOpen(true); }}
          className="game-btn game-btn-secondary px-4 py-2 text-xs font-game mt-3"
        >
          ✏ แก้ไขโปรไฟล์
        </button>
      </motion.div>

      {/* XP Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="game-card p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-game text-sm text-[#fbbf24]">Level Progress</span>
          <span className="font-game text-sm text-[#94a3b8]">Lv.{profile.level} → Lv.{profile.level + 1}</span>
        </div>
        <div className="bar-track h-5">
          <motion.div
            className="xp-bar h-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <p className="font-game text-xs text-[#94a3b8] mt-1 text-right">
          {profile.total_xp} / {xpForNext} XP ({xpPct}%)
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
          { emoji: "📅", value: daysActive, label: "วันที่ใช้งาน" },
          { emoji: "🔥", value: profile.longest_streak, label: "Best Streak" },
          { emoji: "⚡", value: profile.total_xp.toLocaleString(), label: "Total XP" },
          { emoji: "📋", value: habits.length, label: "ภารกิจทั้งหมด" },
        ].map((s) => (
          <div key={s.label} className="game-card p-3.5 text-center">
            <span className="text-2xl">{s.emoji}</span>
            <p className="font-heading text-lg text-white mt-1">{s.value}</p>
            <p className="font-game text-xs text-[#94a3b8]">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="game-card p-4"
      >
        <button
          onClick={() => setShowLogout(true)}
          className="w-full game-btn game-btn-danger py-2.5 font-game text-sm"
        >
          ออกจากระบบ
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
              className="game-card p-5 w-full max-w-sm space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-heading text-base text-[#fbbf24] text-center">แก้ไขโปรไฟล์</h2>

              <div>
                <p className="font-game text-xs text-[#94a3b8] mb-1.5">ชื่อผู้เล่น</p>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={20}
                  className="w-full bg-[#0c0c1d] border border-[#2a2a5a] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#8b5cf6] focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]/50 transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { play("click"); setEditOpen(false); }}
                  className="flex-1 game-btn game-btn-secondary py-2.5 font-game text-sm"
                >
                  ยกเลิก
                </button>
                <button onClick={handleSave} className="flex-1 game-btn game-btn-success py-2.5 font-game text-sm">
                  บันทึก
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirm Modal */}
      <AnimatePresence>
        {showLogout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
            onClick={() => setShowLogout(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="game-card p-6 w-full max-w-xs text-center space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-4xl">👋</p>
              <p className="font-heading text-base text-white">ออกจากระบบ?</p>
              <p className="text-sm text-[#94a3b8]">ข้อมูลของคุณจะถูกบันทึกไว้อย่างปลอดภัย</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { play("click"); setShowLogout(false); }}
                  className="flex-1 game-btn game-btn-secondary py-2.5 font-game text-sm"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 game-btn game-btn-danger py-2.5 font-game text-sm"
                >
                  ออกจากระบบ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

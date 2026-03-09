"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getCurrentUser, getProfile, fetchHabits, fetchTodayLogs } from "@/lib/supabase/api";
import type { HabitRow, HabitLog, Profile } from "@/types/database";

// NPC Mascot: Kitsune (キツネ) - magical fox spirit
// Chosen because: foxes symbolize wisdom, adaptability, and guidance in Japanese mythology.
// A Kitsune is the perfect companion to guide users on their habit-building journey.
const KITSUNE_NAME = "Kitsune";

function generateNpcMessage(profile: Profile | null, habits: HabitRow[], todayLogs: HabitLog[]): string {
  const completedToday = todayLogs.filter((l) => l.is_completed).length;
  const totalHabits = habits.length;
  const streak = profile?.current_streak || 0;
  const level = profile?.level || 1;
  const hour = new Date().getHours();

  if (totalHabits === 0) {
    return "ยินดีต้อนรับนักผจญภัย! ฉันคือ Kitsune จิ้งจอกวิเศษผู้จะเป็นเพื่อนร่วมทางของเธอ ✨ มาเริ่มสร้างภารกิจแรกกันเถอะ!";
  }

  if (completedToday === 0) {
    if (hour < 10) return `อรุณสวัสดิ์! 🌅 วันใหม่เริ่มต้นแล้ว มีภารกิจ ${totalHabits} อย่างรอเธออยู่นะ เริ่มจากอันแรกก่อนเลย!`;
    if (hour < 15) return `สวัสดีตอนบ่าย! ☀️ ยังไม่ได้เริ่มภารกิจวันนี้เลยนะ ลองเริ่มจากอันที่ง่ายที่สุดก่อนสิ ทำทีละนิดก็ได้!`;
    return `เย็นแล้วนะ 🌙 ยังมีเวลาทำภารกิจอยู่! แม้ทำได้แค่ 1 อย่างก็ดีกว่าไม่ทำเลย สู้ๆ!`;
  }

  if (completedToday >= totalHabits) {
    if (streak >= 7) return `เหลือเชื่อ! 🏆 ทำครบทุกภารกิจแล้ว แถม Streak ${streak} วันต่อเนื่อง! เธอเก่งมากๆ เลย ฉันภูมิใจในตัวเธอ!`;
    return `ยอดเยี่ยมมาก! 🎉 ทำครบทุกภารกิจวันนี้แล้ว! เธอเป็นนักผจญภัยตัวจริง! พักผ่อนให้สบายนะ แล้วพรุ่งนี้มาลุยต่อ!`;
  }

  const pct = Math.round((completedToday / totalHabits) * 100);
  if (pct >= 70) return `เก่งมาก! 💪 ทำไปแล้ว ${completedToday}/${totalHabits} ภารกิจ เหลืออีกนิดเดียว! ฉันเชื่อว่าเธอทำได้แน่ๆ!`;
  if (pct >= 40) return `ดีมากเลย! 🌟 ผ่านไปแล้วครึ่งทาง (${completedToday}/${totalHabits}) ค่อยๆ ทำไปเรื่อยๆ ไม่ต้องรีบนะ!`;
  return `เริ่มต้นดีแล้ว! 🔥 ทำไป ${completedToday}/${totalHabits} แล้ว แต่ละก้าวเล็กๆ คือชัยชนะ ทำต่อไปเรื่อยๆ นะ!`;
}

// Typing animation component
function TypingTextBox({ text, name }: { text: string; name: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="game-card p-4 relative">
      {/* NPC avatar area */}
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#f59e0b]/20 to-[#ef4444]/20 border border-[#f59e0b]/30 flex items-center justify-center text-3xl flex-shrink-0">
          🦊
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading text-sm text-[#fbbf24]">{name}</span>
            <span className="text-xs text-[#475569]">• ผู้นำทาง</span>
          </div>
          <div className="bg-[#0c0c1d]/50 rounded-lg p-3 border border-[#2a2a5a]/50 min-h-[3rem]">
            <p className="text-sm text-[#e2e8f0] leading-relaxed">
              {displayedText}
              {isTyping && <span className="inline-block w-0.5 h-4 bg-[#fbbf24] ml-0.5 animate-blink align-middle" />}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [habits, setHabits] = useState<HabitRow[]>([]);
  const [todayLogs, setTodayLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const user = await getCurrentUser();
      if (!user) { router.replace("/login"); return; }
      const [pRes, hRes, lRes] = await Promise.all([
        getProfile(user.id),
        fetchHabits(user.id),
        fetchTodayLogs(user.id),
      ]);
      if (pRes.data) setProfile(pRes.data);
      setHabits(hRes.data);
      setTodayLogs(lRes.data);
      setLoading(false);
    }
    loadData();
  }, [router]);

  const npcMessage = useMemo(
    () => generateNpcMessage(profile, habits, todayLogs),
    [profile, habits, todayLogs]
  );

  const completedToday = todayLogs.filter((l) => l.is_completed).length;
  const xpForNext = profile ? (profile.level * profile.level * 100) : 100;
  const xpPct = profile ? Math.min(100, Math.round((profile.total_xp / xpForNext) * 100)) : 0;
  const daysActive = profile ? Math.max(1, Math.floor((Date.now() - new Date(profile.created_at).getTime()) / 86400000)) : 1;

  // Behavior analysis
  const analysis = useMemo(() => {
    if (!profile || habits.length === 0) return [];
    const items: { icon: string; title: string; detail: string; color: string }[] = [];

    // Streak analysis
    if (profile.current_streak >= 7) {
      items.push({ icon: "🔥", title: "Streak แข็งแกร่ง!", detail: `${profile.current_streak} วันต่อเนื่อง — ความสม่ำเสมอคือกุญแจสู่ความสำเร็จ`, color: "text-orange-400" });
    } else if (profile.current_streak >= 3) {
      items.push({ icon: "📈", title: "กำลังไปได้ดี", detail: `Streak ${profile.current_streak} วัน — ตั้งเป้า 7 วันต่อเนื่องกันเถอะ!`, color: "text-[#fbbf24]" });
    } else {
      items.push({ icon: "💡", title: "เริ่มสร้าง Streak", detail: "ลองทำภารกิจทุกวันติดต่อกัน 3 วัน เพื่อสร้างนิสัยใหม่", color: "text-[#94a3b8]" });
    }

    // Quest completion rate
    const totalQ = habits.length;
    if (totalQ > 0) {
      const pct = Math.round((completedToday / totalQ) * 100);
      if (pct === 100) {
        items.push({ icon: "🏆", title: "Perfect Day!", detail: "ทำครบทุกภารกิจวันนี้แล้ว สุดยอด!", color: "text-[#22c55e]" });
      } else if (pct >= 50) {
        items.push({ icon: "⚡", title: `วันนี้ทำไปแล้ว ${pct}%`, detail: `${completedToday}/${totalQ} ภารกิจ — เหลืออีก ${totalQ - completedToday} อย่าง`, color: "text-[#3b82f6]" });
      } else {
        items.push({ icon: "🎯", title: `วันนี้ ${completedToday}/${totalQ}`, detail: "เริ่มจากอันที่ง่ายที่สุดก่อน ทำทีละอย่าง", color: "text-[#8b5cf6]" });
      }
    }

    // Level insight
    if (profile.level >= 5) {
      items.push({ icon: "⭐", title: `Level ${profile.level} — นักผจญภัยผู้ชำนาญ`, detail: `สะสม ${profile.total_xp.toLocaleString()} XP แล้ว อีก ${xpForNext - profile.total_xp} XP จะถึง Level ถัดไป`, color: "text-[#fbbf24]" });
    } else {
      items.push({ icon: "🌱", title: `Level ${profile.level} — เริ่มต้นการผจญภัย`, detail: `ทุกภารกิจที่ทำจะได้ XP ยิ่งทำมาก ยิ่งเลเวลอัพเร็ว!`, color: "text-[#22c55e]" });
    }

    return items;
  }, [profile, habits, todayLogs, completedToday, xpForNext]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-float">🦊</div>
          <p className="font-game text-sm text-[#94a3b8]">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="px-4 pt-6 pb-28 safe-top space-y-4">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-lg text-white">📊 สถิตินักผจญภัย</h1>
      </motion.div>

      {/* NPC Mascot Dialog */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TypingTextBox text={npcMessage} name={KITSUNE_NAME} />
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-2"
      >
        {[
          { emoji: "✅", value: profile.total_xp > 0 ? Math.floor(profile.total_xp / 15) : 0, label: "ทำสำเร็จ" },
          { emoji: "🔥", value: profile.longest_streak, label: "Best Streak" },
          { emoji: "⚡", value: profile.total_xp.toLocaleString(), label: "Total XP" },
          { emoji: "📅", value: daysActive, label: "วันที่ใช้งาน" },
        ].map((s) => (
          <div key={s.label} className="game-card p-3.5 text-center">
            <span className="text-2xl">{s.emoji}</span>
            <p className="font-heading text-lg text-white mt-1">{s.value}</p>
            <p className="font-game text-xs text-[#94a3b8]">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="game-card p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-game text-sm text-[#fbbf24]">⭐ Level {profile.level}</span>
          <span className="font-game text-sm text-[#94a3b8]">{profile.total_xp}/{xpForNext} XP</span>
        </div>
        <div className="bar-track h-5">
          <motion.div
            className="xp-bar h-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <p className="font-game text-xs text-[#94a3b8] mt-1.5 text-center">
          อีก {xpForNext - profile.total_xp} XP ถึง Level {profile.level + 1}
        </p>
      </motion.div>

      {/* Behavior Analysis & Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="game-card p-4"
      >
        <p className="font-heading text-sm text-[#fbbf24] mb-3">🧠 วิเคราะห์พฤติกรรม</p>
        <div className="space-y-3">
          {analysis.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-[#0c0c1d]/50 border border-[#2a2a5a]/30"
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className={cn("font-game text-sm", item.color)}>{item.title}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quest Breakdown */}
      {habits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="game-card p-4"
        >
          <p className="font-heading text-sm text-[#fbbf24] mb-3">🎯 Quest Breakdown</p>
          <div className="space-y-3">
            {habits.map((h) => (
              <div key={h.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white font-game">{h.emoji} {h.name}</span>
                  <span className="font-game text-xs text-[#fbbf24]">🔥{h.current_streak}</span>
                </div>
                <div className="bar-track h-3">
                  <div
                    className="h-full rounded transition-all"
                    style={{
                      width: h.total_completions > 0 ? `${Math.min(100, h.total_completions * 5)}%` : "0%",
                      background: h.total_completions >= 20 ? "linear-gradient(90deg, #22c55e, #4ade80)" : h.total_completions >= 10 ? "linear-gradient(90deg, #fbbf24, #fde047)" : "linear-gradient(90deg, #8b5cf6, #a78bfa)",
                    }}
                  />
                </div>
                <div className="flex justify-between font-game text-xs text-[#475569] mt-0.5">
                  <span>{h.total_completions} ครั้ง</span>
                  <span>Best: {h.longest_streak}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

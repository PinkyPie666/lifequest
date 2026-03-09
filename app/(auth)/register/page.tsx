"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import Link from "next/link";

const CLASS_OPTIONS = [
  { id: "warrior" as const, emoji: "⚔️", name: "Warrior", nameTh: "นักรบ", desc: "Strong & disciplined" },
  { id: "mage" as const, emoji: "🧙", name: "Mage", nameTh: "จอมเวท", desc: "Wise & focused" },
  { id: "ranger" as const, emoji: "🏹", name: "Ranger", nameTh: "พราน", desc: "Agile & adaptable" },
  { id: "healer" as const, emoji: "💚", name: "Healer", nameTh: "นักบำบัด", desc: "Caring & balanced" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { createUser, updateProfile } = useUserStore();
  const { play } = useSoundEffect();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<"warrior" | "mage" | "ranger" | "healer">("warrior");

  const handleNext = useCallback(() => {
    if (!name.trim()) return;
    play("click");
    setStep(2);
  }, [name, play]);

  const handleCreate = useCallback(() => {
    play("levelup");
    createUser(name.trim());
    updateProfile({ classType: selectedClass, avatarEmoji: CLASS_OPTIONS.find(c => c.id === selectedClass)?.emoji || "⚔️", onboardingCompleted: true });
    setTimeout(() => router.push("/dashboard"), 500);
  }, [name, selectedClass, createUser, updateProfile, play, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#0c0c1d] relative">
      <div className="fixed inset-0 scanline pointer-events-none z-10" />

      <div className="relative z-20 w-full max-w-sm">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-4 animate-float-pixel">🎮</div>
          <h1 className="font-pixel text-xl text-[#fbbf24] retro-text-shadow mb-2">
            NEW GAME
          </h1>
          <p className="text-[#94a3b8] text-lg">สร้างตัวละครของคุณ</p>
        </motion.div>

        {step === 1 ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Name input */}
            <div className="pixel-card p-4">
              <label className="font-pixel text-[10px] text-[#fbbf24] block mb-3">
                PLAYER NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNext()}
                placeholder="ใส่ชื่อของคุณ..."
                maxLength={20}
                className="w-full bg-[#0c0c1d] border-2 border-[#2a2a5a] px-4 py-3 text-xl text-white placeholder-[#475569] focus:border-[#8b5cf6] focus:outline-none transition-colors font-retro"
                autoFocus
              />
              <p className="font-pixel text-[7px] text-[#475569] mt-2">
                {name.length}/20
              </p>
            </div>

            <button
              onClick={handleNext}
              disabled={!name.trim()}
              className="w-full pixel-btn bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-40 disabled:cursor-not-allowed text-white font-pixel text-sm py-4 tracking-wider transition-colors"
            >
              NEXT →
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Class selection */}
            <div className="pixel-card p-4">
              <label className="font-pixel text-[10px] text-[#fbbf24] block mb-3">
                CHOOSE YOUR CLASS
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CLASS_OPTIONS.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => { play("click"); setSelectedClass(cls.id); }}
                    className={`pixel-card p-3 text-center transition-all ${
                      selectedClass === cls.id
                        ? "border-[#8b5cf6] bg-[#8b5cf6]/10 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="text-3xl mb-1">{cls.emoji}</div>
                    <p className="font-pixel text-[9px] text-white">{cls.name}</p>
                    <p className="text-sm text-[#94a3b8]">{cls.nameTh}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="pixel-card p-4 text-center">
              <p className="font-pixel text-[8px] text-[#475569] mb-2">PREVIEW</p>
              <div className="text-4xl mb-2">{CLASS_OPTIONS.find(c => c.id === selectedClass)?.emoji}</div>
              <p className="font-pixel text-sm text-white">{name}</p>
              <p className="text-[#fbbf24] text-sm">Lv.1 {CLASS_OPTIONS.find(c => c.id === selectedClass)?.name}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { play("click"); setStep(1); }}
                className="pixel-btn bg-[#1e1e3a] hover:bg-[#2a2a5a] text-[#94a3b8] font-pixel text-[10px] py-3 px-6 tracking-wider transition-colors"
              >
                ← BACK
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 pixel-btn bg-[#22c55e] hover:bg-[#16a34a] text-white font-pixel text-sm py-3 tracking-wider transition-colors"
              >
                ▶ START!
              </button>
            </div>
          </motion.div>
        )}

        <p className="text-center text-[#475569] mt-6 text-lg">
          มี save อยู่แล้ว?{" "}
          <Link href="/login" className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors">
            โหลด save →
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { useSoundEffect } from "@/hooks/useSoundEffect";

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 3,
  duration: Math.random() * 2 + 1,
}));

export default function LandingPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { play } = useSoundEffect();
  const [phase, setPhase] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (user && user.onboardingCompleted) {
      router.replace("/dashboard");
      return;
    }
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 3000);
    const cursorInterval = setInterval(() => setShowCursor((p) => !p), 530);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(cursorInterval); };
  }, [user, router]);

  const handleStart = useCallback(() => {
    play("coin");
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/register");
    }
  }, [play, user, router]);

  const handleLogin = useCallback(() => {
    play("click");
    router.push("/login");
  }, [play, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0c0c1d]">
      {/* Stars background */}
      <div className="absolute inset-0">
        {STARS.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Scanline overlay */}
      <div className="fixed inset-0 scanline z-10 pointer-events-none" />

      {/* Ground pixel art */}
      <div className="absolute bottom-0 left-0 right-0 h-20 z-0">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#1a472a]" />
        <div className="absolute bottom-8 left-0 right-0 h-4 bg-[#2d5a3f]" />
        <div className="absolute bottom-12 left-0 right-0 h-2 bg-[#3a6b4a]" style={{
          backgroundImage: "repeating-linear-gradient(90deg, #3a6b4a 0px, #3a6b4a 16px, #2d5a3f 16px, #2d5a3f 32px)"
        }} />
      </div>

      {/* Main content */}
      <div className="relative z-20 text-center px-6 max-w-md mx-auto">
        {/* Pixel Sword Icon */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="mb-6"
            >
              <div className="text-7xl animate-float-pixel filter drop-shadow-lg">⚔️</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-pixel text-3xl sm:text-4xl text-[#fbbf24] retro-glow mb-3 retro-text-shadow leading-relaxed">
                LIFE<span className="text-[#8b5cf6]">QUEST</span>
              </h1>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-[2px] w-8 bg-[#8b5cf6]" />
                <span className="font-pixel text-[8px] text-[#94a3b8] tracking-wider">RPG HABIT TRACKER</span>
                <div className="h-[2px] w-8 bg-[#8b5cf6]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tagline typing effect */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-10 mt-6"
            >
              <div className="pixel-card p-4 mx-auto max-w-xs">
                <p className="text-lg text-[#94a3b8] leading-relaxed">
                  เปลี่ยนชีวิตจริงเป็นเกม RPG{" "}
                  <br />
                  ทำภารกิจ สะสม XP เลเวลอัพ!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature badges */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-3 mb-8 flex-wrap"
            >
              {[
                { emoji: "🎯", label: "QUESTS" },
                { emoji: "⚡", label: "XP" },
                { emoji: "🏆", label: "RANK UP" },
              ].map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 }}
                  className="pixel-card px-4 py-2 flex items-center gap-2"
                >
                  <span className="text-xl">{f.emoji}</span>
                  <span className="font-pixel text-[8px] text-[#fbbf24]">{f.label}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <button
                onClick={handleStart}
                className="w-full pixel-btn bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-pixel text-sm py-4 px-8 tracking-wider transition-colors"
              >
                ▶ START QUEST
              </button>
              <button
                onClick={handleLogin}
                className="w-full pixel-btn bg-[#1e1e3a] hover:bg-[#2a2a5a] text-[#94a3b8] hover:text-white font-pixel text-[10px] py-3 px-8 tracking-wider transition-colors"
              >
                CONTINUE SAVE{" "}
                <span className="text-[#fbbf24]">→</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blinking cursor */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <p className="font-pixel text-[8px] text-[#475569]">
                PRESS START{showCursor ? "▮" : " "}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Version */}
      <div className="absolute bottom-4 text-center z-20">
        <p className="font-pixel text-[7px] text-[#334155]">v1.0.0 // MADE WITH ♥</p>
      </div>
    </div>
  );
}

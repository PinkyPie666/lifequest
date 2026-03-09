"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { play } = useSoundEffect();

  useEffect(() => {
    if (user && user.onboardingCompleted) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#0c0c1d] relative">
      <div className="fixed inset-0 scanline pointer-events-none z-10" />

      <div className="relative z-20 w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-4 animate-float-pixel">💾</div>
          <h1 className="font-pixel text-xl text-[#fbbf24] retro-text-shadow mb-2">
            LOAD SAVE
          </h1>
          <p className="text-[#94a3b8] text-lg">โหลดข้อมูลที่มีอยู่</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {user ? (
            <div className="pixel-card p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{user.avatarEmoji}</div>
                <div>
                  <p className="font-pixel text-sm text-white">{user.displayName}</p>
                  <p className="text-[#fbbf24] text-sm">Lv.{user.level} {user.classType}</p>
                  <p className="text-[#94a3b8] text-xs">🔥 Streak: {user.streakDays} วัน</p>
                </div>
              </div>
              <button
                onClick={() => { play("success"); router.push("/dashboard"); }}
                className="w-full pixel-btn bg-[#22c55e] hover:bg-[#16a34a] text-white font-pixel text-sm py-3 tracking-wider transition-colors"
              >
                ▶ CONTINUE
              </button>
            </div>
          ) : (
            <div className="pixel-card p-5 text-center space-y-4">
              <div className="text-4xl mb-2">📭</div>
              <p className="font-pixel text-[10px] text-[#475569]">NO SAVE DATA FOUND</p>
              <p className="text-[#94a3b8] text-sm">ยังไม่มีข้อมูลผู้เล่น</p>
            </div>
          )}

          <div className="pixel-card p-4 space-y-3">
            <p className="font-pixel text-[8px] text-[#fbbf24] mb-2">INFO</p>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              ข้อมูลถูกบันทึกอัตโนมัติในเบราว์เซอร์นี้
              ไม่ต้องล็อกอิน แค่เปิดแอปก็เล่นต่อได้เลย!
            </p>
            <div className="flex items-center gap-2 text-xs text-[#475569]">
              <span>💡</span>
              <span>ใช้เบราว์เซอร์เดิมเพื่อเล่นต่อ</span>
            </div>
          </div>

          <button
            onClick={() => { play("click"); router.push("/register"); }}
            className="w-full pixel-btn bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-pixel text-sm py-3 tracking-wider transition-colors"
          >
            + NEW GAME
          </button>
        </motion.div>

        <p className="text-center text-[#475569] mt-6 text-lg">
          <Link href="/" className="text-[#8b5cf6] hover:text-[#a78bfa] transition-colors">
            ← กลับหน้าแรก
          </Link>
        </p>
      </div>
    </div>
  );
}

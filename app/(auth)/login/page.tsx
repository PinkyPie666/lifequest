"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { signInWithGoogle, signInWithEmail } from "@/lib/supabase/api";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { play } = useSoundEffect();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    play("click");
    setLoading(true);
    setError("");
    const { error: err } = await signInWithGoogle();
    if (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    play("click");
    setLoading(true);
    setError("");
    const { error: err } = await signInWithEmail(email, password);
    if (err) {
      setError(err.message === "Invalid login credentials" ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : err.message);
      setLoading(false);
    } else {
      play("success");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#0c0c1d] relative">
      <div className="fixed inset-0 scanline pointer-events-none z-10" />

      <div className="relative z-20 w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-4 animate-float">⚔️</div>
          <h1 className="font-heading text-3xl text-[#fbbf24] retro-text-shadow mb-2">
            เข้าสู่เกม
          </h1>
          <p className="text-[#94a3b8] text-base">ล็อกอินเพื่อเล่นต่อจากที่ค้างไว้</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full game-btn game-btn-google py-3.5 px-6 flex items-center justify-center gap-3 text-base disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-game">เข้าสู่ระบบด้วย Google</span>
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-[#2a2a5a]" />
            <span className="text-xs text-[#475569] font-game">หรือ</span>
            <div className="flex-1 h-px bg-[#2a2a5a]" />
          </div>

          {/* Email Login */}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div className="game-card p-4 space-y-3">
              <div>
                <label className="font-game text-xs text-[#94a3b8] block mb-1.5">อีเมล</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-[#0c0c1d] border border-[#2a2a5a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:border-[#8b5cf6] focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]/50 transition-all"
                />
              </div>
              <div>
                <label className="font-game text-xs text-[#94a3b8] block mb-1.5">รหัสผ่าน</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0c0c1d] border border-[#2a2a5a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:border-[#8b5cf6] focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]/50 transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="game-card p-3 border-red-500/30 text-center"
              >
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full game-btn game-btn-primary py-3 px-6 text-base font-game disabled:opacity-40"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "▶ เข้าสู่ระบบ"}
            </button>
          </form>

          <p className="text-center text-[#94a3b8] text-sm pt-2">
            ยังไม่มีบัญชี?{" "}
            <Link href="/register" className="text-[#8b5cf6] hover:text-[#a78bfa] font-game transition-colors">
              สมัครสมาชิก →
            </Link>
          </p>

          <p className="text-center text-sm">
            <Link href="/" className="text-[#475569] hover:text-[#94a3b8] transition-colors">
              ← กลับหน้าแรก
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

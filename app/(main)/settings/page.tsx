"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useThemeStore, THEMES, type ThemeName } from "@/stores/useThemeStore";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/supabase/api";

export default function SettingsPage() {
  const router = useRouter();
  const { play } = useSoundEffect();
  const { theme, setTheme } = useThemeStore();

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
        className="flex items-center gap-3"
      >
        <button
          onClick={() => { play("click"); router.back(); }}
          className="game-btn game-btn-secondary px-3 py-1.5 text-xs font-game"
        >
          ← กลับ
        </button>
        <h1 className="font-heading text-lg text-white">⚙ ตั้งค่า</h1>
      </motion.div>

      {/* Theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="game-card p-4"
      >
        <p className="font-heading text-sm text-[#fbbf24] mb-3">🎨 ธีม</p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(THEMES) as ThemeName[]).map((t) => (
            <button
              key={t}
              onClick={() => { play("toggle"); setTheme(t); }}
              className={cn(
                "game-card p-3 text-center transition-all",
                theme === t
                  ? "border-[#fbbf24]/50 bg-[#fbbf24]/10"
                  : "hover:bg-white/5"
              )}
            >
              <div
                className="w-8 h-8 mx-auto mb-1.5 rounded-lg border-2"
                style={{ backgroundColor: THEMES[t].colors.bg, borderColor: THEMES[t].colors.primary }}
              />
              <p className="font-game text-xs text-white">{THEMES[t].label}</p>
              <p className="font-game text-[10px] text-[#94a3b8]">{THEMES[t].labelTh}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="game-card p-4"
      >
        <p className="font-heading text-sm text-[#fbbf24] mb-3">ℹ เกี่ยวกับ</p>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#94a3b8]">Version</span>
            <span className="font-game text-sm text-[#475569]">1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#94a3b8]">Storage</span>
            <span className="font-game text-sm text-[#475569]">Supabase</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#94a3b8]">Framework</span>
            <span className="font-game text-sm text-[#475569]">Next.js 14</span>
          </div>
        </div>
      </motion.div>

      {/* Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="game-card p-4"
      >
        <p className="font-heading text-sm text-[#ef4444] mb-3">👤 บัญชี</p>
        <button
          onClick={handleLogout}
          className="w-full game-btn game-btn-danger py-2.5 font-game text-sm"
        >
          ออกจากระบบ
        </button>
      </motion.div>

      {/* Footer */}
      <p className="font-game text-xs text-[#334155] text-center pb-4">
        LIFEQUEST v1.0.0 // MADE WITH ♥
      </p>
    </div>
  );
}

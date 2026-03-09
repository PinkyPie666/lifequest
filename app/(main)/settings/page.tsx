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
        <p className="font-heading text-sm mb-3" style={{ color: "var(--theme-xp)" }}>🎨 ธีม</p>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(THEMES) as ThemeName[]).map((t) => (
            <button
              key={t}
              onClick={() => { play("toggle"); setTheme(t); }}
              className={cn(
                "relative rounded-xl p-3 text-left transition-all border-2",
                theme === t
                  ? "border-[var(--theme-primary)] shadow-lg"
                  : "border-transparent hover:border-[var(--theme-border)]"
              )}
              style={{
                backgroundColor: THEMES[t].colors.bgCard,
              }}
            >
              {theme === t && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                  style={{ background: THEMES[t].colors.primary, color: "#fff" }}>✓</div>
              )}
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl border"
                  style={{ backgroundColor: THEMES[t].colors.bg, borderColor: THEMES[t].colors.border }}
                >
                  {THEMES[t].preview}
                </div>
                <div>
                  <p className="font-game text-xs" style={{ color: THEMES[t].colors.text }}>{THEMES[t].label}</p>
                  <p className="font-game text-[10px]" style={{ color: THEMES[t].colors.textDim }}>{THEMES[t].labelTh}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[THEMES[t].colors.primary, THEMES[t].colors.secondary, THEMES[t].colors.accent, THEMES[t].colors.xp].map((c, i) => (
                  <div key={i} className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: c }} />
                ))}
              </div>
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

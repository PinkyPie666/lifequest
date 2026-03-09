"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useThemeStore, THEMES, type ThemeName } from "@/stores/useThemeStore";
import { useUserStore } from "@/stores/useUserStore";
import { useHabitStore } from "@/stores/useHabitStore";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const { play } = useSoundEffect();
  const { locale, setLocale } = useLanguageStore();
  const { theme, setTheme } = useThemeStore();
  const { user, reset: resetUser } = useUserStore();
  const { reset: resetHabits } = useHabitStore();
  const [showReset, setShowReset] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const handleExport = () => {
    const data = {
      user,
      habits: useHabitStore.getState().habits,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lifequest-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    play("success");
    setShowExport(true);
    setTimeout(() => setShowExport(false), 2000);
  };

  const handleResetAll = () => {
    play("error");
    resetUser();
    resetHabits();
    window.location.href = "/";
  };

  return (
    <div className="px-4 pt-6 pb-28 safe-top space-y-4">
      <div className="fixed inset-0 scanline pointer-events-none z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={() => { play("click"); router.back(); }}
          className="pixel-btn bg-[#1e1e3a] hover:bg-[#2a2a5a] text-[#94a3b8] font-pixel text-[9px] px-3 py-1"
        >
          ← BACK
        </button>
        <h1 className="font-pixel text-[13px] text-[#fbbf24] retro-text-shadow">⚙ SETTINGS</h1>
      </motion.div>

      {/* Theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
                className="w-8 h-8 mx-auto mb-1 border-2"
                style={{ backgroundColor: THEMES[t].colors.bg, borderColor: THEMES[t].colors.primary }}
              />
              <p className="font-pixel text-[6px] text-white">{THEMES[t].label}</p>
              <p className="font-pixel text-[5px] text-[#94a3b8]">{THEMES[t].labelTh}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Language */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="pixel-card p-4"
      >
        <p className="font-pixel text-[9px] text-[#fbbf24] mb-3">🌐 LANGUAGE</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "en" as const, label: "ENGLISH", emoji: "🇬🇧" },
            { id: "th" as const, label: "ภาษาไทย", emoji: "🇹🇭" },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => { play("click"); setLocale(lang.id); }}
              className={cn(
                "pixel-card p-3 text-center transition-all",
                locale === lang.id
                  ? "border-[#8b5cf6] bg-[#8b5cf6]/10"
                  : "hover:bg-white/5"
              )}
            >
              <span className="text-xl">{lang.emoji}</span>
              <p className="font-pixel text-[7px] text-white mt-1">{lang.label}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="pixel-card p-4 space-y-3"
      >
        <p className="font-pixel text-[9px] text-[#fbbf24]">💾 DATA</p>
        <button
          onClick={handleExport}
          className="w-full pixel-btn bg-[#1e1e3a] hover:bg-[#2a2a5a] text-[#94a3b8] font-pixel text-[9px] py-2"
        >
          📥 EXPORT DATA (JSON)
        </button>
        {showExport && (
          <p className="font-pixel text-[7px] text-[#22c55e] text-center">✓ EXPORTED!</p>
        )}
        <div className="pixel-card p-3">
          <p className="font-pixel text-[7px] text-[#94a3b8]">💡 INFO</p>
          <p className="text-xs text-[#475569] mt-1">
            ข้อมูลทั้งหมดถูกเก็บไว้ในเบราว์เซอร์ของคุณ (localStorage)
            ไม่มีข้อมูลส่งไปที่ server ใดๆ
          </p>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="pixel-card p-4"
      >
        <p className="font-pixel text-[9px] text-[#fbbf24] mb-3">ℹ ABOUT</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#94a3b8]">Version</span>
            <span className="font-pixel text-[8px] text-[#475569]">1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#94a3b8]">Storage</span>
            <span className="font-pixel text-[8px] text-[#475569]">localStorage</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#94a3b8]">Framework</span>
            <span className="font-pixel text-[8px] text-[#475569]">Next.js 14</span>
          </div>
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

      {/* Footer */}
      <p className="font-pixel text-[7px] text-[#334155] text-center pb-4">
        LIFEQUEST v1.0.0 // MADE WITH ♥
      </p>

      {/* Reset Modal */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4" onClick={() => setShowReset(false)}>
          <div className="pixel-card p-5 w-full max-w-xs text-center space-y-3" onClick={(e) => e.stopPropagation()}>
            <p className="text-4xl">⚠️</p>
            <p className="font-pixel text-[10px] text-[#ef4444]">DELETE ALL DATA?</p>
            <p className="text-sm text-[#94a3b8]">ข้อมูลทั้งหมดจะหายไปถาวร!</p>
            <div className="flex gap-3">
              <button
                onClick={() => { play("click"); setShowReset(false); }}
                className="flex-1 pixel-btn bg-[#1e1e3a] text-[#94a3b8] font-pixel text-[9px] py-2"
              >
                CANCEL
              </button>
              <button
                onClick={handleResetAll}
                className="flex-1 pixel-btn bg-[#ef4444] text-white font-pixel text-[9px] py-2"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

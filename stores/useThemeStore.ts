import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeName = "dungeon" | "forest" | "cyber";

export interface ThemeColors {
  bg: string;
  bgDark: string;
  bgCard: string;
  border: string;
  primary: string;
  primaryGlow: string;
  secondary: string;
  accent: string;
  text: string;
  textDim: string;
  textMuted: string;
  xp: string;
  hp: string;
  mp: string;
  success: string;
  danger: string;
  warning: string;
}

export const THEMES: Record<ThemeName, { label: string; labelTh: string; colors: ThemeColors }> = {
  dungeon: {
    label: "Dungeon Dark",
    labelTh: "ดันเจี้ยนมืด",
    colors: {
      bg: "#0c0c1d",
      bgDark: "#08081a",
      bgCard: "#13132b",
      border: "#2a2a5a",
      primary: "#8b5cf6",
      primaryGlow: "rgba(139, 92, 246, 0.4)",
      secondary: "#6366f1",
      accent: "#f59e0b",
      text: "#e2e8f0",
      textDim: "#94a3b8",
      textMuted: "#475569",
      xp: "#fbbf24",
      hp: "#ef4444",
      mp: "#3b82f6",
      success: "#22c55e",
      danger: "#ef4444",
      warning: "#f59e0b",
    },
  },
  forest: {
    label: "Enchanted Forest",
    labelTh: "ป่าเวทมนตร์",
    colors: {
      bg: "#0a1a0f",
      bgDark: "#071209",
      bgCard: "#122218",
      border: "#1e4a2a",
      primary: "#22c55e",
      primaryGlow: "rgba(34, 197, 94, 0.4)",
      secondary: "#16a34a",
      accent: "#fbbf24",
      text: "#d1fae5",
      textDim: "#86efac",
      textMuted: "#4ade80",
      xp: "#fbbf24",
      hp: "#ef4444",
      mp: "#22d3ee",
      success: "#4ade80",
      danger: "#ef4444",
      warning: "#fbbf24",
    },
  },
  cyber: {
    label: "Cyber Neon",
    labelTh: "ไซเบอร์นีออน",
    colors: {
      bg: "#0a0a1a",
      bgDark: "#050510",
      bgCard: "#111128",
      border: "#2d2d6a",
      primary: "#e879f9",
      primaryGlow: "rgba(232, 121, 249, 0.4)",
      secondary: "#a855f7",
      accent: "#22d3ee",
      text: "#f0f0ff",
      textDim: "#c4b5fd",
      textMuted: "#7c3aed",
      xp: "#fde047",
      hp: "#f43f5e",
      mp: "#22d3ee",
      success: "#34d399",
      danger: "#f43f5e",
      warning: "#fde047",
    },
  },
};

interface ThemeState {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  getColors: () => ThemeColors;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dungeon",
      setTheme: (theme) => set({ theme }),
      getColors: () => THEMES[get().theme].colors,
    }),
    { name: "lifequest-theme" }
  )
);

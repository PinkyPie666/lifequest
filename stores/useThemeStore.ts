import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeName = "dungeon" | "forest" | "cyber" | "kingdom" | "earthen" | "sakura";

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

export const THEMES: Record<ThemeName, { label: string; labelTh: string; preview: string; colors: ThemeColors }> = {
  dungeon: {
    label: "Dungeon Dark",
    labelTh: "ดันเจี้ยนมืด",
    preview: "🏰",
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
    preview: "🌲",
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
    preview: "💜",
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
  kingdom: {
    label: "Bright Kingdom",
    labelTh: "อาณาจักรสว่าง",
    preview: "☀️",
    colors: {
      bg: "#f8f5f0",
      bgDark: "#ede8e0",
      bgCard: "#ffffff",
      border: "#d4c9b8",
      primary: "#d97706",
      primaryGlow: "rgba(217, 119, 6, 0.3)",
      secondary: "#b45309",
      accent: "#7c3aed",
      text: "#1c1917",
      textDim: "#57534e",
      textMuted: "#a8a29e",
      xp: "#d97706",
      hp: "#dc2626",
      mp: "#2563eb",
      success: "#16a34a",
      danger: "#dc2626",
      warning: "#d97706",
    },
  },
  earthen: {
    label: "Earthen Grove",
    labelTh: "ดินหญ้า RPG",
    preview: "🌿",
    colors: {
      bg: "#1a1c14",
      bgDark: "#12140e",
      bgCard: "#252a1e",
      border: "#3d4a2e",
      primary: "#a3e635",
      primaryGlow: "rgba(163, 230, 53, 0.3)",
      secondary: "#65a30d",
      accent: "#fbbf24",
      text: "#ecfccb",
      textDim: "#bef264",
      textMuted: "#6b7a4e",
      xp: "#fbbf24",
      hp: "#ef4444",
      mp: "#38bdf8",
      success: "#a3e635",
      danger: "#ef4444",
      warning: "#fbbf24",
    },
  },
  sakura: {
    label: "Sakura Spring",
    labelTh: "ซากุระสดใส",
    preview: "🌸",
    colors: {
      bg: "#fdf2f8",
      bgDark: "#fce7f3",
      bgCard: "#ffffff",
      border: "#f9a8d4",
      primary: "#ec4899",
      primaryGlow: "rgba(236, 72, 153, 0.3)",
      secondary: "#db2777",
      accent: "#8b5cf6",
      text: "#1e1b2e",
      textDim: "#6b5b7b",
      textMuted: "#c4b5d4",
      xp: "#f59e0b",
      hp: "#ef4444",
      mp: "#3b82f6",
      success: "#22c55e",
      danger: "#ef4444",
      warning: "#f59e0b",
    },
  },
};

function applyThemeToDOM(themeName: ThemeName) {
  if (typeof document === "undefined") return;
  const colors = THEMES[themeName].colors;
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    root.style.setProperty(`--theme-${cssKey}`, value);
  });
  // Also set body bg and text color directly
  document.body.style.backgroundColor = colors.bg;
  document.body.style.color = colors.text;
}

interface ThemeState {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  getColors: () => ThemeColors;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dungeon",
      setTheme: (theme) => {
        set({ theme });
        applyThemeToDOM(theme);
      },
      getColors: () => THEMES[get().theme].colors,
      applyTheme: () => applyThemeToDOM(get().theme),
    }),
    { name: "lifequest-theme" }
  )
);

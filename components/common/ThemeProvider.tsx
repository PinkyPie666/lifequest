"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/useThemeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const applyTheme = useThemeStore((s) => s.applyTheme);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return <>{children}</>;
}

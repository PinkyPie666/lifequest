"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useTranslation();

  if (compact) {
    return (
      <button
        onClick={() => setLocale(locale === "en" ? "th" : "en")}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.08] border border-white/[0.12] hover:bg-white/[0.14] transition-colors text-xs font-medium"
      >
        <Globe className="h-3.5 w-3.5 text-slate-400" />
        <span>{locale === "en" ? "TH" : "EN"}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.06]">
      <button
        onClick={() => setLocale("en")}
        className={cn(
          "relative px-4 py-1.5 rounded-lg text-xs font-medium transition-colors",
          locale === "en" ? "text-white" : "text-slate-400 hover:text-foreground"
        )}
      >
        {locale === "en" && (
          <motion.div
            layoutId="langSwitch"
            className="absolute inset-0 gradient-primary rounded-lg"
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          />
        )}
        <span className="relative z-10">EN</span>
      </button>
      <button
        onClick={() => setLocale("th")}
        className={cn(
          "relative px-4 py-1.5 rounded-lg text-xs font-medium transition-colors",
          locale === "th" ? "text-white" : "text-slate-400 hover:text-foreground"
        )}
      >
        {locale === "th" && (
          <motion.div
            layoutId="langSwitch"
            className="absolute inset-0 gradient-primary rounded-lg"
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          />
        )}
        <span className="relative z-10">TH</span>
      </button>
    </div>
  );
}

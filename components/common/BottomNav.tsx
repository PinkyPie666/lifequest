"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  BarChart3,
  Plus,
  Trophy,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

const NAV = [
  { href: "/dashboard", icon: Home, labelKey: "home" },
  { href: "/stats", icon: BarChart3, labelKey: "stats" },
  { href: "/habits/new/edit", icon: Plus, labelKey: "add", isCenter: true },
  { href: "/leaderboard", icon: Trophy, labelKey: "rank" },
  { href: "/profile", icon: User, labelKey: "profile" },
] as const;

const LABELS: Record<string, Record<string, string>> = {
  en: { home: "Home", stats: "Stats", add: "Add", rank: "Rank", profile: "Profile" },
  th: { home: "หน้าหลัก", stats: "สถิติ", add: "เพิ่ม", rank: "อันดับ", profile: "โปรไฟล์" },
};

export function BottomNav() {
  const pathname = usePathname();
  const { locale } = useTranslation();
  const labels = LABELS[locale] || LABELS.en;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass border-t border-white/10 px-2 pb-1 pt-2">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isCenter = "isCenter" in item && item.isCenter;
            const isActive = !isCenter && pathname.startsWith(item.href);

            if (isCenter) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center -mt-5"
                >
                  <div className="w-12 h-12 rounded-2xl gradient-primary shadow-lg shadow-quest-purple/30 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {labels[item.labelKey]}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon
                  className={cn(
                    "h-5 w-5 relative z-10 transition-colors",
                    isActive ? "text-[#a78bfa]" : "text-slate-500"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] relative z-10 transition-colors",
                    isActive
                      ? "text-[#a78bfa] font-medium"
                      : "text-slate-500"
                  )}
                >
                  {labels[item.labelKey]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

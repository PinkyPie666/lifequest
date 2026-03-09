"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", emoji: "🏠", label: "BASE" },
  { href: "/habits", emoji: "📋", label: "QUESTS" },
  { href: "/habits/new/edit", emoji: "➕", label: "NEW", isCenter: true },
  { href: "/stats", emoji: "📊", label: "STATS" },
  { href: "/profile", emoji: "👤", label: "HERO" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { play } = useSoundEffect();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="bg-[#0c0c1d]/95 border-t border-[#2a2a5a]/50 px-2 pb-1 pt-1 backdrop-blur-lg">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {NAV.map((item) => {
            const isCenter = "isCenter" in item && item.isCenter;
            const isActive = !isCenter && (
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href)
            );

            if (isCenter) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => play("click")}
                  className="relative flex flex-col items-center -mt-5"
                >
                  <div className="w-13 h-13 game-btn game-btn-primary rounded-2xl flex items-center justify-center text-xl p-3">
                    {item.emoji}
                  </div>
                  <span className="font-game text-[10px] text-[#94a3b8] mt-1">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => play("navigate")}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all active:scale-90",
                  isActive ? "scale-105" : ""
                )}
              >
                <span className={cn(
                  "text-xl transition-all",
                  isActive ? "animate-float" : "grayscale-[30%] opacity-50"
                )}>
                  {item.emoji}
                </span>
                <span className={cn(
                  "font-game text-[10px] transition-colors",
                  isActive ? "text-[#fbbf24]" : "text-[#475569]"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-0.5 w-5 h-[2px] bg-[#fbbf24] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

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
      <div className="bg-[#0c0c1d]/95 border-t-2 border-[#2a2a5a] px-2 pb-1 pt-1 backdrop-blur-sm">
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
                  className="relative flex flex-col items-center -mt-4"
                >
                  <div className="w-12 h-12 pixel-btn bg-[#8b5cf6] hover:bg-[#7c3aed] flex items-center justify-center text-xl transition-colors">
                    {item.emoji}
                  </div>
                  <span className="font-pixel text-[6px] text-[#94a3b8] mt-1">
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
                  "relative flex flex-col items-center gap-0.5 px-3 py-1 transition-all active:scale-90",
                  isActive ? "scale-105" : ""
                )}
              >
                <span className={cn(
                  "text-xl transition-all",
                  isActive ? "animate-float-pixel" : "grayscale-[30%] opacity-60"
                )}>
                  {item.emoji}
                </span>
                <span className={cn(
                  "font-pixel text-[6px] transition-colors",
                  isActive ? "text-[#fbbf24]" : "text-[#475569]"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-0.5 w-4 h-[2px] bg-[#fbbf24]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

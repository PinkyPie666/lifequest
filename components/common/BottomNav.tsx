"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { cn } from "@/lib/utils";

const NAV_LEFT = [
  { href: "/dashboard", emoji: "🏠", label: "BASE" },
  { href: "/habits", emoji: "📋", label: "QUESTS" },
];
const NAV_RIGHT = [
  { href: "/stats", emoji: "📊", label: "STATS" },
  { href: "/profile", emoji: "👤", label: "HERO" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { play } = useSoundEffect();

  const renderItem = (item: { href: string; emoji: string; label: string }) => {
    const isActive =
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => play("navigate")}
        className={cn(
          "relative flex flex-col items-center gap-0.5 px-3 py-2 transition-all active:scale-90",
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
          isActive ? "text-[var(--theme-xp)]" : "text-[var(--theme-text-muted)]"
        )}>
          {item.label}
        </span>
        {isActive && (
          <div className="absolute -bottom-0.5 w-5 h-[2px] rounded-full" style={{ background: "var(--theme-xp)" }} />
        )}
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="bg-[var(--theme-bg)]/95 border-t border-[var(--theme-border)]/50 px-2 pb-2 pt-1 backdrop-blur-lg">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {NAV_LEFT.map(renderItem)}

          {/* Center + button */}
          <Link
            href="/playlist/create"
            onClick={() => play("click")}
            className="relative flex flex-col items-center -mt-6"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-secondary)] flex items-center justify-center text-2xl shadow-lg shadow-[var(--theme-primary-glow)] border-4 border-[var(--theme-bg)] active:scale-90 transition-transform">
              ➕
            </div>
            <span className="font-game text-[10px] text-[var(--theme-text-dim)] mt-1">
              CREATE
            </span>
          </Link>

          {NAV_RIGHT.map(renderItem)}
        </div>
      </div>
    </nav>
  );
}

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { Check, ArrowRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface HabitTpl {
  emoji: string;
  name: string;
  nameTh: string;
  category: string;
  defaultTime?: string;
  matchProblems?: string[];
}

const HABIT_TEMPLATES: HabitTpl[] = [
  // สุขภาพ
  { emoji: "🌅", name: "Wake Up Early", nameTh: "ตื่นเช้า", category: "health", defaultTime: "06:00", matchProblems: ["wake_late"] },
  { emoji: "🏃", name: "Exercise", nameTh: "ออกกำลังกาย", category: "health", defaultTime: "07:00", matchProblems: ["no_exercise"] },
  { emoji: "💧", name: "Drink 8 Glasses", nameTh: "ดื่มน้ำ 8 แก้ว", category: "health" },
  { emoji: "🥗", name: "Eat Healthy", nameTh: "กินอาหารเพื่อสุขภาพ", category: "health", matchProblems: ["irregular_meals"] },
  { emoji: "😴", name: "Sleep Before 10 PM", nameTh: "นอนก่อน 4 ทุ่ม", category: "health", defaultTime: "22:00", matchProblems: ["sleep_late"] },
  { emoji: "🚿", name: "Cold Shower", nameTh: "อาบน้ำเย็น", category: "health" },
  // จิตใจ
  { emoji: "🧘", name: "Meditate", nameTh: "นั่งสมาธิ", category: "mental", defaultTime: "06:30", matchProblems: ["stress", "no_focus"] },
  { emoji: "📝", name: "Write Journal", nameTh: "เขียน Journal", category: "mental", defaultTime: "21:00" },
  { emoji: "🙏", name: "Gratitude 3 Things", nameTh: "ขอบคุณ 3 สิ่ง", category: "mental", matchProblems: ["stress"] },
  { emoji: "📵", name: "Social Media Detox", nameTh: "Social Media Detox", category: "mental", matchProblems: ["social_media"] },
  { emoji: "🚫", name: "No Fap", nameTh: "No Fap", category: "mental", matchProblems: ["porn"] },
  { emoji: "🍺", name: "No Alcohol", nameTh: "งดเหล้า", category: "mental", matchProblems: ["substance"] },
  { emoji: "🎮", name: "Limit Gaming", nameTh: "จำกัดเวลาเล่นเกม", category: "mental", matchProblems: ["gaming"] },
  // การเงิน
  { emoji: "💰", name: "Track Expenses", nameTh: "บันทึกรายจ่าย", category: "finance", defaultTime: "21:00", matchProblems: ["overspend"] },
  { emoji: "🐷", name: "Save Money", nameTh: "ออมเงิน", category: "finance", matchProblems: ["overspend"] },
  { emoji: "📊", name: "Review Finances", nameTh: "ทบทวนการเงิน", category: "finance" },
  // การเรียน
  { emoji: "📚", name: "Read a Book", nameTh: "อ่านหนังสือ", category: "learning", defaultTime: "20:00" },
  { emoji: "🎧", name: "Listen to Podcast", nameTh: "ฟัง Podcast", category: "learning" },
  { emoji: "💻", name: "Online Course", nameTh: "เรียน Online", category: "learning" },
  { emoji: "🇬🇧", name: "Practice English", nameTh: "ฝึกภาษาอังกฤษ", category: "learning" },
  // การงาน
  { emoji: "📋", name: "Plan My Day", nameTh: "วางแผนวันใหม่", category: "work", defaultTime: "08:00", matchProblems: ["procrastinate"] },
  { emoji: "🎯", name: "Deep Work", nameTh: "ทำ Deep Work", category: "work", matchProblems: ["no_focus", "procrastinate"] },
  { emoji: "✅", name: "Review Today", nameTh: "Review งานวันนี้", category: "work", defaultTime: "17:00" },
];

const CATEGORIES = ["all", "health", "mental", "finance", "learning", "work"] as const;

export default function SetupPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { problems, setSelectedHabits } = useOnboardingStore();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categoryLabels: Record<string, string> = {
    all: t.onboarding.allCategory,
    health: t.onboarding.healthCategory,
    mental: t.onboarding.mentalCategory,
    finance: t.onboarding.financeCategory,
    learning: t.onboarding.learningCategory,
    work: t.onboarding.workCategory,
  };

  const recommended = useMemo(() => {
    if (!problems || problems.length === 0) return [];
    return HABIT_TEMPLATES.filter(
      (h) => h.matchProblems && h.matchProblems.some((p) => problems.includes(p))
    );
  }, [problems]);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return HABIT_TEMPLATES;
    return HABIT_TEMPLATES.filter((h) => h.category === activeCategory);
  }, [activeCategory]);

  const toggleHabit = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const getDisplayName = (h: HabitTpl) => (locale === "th" ? h.nameTh : h.name);

  const handleNext = () => {
    const habits = HABIT_TEMPLATES.filter((h) => selected.has(h.name)).map((h) => ({
      emoji: h.emoji,
      name: locale === "th" ? h.nameTh : h.name,
      category: h.category,
      reminderTime: h.defaultTime || "08:00",
      reminderEnabled: true,
    }));
    setSelectedHabits(habits);
    router.push("/onboarding/times");
  };

  const renderCard = (h: HabitTpl, i: number) => {
    const isSelected = selected.has(h.name);
    return (
      <motion.button
        key={h.name}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => toggleHabit(h.name)}
        className={cn(
          "glass-card p-3.5 flex items-center gap-3 w-full text-left transition-all",
          isSelected && "border-[#a78bfa]/50 bg-[#a78bfa]/10"
        )}
      >
        <span className="text-xl flex-shrink-0">{h.emoji}</span>
        <div className="flex-1 min-w-0">
          <span className="font-medium text-sm text-white truncate block">{getDisplayName(h)}</span>
          {h.defaultTime && (
            <span className="text-[11px] text-slate-400">⏰ {h.defaultTime}</span>
          )}
        </div>
        <div
          className={cn(
            "w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all",
            isSelected ? "bg-[#a78bfa] border-[#a78bfa]" : "border-white/20"
          )}
        >
          {isSelected && <Check className="h-3 w-3 text-white" />}
        </div>
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col px-6 pt-12 pb-32 safe-top safe-bottom">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🎯</span>
          <h1 className="text-2xl font-bold text-white">{t.onboarding.setupTitle}</h1>
        </div>
        <p className="text-sm text-slate-400 mb-6">{t.onboarding.setupDesc}</p>
      </motion.div>

      {/* Recommended section */}
      {recommended.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-amber-400">{t.onboarding.recommended}</h2>
          </div>
          <div className="space-y-2">
            {recommended.map((h, i) => renderCard(h, i))}
          </div>
        </motion.div>
      )}

      {/* Category tabs (horizontal scroll) */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0",
              activeCategory === cat
                ? "gradient-primary text-white"
                : "bg-white/5 text-slate-400 hover:text-white"
            )}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Habit template list */}
      <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
        {filtered.map((h, i) => renderCard(h, i))}
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-white/10 safe-bottom">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <p className="text-sm text-slate-300">
            {t.onboarding.habitsSelected.replace("{count}", String(selected.size))}
          </p>
          <Button
            onClick={handleNext}
            disabled={selected.size === 0}
            className="px-6"
          >
            {t.onboarding.setupTime}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

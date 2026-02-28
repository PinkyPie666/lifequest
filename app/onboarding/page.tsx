"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import {
  ArrowRight,
  ArrowLeft,
  Swords,
  Check,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// step = -1 is Welcome, 0..5 is questionnaire
const TOTAL_STEPS = 6;

function TimeSelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="glass-card p-4">
      <p className="text-sm font-medium text-slate-300 mb-2">{label}</p>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#a78bfa] transition-colors [color-scheme:dark]"
      />
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [step, setStep] = useState(-1); // -1 = welcome
  const [goals, setGoals] = useState<string[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const [customProblem, setCustomProblem] = useState("");
  const [currentWakeTime, setCurrentWakeTime] = useState("07:00");
  const [targetWakeTime, setTargetWakeTime] = useState("06:00");
  const [currentSleepTime, setCurrentSleepTime] = useState("00:00");
  const [targetSleepTime, setTargetSleepTime] = useState("22:00");
  const [notifFrequency, setNotifFrequency] = useState<string>("");
  const [feedbackStyle, setFeedbackStyle] = useState<string>("");
  const [targetDays, setTargetDays] = useState<number>(0);

  const GOALS = [
    { id: "health", label: t.onboarding.goalHealth, emoji: "🏃", color: "#ef4444" },
    { id: "mind", label: t.onboarding.goalMind, emoji: "🧠", color: "#a78bfa" },
    { id: "finance", label: t.onboarding.goalFinance, emoji: "💰", color: "#34d399" },
    { id: "learning", label: t.onboarding.goalLearning, emoji: "📚", color: "#f59e0b" },
    { id: "work", label: t.onboarding.goalWork, emoji: "💼", color: "#60a5fa" },
    { id: "relationship", label: t.onboarding.goalRelationship, emoji: "💑", color: "#ec4899" },
  ];

  const PROBLEMS = [
    { id: "wake_late", label: t.onboarding.problemWakeLate },
    { id: "procrastinate", label: t.onboarding.problemProcrastinate },
    { id: "social_media", label: t.onboarding.problemSocialMedia },
    { id: "no_exercise", label: t.onboarding.problemNoExercise },
    { id: "sleep_late", label: t.onboarding.problemSleepLate },
    { id: "irregular_meals", label: t.onboarding.problemIrregularMeals },
    { id: "no_focus", label: t.onboarding.problemNoFocus },
    { id: "stress", label: t.onboarding.problemStress },
    { id: "overspend", label: t.onboarding.problemOverspend },
    { id: "porn", label: t.onboarding.problemPorn },
    { id: "gaming", label: t.onboarding.problemGaming },
    { id: "substance", label: t.onboarding.problemSubstance },
  ];

  const NOTIF_OPTIONS = [
    { id: "all", label: t.onboarding.notifAll, desc: t.onboarding.notifAllDesc, emoji: "🔔" },
    { id: "morning_evening", label: t.onboarding.notifMorningEvening, desc: t.onboarding.notifMorningEveningDesc, emoji: "🔕" },
    { id: "none", label: t.onboarding.notifNone, desc: t.onboarding.notifNoneDesc, emoji: "📵" },
  ];

  const FEEDBACK_OPTIONS = [
    { id: "gentle", label: t.onboarding.feedbackGentle, desc: t.onboarding.feedbackGentleDesc, emoji: "🤗" },
    { id: "direct", label: t.onboarding.feedbackDirect, desc: t.onboarding.feedbackDirectDesc, emoji: "💪" },
    { id: "data", label: t.onboarding.feedbackData, desc: t.onboarding.feedbackDataDesc, emoji: "📊" },
    { id: "brief", label: t.onboarding.feedbackBrief, desc: t.onboarding.feedbackBriefDesc, emoji: "⚡" },
  ];

  const TARGET_OPTIONS = [
    { days: 21, label: t.onboarding.days21, desc: t.onboarding.days21Desc },
    { days: 30, label: t.onboarding.days30, desc: t.onboarding.days30Desc },
    { days: 66, label: t.onboarding.days66, desc: t.onboarding.days66Desc },
    { days: 90, label: t.onboarding.days90, desc: t.onboarding.days90Desc },
  ];

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
    setList((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const addCustomProblem = () => {
    if (customProblem.trim()) {
      setProblems((prev) => [...prev, `custom:${customProblem.trim()}`]);
      setCustomProblem("");
    }
  };

  const sleepHours = useMemo(() => {
    const [sh, sm] = targetSleepTime.split(":").map(Number);
    const [wh, wm] = targetWakeTime.split(":").map(Number);
    const sleepMin = sh * 60 + sm;
    let wakeMin = wh * 60 + wm;
    if (wakeMin <= sleepMin) wakeMin += 24 * 60;
    const diff = wakeMin - sleepMin;
    return (diff / 60).toFixed(1);
  }, [targetSleepTime, targetWakeTime]);

  const canProceed = () => {
    if (step === 0) return goals.length > 0;
    if (step === 1) return problems.length > 0;
    if (step === 2) return true; // times have defaults
    if (step === 3) return notifFrequency !== "";
    if (step === 4) return feedbackStyle !== "";
    if (step === 5) return targetDays > 0;
    return false;
  };

  const { setQuestionnaire } = useOnboardingStore();

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      setQuestionnaire({
        goals,
        problems,
        currentWakeTime,
        targetWakeTime,
        currentSleepTime,
        targetSleepTime,
        notificationFrequency: notifFrequency,
        feedbackStyle,
        targetDays,
      });
      router.push("/onboarding/setup");
    }
  };

  // ─── WELCOME SCREEN ─────────────────────────────
  if (step === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 safe-top safe-bottom">
        <div className="absolute top-6 right-6">
          <LanguageSwitcher compact />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-quest-purple/30"
        >
          <Swords className="h-12 w-12 text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold gradient-text mb-2"
        >
          LifeQuest
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-[#a78bfa] font-medium mb-3"
        >
          {t.onboarding.welcomeTagline}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-slate-400 text-center max-w-xs mb-10 leading-relaxed"
        >
          {t.onboarding.welcomeDesc}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-xs space-y-4"
        >
          <Button size="lg" className="w-full" onClick={() => setStep(0)}>
            {t.onboarding.startAdventure}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-center text-sm text-slate-400">
            {t.onboarding.haveAccount}{" "}
            <Link href="/login" className="text-[#a78bfa] hover:underline font-medium">
              {t.onboarding.signInLink}
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  // ─── QUESTIONNAIRE STEPS ────────────────────────
  return (
    <div className="min-h-screen flex flex-col px-6 py-12 safe-top safe-bottom">
      {/* Progress bar */}
      <div className="flex items-center gap-1.5 mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full flex-1 transition-all duration-300",
              i <= step ? "gradient-primary" : "bg-white/10"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 0: Goals ──────────────────────── */}
        {step === 0 && (
          <motion.div key="goals" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1">
            <h1 className="text-2xl font-bold mb-2 text-white">{t.onboarding.whatGoals}</h1>
            <p className="text-sm text-slate-400 mb-6">{t.onboarding.selectAreas}</p>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map((goal) => {
                const isSelected = goals.includes(goal.id);
                return (
                  <motion.button
                    key={goal.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleItem(goals, setGoals, goal.id)}
                    className={cn(
                      "glass-card p-4 flex flex-col items-center gap-2 transition-all",
                      isSelected && "border-[#a78bfa]/50 bg-[#a78bfa]/10"
                    )}
                  >
                    <span className="text-3xl">{goal.emoji}</span>
                    <span className="text-sm font-semibold text-white">{goal.label}</span>
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-[#a78bfa]" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Step 1: Problems ───────────────────── */}
        {step === 1 && (
          <motion.div key="problems" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 overflow-y-auto no-scrollbar">
            <h1 className="text-2xl font-bold mb-2 text-white">{t.onboarding.whatProblems}</h1>
            <p className="text-sm text-slate-400 mb-6">{t.onboarding.selectProblems}</p>
            <div className="space-y-2">
              {PROBLEMS.map((p) => {
                const isSelected = problems.includes(p.id);
                return (
                  <motion.button
                    key={p.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleItem(problems, setProblems, p.id)}
                    className={cn(
                      "glass-card p-3.5 flex items-center gap-3 w-full text-left transition-all",
                      isSelected && "border-[#a78bfa]/50 bg-[#a78bfa]/10"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all",
                        isSelected ? "bg-[#a78bfa] border-[#a78bfa]" : "border-white/20"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm text-white">{p.label}</span>
                  </motion.button>
                );
              })}
              {/* Custom problem input */}
              <div className="glass-card p-3.5 flex items-center gap-3">
                <Plus className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <Input
                  value={customProblem}
                  onChange={(e) => setCustomProblem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomProblem()}
                  placeholder={t.onboarding.typeHere}
                  className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {customProblem && (
                  <button onClick={addCustomProblem} className="text-[#a78bfa] text-xs font-medium flex-shrink-0">
                    +
                  </button>
                )}
              </div>
              {/* Custom added items */}
              {problems.filter((p) => p.startsWith("custom:")).map((p) => (
                <div key={p} className="glass-card p-3.5 flex items-center gap-3 border-[#a78bfa]/50 bg-[#a78bfa]/10">
                  <div className="w-5 h-5 rounded-md bg-[#a78bfa] border-[#a78bfa] flex-shrink-0 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm text-white">{p.replace("custom:", "")}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Sleep Schedule ─────────────── */}
        {step === 2 && (
          <motion.div key="sleep" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1">
            <h1 className="text-2xl font-bold mb-2 text-white">{t.onboarding.dailyRoutine}</h1>
            <p className="text-sm text-slate-400 mb-6">{t.onboarding.dailyRoutineDesc}</p>
            <div className="space-y-3">
              <TimeSelect label={t.onboarding.currentWakeTime} value={currentWakeTime} onChange={setCurrentWakeTime} />
              <TimeSelect label={t.onboarding.targetWakeTime} value={targetWakeTime} onChange={setTargetWakeTime} />
              <TimeSelect label={t.onboarding.currentSleepTime} value={currentSleepTime} onChange={setCurrentSleepTime} />
              <TimeSelect label={t.onboarding.targetSleepTime} value={targetSleepTime} onChange={setTargetSleepTime} />
              {/* Sleep calculation */}
              <div className="glass-card p-4 text-center">
                <p className="text-lg font-bold text-white">
                  {t.onboarding.sleepCalc.replace("{hours}", sleepHours)}
                </p>
                <p className={cn(
                  "text-xs mt-1",
                  parseFloat(sleepHours) >= 7 && parseFloat(sleepHours) <= 9 ? "text-emerald-400" : "text-amber-400"
                )}>
                  {t.onboarding.sleepRecommend}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Notification Frequency ─────── */}
        {step === 3 && (
          <motion.div key="notif" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1">
            <h1 className="text-2xl font-bold mb-2 text-white">{t.onboarding.notifFrequency}</h1>
            <p className="text-sm text-slate-400 mb-6">{t.onboarding.notifFrequencyDesc}</p>
            <div className="space-y-3">
              {NOTIF_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setNotifFrequency(opt.id)}
                  className={cn(
                    "glass-card p-4 flex items-center gap-4 w-full text-left transition-all",
                    notifFrequency === opt.id && "border-[#a78bfa]/50 bg-[#a78bfa]/10"
                  )}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <div className="flex-1">
                    <span className="font-medium text-sm text-white">{opt.label}</span>
                    <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                  </div>
                  {notifFrequency === opt.id && <Check className="h-4 w-4 text-[#a78bfa] flex-shrink-0" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Step 4: Feedback Style ─────────────── */}
        {step === 4 && (
          <motion.div key="feedback" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1">
            <h1 className="text-2xl font-bold mb-2 text-white">{t.onboarding.feedbackStyle}</h1>
            <p className="text-sm text-slate-400 mb-6">{t.onboarding.feedbackStyleDesc}</p>
            <div className="space-y-3">
              {FEEDBACK_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFeedbackStyle(opt.id)}
                  className={cn(
                    "glass-card p-4 flex items-center gap-4 w-full text-left transition-all",
                    feedbackStyle === opt.id && "border-[#a78bfa]/50 bg-[#a78bfa]/10"
                  )}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <div className="flex-1">
                    <span className="font-medium text-sm text-white">{opt.label}</span>
                    <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                  </div>
                  {feedbackStyle === opt.id && <Check className="h-4 w-4 text-[#a78bfa] flex-shrink-0" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Step 5: Target Days ────────────────── */}
        {step === 5 && (
          <motion.div key="target" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1">
            <h1 className="text-2xl font-bold mb-2 text-white">{t.onboarding.targetDays}</h1>
            <p className="text-sm text-slate-400 mb-6">{t.onboarding.targetDaysDesc}</p>
            <div className="grid grid-cols-2 gap-3">
              {TARGET_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.days}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTargetDays(opt.days)}
                  className={cn(
                    "glass-card p-5 flex flex-col items-center gap-2 transition-all",
                    targetDays === opt.days && "border-[#a78bfa]/50 bg-[#a78bfa]/10"
                  )}
                >
                  <span className="text-2xl font-bold text-white">{opt.label}</span>
                  <span className="text-xs text-slate-400">{opt.desc}</span>
                  {targetDays === opt.days && <Check className="h-4 w-4 text-[#a78bfa]" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-8">
        <Button variant="outline" size="lg" onClick={() => setStep(step - 1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {step === TOTAL_STEPS - 1 ? t.onboarding.setupTitle : t.onboarding.next}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { Swords, Sparkles, Target, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Target,
      title: t.landing.trackHabits,
      desc: t.landing.trackHabitsDesc,
      color: "#22c55e",
    },
    {
      icon: Sparkles,
      title: t.landing.earnXp,
      desc: t.landing.earnXpDesc,
      color: "#a78bfa",
    },
    {
      icon: Trophy,
      title: t.landing.compete,
      desc: t.landing.competeDesc,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 safe-top safe-bottom">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 right-6 z-10"
      >
        <LanguageSwitcher />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-sm mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-8 shadow-lg shadow-quest-purple/30"
        >
          <Swords className="h-10 w-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold mb-3"
        >
          <span className="gradient-text">LifeQuest</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-slate-300 text-base mb-10 leading-relaxed"
        >
          {t.landing.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-3 mb-10"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="glass-card p-3 flex flex-col items-center gap-2"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <feature.icon
                  className="h-5 w-5"
                  style={{ color: feature.color }}
                />
              </div>
              <span className="text-xs font-semibold text-white">{feature.title}</span>
              <span className="text-[11px] text-slate-400 text-center leading-tight">
                {feature.desc}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-3"
        >
          <Button asChild size="xl" className="w-full group">
            <Link href="/register">
              {t.landing.startQuest}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="w-full text-slate-400 hover:text-white">
            <Link href="/login">
              {t.landing.haveAccount}
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-auto pt-8 text-center"
      >
        <p className="text-xs text-slate-500">
          {t.landing.madeWith}
        </p>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useMemo } from "react";

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Small daily improvements lead to stunning results.", author: "Robin Sharma" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
];

export function DailyQuote() {
  const quote = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return QUOTES[dayOfYear % QUOTES.length];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-quest-purple/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-4 w-4 text-[#a78bfa]" />
        </div>
        <div>
          <p className="text-sm text-slate-200 italic leading-relaxed">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="text-xs text-slate-400 mt-1">— {quote.author}</p>
        </div>
      </div>
    </motion.div>
  );
}

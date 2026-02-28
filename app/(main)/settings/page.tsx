"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  KeyRound,
  Trash2,
  Bell,
  BellOff,
  Clock,
  Flame,
  FileEdit,
  Moon as MoonIcon,
  Bed,
  MessageSquare,
  Globe,
  Download,
  Shield,
  FileText,
  Info,
  Headphones,
  Star,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function SettingsPage() {
  const { t } = useTranslation();
  const router = useRouter();

  // Local toggle states (demo)
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [morningTime, setMorningTime] = useState("07:00");
  const [eveningTime, setEveningTime] = useState("21:00");
  const [streakReminder, setStreakReminder] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotifEnabled(true);
      // TODO: Get FCM token and save to profile
    } else {
      setNotifEnabled(false);
    }
  };

  const handleNotifToggle = () => {
    if (!notifEnabled) {
      requestNotificationPermission();
    } else {
      setNotifEnabled(false);
    }
  };

  return (
    <div className="px-4 pt-12 safe-top space-y-5 pb-28">
      {/* ─── Header ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4 text-slate-400" />
        </button>
        <h1 className="text-2xl font-bold text-white">{t.settings.title}</h1>
      </motion.div>

      {/* ─── 👤 Account ────────────────────── */}
      <SettingsSection title={`👤 ${t.settings.account}`} delay={0.1}>
        <SettingsRow
          icon={Mail}
          label={t.settings.email}
          trailing={<span className="text-xs text-slate-500">hero@lifequest.app</span>}
        />
        <SettingsRow icon={KeyRound} label={t.settings.changePassword} chevron />
        <SettingsRow
          icon={Trash2}
          label={t.settings.deleteAccount}
          desc={t.settings.deleteAccountDesc}
          chevron
          danger
        />
      </SettingsSection>

      {/* ─── 🔔 Notifications ──────────────── */}
      <SettingsSection title={`🔔 ${t.settings.notifications}`} delay={0.15}>
        <SettingsRow
          icon={notifEnabled ? Bell : BellOff}
          label={t.settings.enableNotifications}
          trailing={
            <ToggleSwitch checked={notifEnabled} onChange={handleNotifToggle} />
          }
        />
        {notifEnabled && (
          <>
            <SettingsRow
              icon={Clock}
              label={t.settings.morningReminder}
              trailing={
                <input
                  type="time"
                  value={morningTime}
                  onChange={(e) => setMorningTime(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none"
                />
              }
            />
            <SettingsRow
              icon={Clock}
              label={t.settings.eveningSummary}
              trailing={
                <input
                  type="time"
                  value={eveningTime}
                  onChange={(e) => setEveningTime(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none"
                />
              }
            />
            <SettingsRow
              icon={Flame}
              label={t.settings.streakReminder}
              trailing={
                <ToggleSwitch
                  checked={streakReminder}
                  onChange={() => setStreakReminder(!streakReminder)}
                />
              }
            />
          </>
        )}
      </SettingsSection>

      {/* ─── 🎯 Goals ─────────────────────── */}
      <SettingsSection title={`🎯 ${t.settings.goals}`} delay={0.2}>
        <SettingsRow
          icon={FileEdit}
          label={t.settings.editQuestionnaire}
          desc={t.settings.editQuestionnaireDesc}
          chevron
        />
        <SettingsRow
          icon={Bed}
          label={t.settings.sleepSchedule}
          desc={t.settings.sleepScheduleDesc}
          chevron
        />
        <SettingsRow
          icon={MessageSquare}
          label={t.settings.feedbackStyle}
          desc={t.settings.feedbackStyleDesc}
          chevron
        />
      </SettingsSection>

      {/* ─── 🎨 Theme ─────────────────────── */}
      <SettingsSection title={`🎨 ${t.settings.theme}`} delay={0.25}>
        <SettingsRow
          icon={MoonIcon}
          label={t.settings.darkMode}
          trailing={
            <ToggleSwitch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          }
        />
        <div className="flex items-center gap-3 w-full p-4 border-b border-white/5 last:border-0">
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
            <Globe className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">{t.settings.language}</p>
            <p className="text-[11px] text-slate-400">{t.settings.languageDesc}</p>
          </div>
          <LanguageSwitcher />
        </div>
      </SettingsSection>

      {/* ─── 📊 Data ──────────────────────── */}
      <SettingsSection title={`📊 ${t.settings.data}`} delay={0.3}>
        <SettingsRow
          icon={Download}
          label={t.settings.exportData}
          desc={t.settings.exportDataDesc}
          chevron
        />
        <SettingsRow icon={Shield} label={t.settings.privacyPolicy} chevron />
        <SettingsRow icon={FileText} label={t.settings.termsOfService} chevron />
      </SettingsSection>

      {/* ─── ℹ️ About ──────────────────────── */}
      <SettingsSection title={`ℹ️ ${t.settings.about}`} delay={0.35}>
        <SettingsRow
          icon={Info}
          label={t.settings.version}
          trailing={<span className="text-xs text-slate-500">1.0.0</span>}
        />
        <SettingsRow icon={Headphones} label={t.settings.contactSupport} chevron />
        <SettingsRow icon={Star} label={t.settings.rateApp} chevron />
      </SettingsSection>

      {/* ─── 🚪 Sign Out ──────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          variant="outline"
          size="lg"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t.profile.signOut}
        </Button>
      </motion.div>

      <p className="text-center text-[11px] text-slate-600 pb-4">
        LifeQuest v1.0.0
      </p>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────
function SettingsSection({
  title,
  delay,
  children,
}: {
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
        {title}
      </h2>
      <div className="glass-card overflow-hidden">{children}</div>
    </motion.div>
  );
}

// ─── Row component ────────────────────────────────────────
function SettingsRow({
  icon: Icon,
  label,
  desc,
  trailing,
  chevron,
  danger,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc?: string;
  trailing?: React.ReactNode;
  chevron?: boolean;
  danger?: boolean;
}) {
  return (
    <button className="flex items-center gap-3 w-full p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
          danger ? "bg-red-500/10" : "bg-white/5"
        )}
      >
        <Icon className={cn("h-4 w-4", danger ? "text-red-400" : "text-slate-400")} />
      </div>
      <div className="flex-1 text-left">
        <p className={cn("text-sm font-medium", danger ? "text-red-400" : "text-white")}>
          {label}
        </p>
        {desc && <p className="text-[11px] text-slate-400">{desc}</p>}
      </div>
      {trailing}
      {chevron && <ChevronRight className="h-4 w-4 text-slate-500 flex-shrink-0" />}
    </button>
  );
}

// ─── Toggle Switch ────────────────────────────────────────
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors flex-shrink-0",
        checked ? "bg-[#8b5cf6]" : "bg-white/10"
      )}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
        animate={{ left: checked ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

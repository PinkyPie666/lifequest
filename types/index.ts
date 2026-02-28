export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  totalXp: number;
  streakDays: number;
  longestStreak: number;
  joinedAt: string;
  onboardingCompleted: boolean;
}

export interface Habit {
  id: string;
  userId: string;
  emoji: string;
  name: string;
  description?: string;
  icon: string;
  category: HabitCategory;
  difficulty: Difficulty;
  frequency: Frequency;
  targetDays: number[];
  reminderTime?: string;
  reminderEnabled: boolean;
  importance: number;
  sortOrder: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  xpReward: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  completedAt: string;
  xpEarned: number;
  note?: string;
}

export interface DailyProgress {
  date: string;
  totalHabits: number;
  completedHabits: number;
  xpEarned: number;
  completionRate: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: number;
  xpReward: number;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  streakDays: number;
}

export interface WeeklyStats {
  week: string;
  completionRate: number;
  totalXp: number;
  habitsCompleted: number;
  bestDay: string;
}

export type Difficulty = "easy" | "medium" | "hard" | "legendary";
export type Frequency = "daily" | "weekly" | "custom";

export interface QuestionnaireData {
  goals: string[];
  problems: string[];
  currentWakeTime: string;
  targetWakeTime: string;
  currentSleepTime: string;
  targetSleepTime: string;
  notificationFrequency: "all" | "morning_evening" | "none";
  feedbackStyle: "gentle" | "direct" | "data" | "brief";
  targetDays: number;
}

export interface HabitTemplate {
  emoji: string;
  name: string;
  nameTh: string;
  category: HabitCategory;
  defaultTime?: string;
  matchProblems?: string[];
}

export type HabitCategory = "health" | "mental" | "finance" | "learning" | "work" | "mind" | "productivity" | "social" | "creativity" | "other";

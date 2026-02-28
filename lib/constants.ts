export const APP_NAME = "LifeQuest";
export const APP_DESCRIPTION = "Level up your life with gamified habit tracking";

export const HABIT_CATEGORIES = [
  { id: "health", label: "Health & Fitness", icon: "Heart", color: "#ef4444" },
  { id: "mind", label: "Mind & Learning", icon: "Brain", color: "#8b5cf6" },
  { id: "productivity", label: "Productivity", icon: "Zap", color: "#f59e0b" },
  { id: "social", label: "Social & Relations", icon: "Users", color: "#3b82f6" },
  { id: "creativity", label: "Creativity", icon: "Palette", color: "#ec4899" },
  { id: "finance", label: "Finance", icon: "Wallet", color: "#22c55e" },
] as const;

export const DIFFICULTY_LEVELS = [
  { id: "easy", label: "Easy", xp: 10, color: "#22c55e" },
  { id: "medium", label: "Medium", xp: 20, color: "#f59e0b" },
  { id: "hard", label: "Hard", xp: 35, color: "#ef4444" },
  { id: "legendary", label: "Legendary", xp: 50, color: "#8b5cf6" },
] as const;

export const RANK_TIERS = [
  { name: "Novice", minLevel: 1, color: "#9ca3af" },
  { name: "Apprentice", minLevel: 5, color: "#22c55e" },
  { name: "Warrior", minLevel: 10, color: "#3b82f6" },
  { name: "Champion", minLevel: 20, color: "#8b5cf6" },
  { name: "Legend", minLevel: 35, color: "#f59e0b" },
  { name: "Mythic", minLevel: 50, color: "#ef4444" },
] as const;

export const SUGGESTED_HABITS = [
  { name: "Morning Meditation", category: "mind", difficulty: "easy", icon: "🧘" },
  { name: "Exercise 30 min", category: "health", difficulty: "medium", icon: "🏃" },
  { name: "Read 20 pages", category: "mind", difficulty: "easy", icon: "📖" },
  { name: "Drink 8 glasses of water", category: "health", difficulty: "easy", icon: "💧" },
  { name: "No social media 1hr", category: "productivity", difficulty: "medium", icon: "📵" },
  { name: "Journal writing", category: "creativity", difficulty: "easy", icon: "✍️" },
  { name: "Learn new skill 30min", category: "mind", difficulty: "hard", icon: "🎯" },
  { name: "Sleep before 11PM", category: "health", difficulty: "medium", icon: "😴" },
  { name: "Budget tracking", category: "finance", difficulty: "easy", icon: "💰" },
  { name: "Connect with friend", category: "social", difficulty: "easy", icon: "👋" },
] as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "LayoutDashboard" },
  { href: "/habits", label: "Habits", icon: "Target" },
  { href: "/stats", label: "Stats", icon: "BarChart3" },
  { href: "/leaderboard", label: "Rank", icon: "Trophy" },
  { href: "/profile", label: "Profile", icon: "User" },
] as const;

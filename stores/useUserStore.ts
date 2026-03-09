import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LocalUser {
  id: string;
  username: string;
  displayName: string;
  avatarEmoji: string;
  bio: string;
  level: number;
  xp: number;
  totalXp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  streakDays: number;
  longestStreak: number;
  lastActiveDate: string;
  joinedAt: string;
  onboardingCompleted: boolean;
  classType: "warrior" | "mage" | "ranger" | "healer";
  totalCompletions: number;
  perfectDays: number;
  coins: number;
}

function createDefaultUser(name: string): LocalUser {
  return {
    id: `user_${Date.now()}`,
    username: name.toLowerCase().replace(/\s+/g, "_"),
    displayName: name,
    avatarEmoji: "⚔️",
    bio: "",
    level: 1,
    xp: 0,
    totalXp: 0,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    streakDays: 0,
    longestStreak: 0,
    lastActiveDate: new Date().toISOString().split("T")[0],
    joinedAt: new Date().toISOString(),
    onboardingCompleted: false,
    classType: "warrior",
    totalCompletions: 0,
    perfectDays: 0,
    coins: 0,
  };
}

function xpForLevel(level: number): number {
  return level * level * 100;
}

interface UserState {
  user: LocalUser | null;
  isLoading: boolean;
  createUser: (name: string) => void;
  setUser: (user: LocalUser | null) => void;
  setLoading: (loading: boolean) => void;
  updateProfile: (updates: Partial<LocalUser>) => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  checkStreak: () => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      createUser: (name) => set({ user: createDefaultUser(name) }),
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      updateProfile: (updates) =>
        set((state) => {
          if (!state.user) return state;
          return { user: { ...state.user, ...updates } };
        }),
      addXp: (amount) =>
        set((state) => {
          if (!state.user) return state;
          const newTotalXp = state.user.totalXp + amount;
          let newLevel = state.user.level;
          while (newTotalXp >= xpForLevel(newLevel)) {
            newLevel++;
          }
          const newMaxHp = 100 + (newLevel - 1) * 10;
          const newMaxMp = 50 + (newLevel - 1) * 5;
          return {
            user: {
              ...state.user,
              xp: state.user.xp + amount,
              totalXp: newTotalXp,
              level: newLevel,
              maxHp: newMaxHp,
              maxMp: newMaxMp,
              hp: newMaxHp,
              mp: newMaxMp,
            },
          };
        }),
      addCoins: (amount) =>
        set((state) => {
          if (!state.user) return state;
          return { user: { ...state.user, coins: state.user.coins + amount } };
        }),
      checkStreak: () => {
        const state = get();
        if (!state.user) return;
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

        if (state.user.lastActiveDate === today) return;

        if (state.user.lastActiveDate === yesterday) {
          set({
            user: {
              ...state.user,
              streakDays: state.user.streakDays + 1,
              longestStreak: Math.max(state.user.longestStreak, state.user.streakDays + 1),
              lastActiveDate: today,
            },
          });
        } else {
          set({
            user: { ...state.user, streakDays: 1, lastActiveDate: today },
          });
        }
      },
      reset: () => set({ user: null, isLoading: false }),
    }),
    { name: "lifequest-user" }
  )
);

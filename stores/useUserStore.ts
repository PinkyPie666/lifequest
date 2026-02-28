import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  addXp: (amount: number) => void;
  updateStreak: (streak: number) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      addXp: (amount) =>
        set((state) => {
          if (!state.user) return state;
          const newXp = state.user.xp + amount;
          const newTotalXp = state.user.totalXp + amount;
          const newLevel = Math.floor(Math.sqrt(newTotalXp / 100)) + 1;
          return {
            user: {
              ...state.user,
              xp: newXp,
              totalXp: newTotalXp,
              level: newLevel,
            },
          };
        }),
      updateStreak: (streak) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              streakDays: streak,
              longestStreak: Math.max(state.user.longestStreak, streak),
            },
          };
        }),
      reset: () => set({ user: null, isLoading: false }),
    }),
    {
      name: "lifequest-user",
    }
  )
);

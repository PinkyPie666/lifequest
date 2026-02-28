import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Habit, HabitCompletion } from "@/types";

interface HabitState {
  habits: Habit[];
  completions: HabitCompletion[];
  isLoading: boolean;
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  removeHabit: (id: string) => void;
  addCompletion: (completion: HabitCompletion) => void;
  setCompletions: (completions: HabitCompletion[]) => void;
  setLoading: (loading: boolean) => void;
  getTodayCompletions: () => HabitCompletion[];
  isHabitCompletedToday: (habitId: string) => boolean;
  reset: () => void;
}

const todayStr = () => new Date().toISOString().split("T")[0];

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      completions: [],
      isLoading: true,
      setHabits: (habits) => set({ habits }),
      addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        })),
      removeHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),
      addCompletion: (completion) =>
        set((state) => ({ completions: [...state.completions, completion] })),
      setCompletions: (completions) => set({ completions }),
      setLoading: (isLoading) => set({ isLoading }),
      getTodayCompletions: () => {
        const today = todayStr();
        return get().completions.filter((c) => c.completedAt.startsWith(today));
      },
      isHabitCompletedToday: (habitId) => {
        const today = todayStr();
        return get().completions.some(
          (c) => c.habitId === habitId && c.completedAt.startsWith(today)
        );
      },
      reset: () => set({ habits: [], completions: [], isLoading: false }),
    }),
    {
      name: "lifequest-habits",
    }
  )
);

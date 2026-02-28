import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SelectedHabit {
  emoji: string;
  name: string;
  category: string;
  reminderTime: string;
  reminderEnabled: boolean;
}

interface OnboardingState {
  // Questionnaire data
  goals: string[];
  problems: string[];
  currentWakeTime: string;
  targetWakeTime: string;
  currentSleepTime: string;
  targetSleepTime: string;
  notificationFrequency: string;
  feedbackStyle: string;
  targetDays: number;
  // Setup data
  selectedHabits: SelectedHabit[];
  // Actions
  setQuestionnaire: (data: Partial<OnboardingState>) => void;
  setSelectedHabits: (habits: SelectedHabit[]) => void;
  updateHabitTime: (name: string, time: string) => void;
  updateHabitReminder: (name: string, enabled: boolean) => void;
  reset: () => void;
}

const initialState = {
  goals: [] as string[],
  problems: [] as string[],
  currentWakeTime: "07:00",
  targetWakeTime: "06:00",
  currentSleepTime: "00:00",
  targetSleepTime: "22:00",
  notificationFrequency: "",
  feedbackStyle: "",
  targetDays: 0,
  selectedHabits: [] as SelectedHabit[],
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      setQuestionnaire: (data) => set(data),
      setSelectedHabits: (habits) => set({ selectedHabits: habits }),
      updateHabitTime: (name, time) =>
        set((state) => ({
          selectedHabits: state.selectedHabits.map((h) =>
            h.name === name ? { ...h, reminderTime: time } : h
          ),
        })),
      updateHabitReminder: (name, enabled) =>
        set((state) => ({
          selectedHabits: state.selectedHabits.map((h) =>
            h.name === name ? { ...h, reminderEnabled: enabled } : h
          ),
        })),
      reset: () => set(initialState),
    }),
    { name: "lifequest-onboarding" }
  )
);

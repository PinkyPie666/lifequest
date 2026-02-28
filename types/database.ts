export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          level: number;
          total_xp: number;
          current_rank: string;
          current_streak: number;
          longest_streak: number;
          last_check_date: string | null;
          goals: string[];
          problems: string[];
          current_wake_time: string;
          target_wake_time: string;
          current_sleep_time: string;
          target_sleep_time: string;
          notification_frequency: string;
          feedback_style: string;
          target_days: number;
          notification_enabled: boolean;
          theme: string;
          is_premium: boolean;
          premium_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          level?: number;
          total_xp?: number;
          current_rank?: string;
          current_streak?: number;
          longest_streak?: number;
          last_check_date?: string | null;
          goals?: string[];
          problems?: string[];
          current_wake_time?: string;
          target_wake_time?: string;
          current_sleep_time?: string;
          target_sleep_time?: string;
          notification_frequency?: string;
          feedback_style?: string;
          target_days?: number;
          notification_enabled?: boolean;
          theme?: string;
          is_premium?: boolean;
          premium_until?: string | null;
        };
        Update: {
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          level?: number;
          total_xp?: number;
          current_rank?: string;
          current_streak?: number;
          longest_streak?: number;
          last_check_date?: string | null;
          goals?: string[];
          problems?: string[];
          current_wake_time?: string;
          target_wake_time?: string;
          current_sleep_time?: string;
          target_sleep_time?: string;
          notification_frequency?: string;
          feedback_style?: string;
          target_days?: number;
          notification_enabled?: boolean;
          theme?: string;
          is_premium?: boolean;
          premium_until?: string | null;
        };
        Relationships: [];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          emoji: string;
          name: string;
          description: string | null;
          category: string;
          reminder_time: string | null;
          reminder_enabled: boolean;
          importance: number;
          is_active: boolean;
          sort_order: number;
          current_streak: number;
          longest_streak: number;
          total_completions: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          emoji?: string;
          name: string;
          description?: string | null;
          category?: string;
          reminder_time?: string | null;
          reminder_enabled?: boolean;
          importance?: number;
          is_active?: boolean;
          sort_order?: number;
          current_streak?: number;
          longest_streak?: number;
          total_completions?: number;
        };
        Update: {
          emoji?: string;
          name?: string;
          description?: string | null;
          category?: string;
          reminder_time?: string | null;
          reminder_enabled?: boolean;
          importance?: number;
          is_active?: boolean;
          sort_order?: number;
          current_streak?: number;
          longest_streak?: number;
          total_completions?: number;
        };
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          log_date: string;
          is_completed: boolean;
          is_skipped: boolean;
          skip_reason: string | null;
          xp_earned: number;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          log_date?: string;
          is_completed?: boolean;
          is_skipped?: boolean;
          skip_reason?: string | null;
          xp_earned?: number;
          completed_at?: string | null;
        };
        Update: {
          is_completed?: boolean;
          is_skipped?: boolean;
          skip_reason?: string | null;
          xp_earned?: number;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey";
            columns: ["habit_id"];
            isOneToOne: false;
            referencedRelation: "habits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "habit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      achievements: {
        Row: {
          id: string;
          code: string;
          emoji: string | null;
          name: string;
          description: string | null;
          condition_type: string;
          condition_value: number;
          condition_category: string | null;
          xp_reward: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          emoji?: string | null;
          name: string;
          description?: string | null;
          condition_type: string;
          condition_value: number;
          condition_category?: string | null;
          xp_reward?: number;
        };
        Update: {
          code?: string;
          emoji?: string | null;
          name?: string;
          description?: string | null;
          condition_type?: string;
          condition_value?: number;
          condition_category?: string | null;
          xp_reward?: number;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
        };
        Update: {
          unlocked_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_achievements_achievement_id_fkey";
            columns: ["achievement_id"];
            isOneToOne: false;
            referencedRelation: "achievements";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          type: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body?: string | null;
          type?: string | null;
          is_read?: boolean;
        };
        Update: {
          title?: string;
          body?: string | null;
          type?: string | null;
          is_read?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {};
    Functions: {
      increment_habit_streak: {
        Args: { p_habit_id: string };
        Returns: undefined;
      };
      add_xp: {
        Args: { p_user_id: string; p_xp: number };
        Returns: undefined;
      };
    };
    Enums: {};
    CompositeTypes: {};
  };
}

// Convenience aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type HabitRow = Database["public"]["Tables"]["habits"]["Row"];
export type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];
export type AchievementRow = Database["public"]["Tables"]["achievements"]["Row"];
export type UserAchievement = Database["public"]["Tables"]["user_achievements"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];

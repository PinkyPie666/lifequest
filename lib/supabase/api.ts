import { createClient } from "./client";
import type { Database } from "@/types/database";

type HabitInsert = Database["public"]["Tables"]["habits"]["Insert"];
type HabitUpdate = Database["public"]["Tables"]["habits"]["Update"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// ─── Auth helpers ────────────────────────────────────────────

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, username: string) {
  const supabase = createClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });
}

export async function signInWithGoogle() {
  const supabase = createClient();
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}

// ─── Profile ─────────────────────────────────────────────────

export async function getProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
}

export async function getOrCreateProfile(userId: string, meta?: { email?: string | null; full_name?: string | null; avatar_url?: string | null }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (data) return { data, error: null };

  // Profile doesn't exist — create it
  const username = meta?.email ? meta.email.split("@")[0] : null;
  const { data: newProfile, error: createError } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      username,
      full_name: meta?.full_name ?? null,
      avatar_url: meta?.avatar_url ?? null,
    })
    .select("*")
    .single();

  return { data: newProfile, error: createError };
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  return { data, error };
}

// ─── Habits ──────────────────────────────────────────────────

export async function fetchHabits(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return { data: data ?? [], error };
}

export async function fetchHabitById(habitId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("id", habitId)
    .single();
  return { data, error };
}

export async function createHabit(habit: HabitInsert) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habits")
    .insert(habit)
    .select()
    .single();
  return { data, error };
}

export async function updateHabit(habitId: string, updates: HabitUpdate) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habits")
    .update(updates)
    .eq("id", habitId)
    .select()
    .single();
  return { data, error };
}

export async function deleteHabit(habitId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId);
  return { error };
}

// ─── Habit Logs ──────────────────────────────────────────────

export async function fetchTodayLogs(userId: string) {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("log_date", today);
  return { data: data ?? [], error };
}

export async function checkInHabit(
  habitId: string,
  userId: string,
  xpEarned: number
) {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("habit_logs")
    .upsert(
      {
        habit_id: habitId,
        user_id: userId,
        log_date: today,
        is_completed: true,
        is_skipped: false,
        xp_earned: xpEarned,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "habit_id,log_date" }
    )
    .select()
    .single();

  if (!error) {
    // Update streak & total on the habit
    await supabase.rpc("increment_habit_streak", { p_habit_id: habitId });
    // Add XP to profile
    await supabase.rpc("add_xp", { p_user_id: userId, p_xp: xpEarned });
  }

  return { data, error };
}

export async function skipHabit(
  habitId: string,
  userId: string,
  reason?: string
) {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("habit_logs")
    .upsert(
      {
        habit_id: habitId,
        user_id: userId,
        log_date: today,
        is_completed: false,
        is_skipped: true,
        skip_reason: reason ?? null,
        xp_earned: 0,
      },
      { onConflict: "habit_id,log_date" }
    )
    .select()
    .single();

  if (!error) {
    // Reset streak
    await supabase
      .from("habits")
      .update({ current_streak: 0 })
      .eq("id", habitId);
  }

  return { data, error };
}

// ─── Achievements ────────────────────────────────────────────

export async function fetchAchievements() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("condition_value", { ascending: true });
  return { data: data ?? [], error };
}

export async function fetchUserAchievements(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_achievements")
    .select("*, achievements(*)")
    .eq("user_id", userId);
  return { data: data ?? [], error };
}

// ─── Leaderboard ─────────────────────────────────────────────

export async function fetchLeaderboard(limit = 50) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, level, total_xp, current_streak, current_rank")
    .order("total_xp", { ascending: false })
    .limit(limit);
  return { data: data ?? [], error };
}

// ─── Notifications ───────────────────────────────────────────

export async function fetchNotifications(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  return { data: data ?? [], error };
}

export async function markNotificationRead(notificationId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);
  return { error };
}

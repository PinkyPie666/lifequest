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

// ─── Quest Playlists ────────────────────────────────────────

export async function createPlaylist(playlist: {
  user_id: string;
  emoji: string;
  name: string;
  description?: string;
  gradient?: string;
  is_published?: boolean;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quest_playlists")
    .insert(playlist)
    .select()
    .single();
  return { data, error };
}

export async function updatePlaylist(playlistId: string, updates: {
  emoji?: string;
  name?: string;
  description?: string;
  gradient?: string;
  is_published?: boolean;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quest_playlists")
    .update(updates)
    .eq("id", playlistId)
    .select()
    .single();
  return { data, error };
}

export async function deletePlaylist(playlistId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("quest_playlists")
    .delete()
    .eq("id", playlistId);
  return { error };
}

export async function fetchMyPlaylists(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quest_playlists")
    .select("*, quest_playlist_items(count)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data: data ?? [], error };
}

export async function fetchPublishedPlaylists() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quest_playlists")
    .select("*, quest_playlist_items(count), profiles(username, avatar_url)")
    .eq("is_published", true)
    .order("like_count", { ascending: false })
    .limit(50);
  return { data: data ?? [], error };
}

export async function fetchPlaylistById(playlistId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quest_playlists")
    .select("*, profiles(username, avatar_url)")
    .eq("id", playlistId)
    .single();
  return { data, error };
}

// ─── Playlist Items ─────────────────────────────────────────

export async function addPlaylistItem(item: {
  playlist_id: string;
  emoji: string;
  name: string;
  description?: string;
  category?: string;
  importance?: number;
  reminder_time?: string;
  sort_order?: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quest_playlist_items")
    .insert(item)
    .select()
    .single();
  return { data, error };
}

export async function removePlaylistItem(itemId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("quest_playlist_items")
    .delete()
    .eq("id", itemId);
  return { error };
}

export async function fetchPlaylistItems(playlistId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quest_playlist_items")
    .select("*")
    .eq("playlist_id", playlistId)
    .order("sort_order", { ascending: true });
  return { data: data ?? [], error };
}

// ─── Template Likes ─────────────────────────────────────────

export async function toggleTemplateLike(userId: string, templateId: string) {
  const supabase = createClient();
  // Check if already liked
  const { data: existing } = await supabase
    .from("template_likes")
    .select("id")
    .eq("user_id", userId)
    .eq("template_id", templateId)
    .maybeSingle();

  if (existing) {
    await supabase.from("template_likes").delete().eq("id", existing.id);
    return { liked: false };
  } else {
    await supabase.from("template_likes").insert({ user_id: userId, template_id: templateId });
    return { liked: true };
  }
}

export async function togglePlaylistLike(userId: string, playlistId: string) {
  const supabase = createClient();
  const { data: existing } = await supabase
    .from("template_likes")
    .select("id")
    .eq("user_id", userId)
    .eq("playlist_id", playlistId)
    .maybeSingle();

  if (existing) {
    await supabase.from("template_likes").delete().eq("id", existing.id);
    return { liked: false };
  } else {
    await supabase.from("template_likes").insert({ user_id: userId, playlist_id: playlistId });
    return { liked: true };
  }
}

export async function fetchUserLikes(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("template_likes")
    .select("template_id, playlist_id")
    .eq("user_id", userId);
  return { data: data ?? [], error };
}

export async function fetchTemplateLikeCount(templateId: string) {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("template_likes")
    .select("*", { count: "exact", head: true })
    .eq("template_id", templateId);
  return { count: count ?? 0, error };
}

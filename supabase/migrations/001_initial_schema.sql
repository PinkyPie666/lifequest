-- ============================================================
-- LifeQuest Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. Profiles (extends auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,

  -- Gamification
  level INT DEFAULT 1,
  total_xp INT DEFAULT 0,
  current_rank TEXT DEFAULT 'Bronze',

  -- Streaks
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_check_date DATE,

  -- Questionnaire results
  goals TEXT[] DEFAULT '{}',
  problems TEXT[] DEFAULT '{}',
  current_wake_time TIME DEFAULT '07:00',
  target_wake_time TIME DEFAULT '06:00',
  current_sleep_time TIME DEFAULT '00:00',
  target_sleep_time TIME DEFAULT '22:00',
  notification_frequency TEXT DEFAULT 'all',
  feedback_style TEXT DEFAULT 'gentle',
  target_days INT DEFAULT 66,

  -- Settings
  notification_enabled BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'dark',

  -- Subscription
  is_premium BOOLEAN DEFAULT false,
  premium_until TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. Habits
-- ============================================================
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  emoji TEXT DEFAULT '✅',
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'other',

  reminder_time TIME,
  reminder_enabled BOOLEAN DEFAULT true,
  importance INT DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),

  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,

  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  total_completions INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. Habit Logs
-- ============================================================
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_completed BOOLEAN DEFAULT false,
  is_skipped BOOLEAN DEFAULT false,
  skip_reason TEXT,

  xp_earned INT DEFAULT 0,
  completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(habit_id, log_date)
);

-- ============================================================
-- 4. Achievements (Master list)
-- ============================================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  emoji TEXT,
  name TEXT NOT NULL,
  description TEXT,

  condition_type TEXT NOT NULL,   -- 'streak', 'total', 'perfect_days', 'level'
  condition_value INT NOT NULL,
  condition_category TEXT,        -- optional: specific category

  xp_reward INT DEFAULT 50,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. User Achievements
-- ============================================================
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,

  unlocked_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, achievement_id)
);

-- ============================================================
-- 6. Notifications (in-app)
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  title TEXT NOT NULL,
  body TEXT,
  type TEXT,

  is_read BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Habits
CREATE POLICY "Users can manage own habits" ON habits
  FOR ALL USING (auth.uid() = user_id);

-- Habit logs
CREATE POLICY "Users can manage own logs" ON habit_logs
  FOR ALL USING (auth.uid() = user_id);

-- Achievements (read-only for all authenticated)
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT TO authenticated USING (true);

-- User achievements
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can manage own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- Triggers
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Helper Functions (called from client)
-- ============================================================

-- Increment streak & total_completions on a habit
CREATE OR REPLACE FUNCTION increment_habit_streak(p_habit_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE habits
  SET
    current_streak = current_streak + 1,
    longest_streak = GREATEST(longest_streak, current_streak + 1),
    total_completions = total_completions + 1
  WHERE id = p_habit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add XP to a user profile and auto-level
CREATE OR REPLACE FUNCTION add_xp(p_user_id UUID, p_xp INT)
RETURNS VOID AS $$
DECLARE
  new_total INT;
  new_level INT;
  new_rank TEXT;
BEGIN
  UPDATE profiles
  SET total_xp = total_xp + p_xp
  WHERE id = p_user_id
  RETURNING total_xp INTO new_total;

  -- Level formula: every 500 XP = 1 level
  new_level := GREATEST(1, new_total / 500 + 1);

  -- Rank tiers
  new_rank := CASE
    WHEN new_level >= 50 THEN 'Mythic'
    WHEN new_level >= 35 THEN 'Legend'
    WHEN new_level >= 20 THEN 'Champion'
    WHEN new_level >= 10 THEN 'Warrior'
    WHEN new_level >= 5  THEN 'Apprentice'
    ELSE 'Bronze'
  END;

  UPDATE profiles
  SET level = new_level, current_rank = new_rank
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_habits_user_active ON habits(user_id, is_active);
CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, log_date);
CREATE INDEX idx_habit_logs_habit_date ON habit_logs(habit_id, log_date);
CREATE INDEX idx_profiles_xp ON profiles(total_xp DESC);

-- ============================================================
-- Seed: Default Achievements
-- ============================================================
INSERT INTO achievements (code, emoji, name, description, condition_type, condition_value, xp_reward) VALUES
('first_check', '🎯', 'First Step',      'ทำ habit แรกสำเร็จ',                'total',        1,   10),
('streak_7',    '🔥', 'On Fire',          'Streak 7 วัน',                      'streak',       7,   50),
('streak_14',   '💪', 'Unstoppable',      'Streak 14 วัน',                     'streak',       14,  100),
('streak_30',   '🏆', 'Champion',         'Streak 30 วัน',                     'streak',       30,  200),
('streak_66',   '👑', 'Habit Master',     'Streak 66 วัน (นิสัยถาวร)',        'streak',       66,  500),
('total_50',    '⭐', 'Half Century',     'ทำสำเร็จ 50 ครั้ง',               'total',        50,  50),
('total_100',   '💯', 'Centurion',        'ทำสำเร็จ 100 ครั้ง',              'total',        100, 100),
('perfect_7',   '✨', 'Perfect Week',     '100% ทุกวัน 7 วันติดต่อกัน',     'perfect_days', 7,   150),
('level_5',     '📈', 'Rising Star',      'ถึง Level 5',                       'level',        5,   50),
('level_10',    '🌟', 'Superstar',        'ถึง Level 10',                      'level',        10,  100);

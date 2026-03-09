-- ============================================================
-- Quest Playlists (user-created template collections)
-- ============================================================
CREATE TABLE quest_playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  emoji TEXT DEFAULT '🎮',
  name TEXT NOT NULL,
  description TEXT,
  gradient TEXT DEFAULT 'from-purple-500 to-indigo-600',

  is_published BOOLEAN DEFAULT false,
  like_count INT DEFAULT 0,
  use_count INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Playlist Items (habits inside a playlist)
-- ============================================================
CREATE TABLE quest_playlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES quest_playlists(id) ON DELETE CASCADE NOT NULL,

  emoji TEXT DEFAULT '✅',
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'other',
  importance INT DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),
  reminder_time TIME,
  sort_order INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Template Likes
-- ============================================================
CREATE TABLE template_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Either a built-in template_id (string) or a playlist_id (uuid)
  template_id TEXT,
  playlist_id UUID REFERENCES quest_playlists(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Each user can only like once per template/playlist
  UNIQUE(user_id, template_id),
  UNIQUE(user_id, playlist_id)
);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE quest_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_likes ENABLE ROW LEVEL SECURITY;

-- Playlists: owner can do everything, anyone can read published
CREATE POLICY "Users can manage own playlists" ON quest_playlists
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view published playlists" ON quest_playlists
  FOR SELECT USING (is_published = true);

-- Playlist items: owner can manage, anyone can read items of published playlists
CREATE POLICY "Users can manage own playlist items" ON quest_playlist_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM quest_playlists WHERE id = playlist_id AND user_id = auth.uid())
  );
CREATE POLICY "Anyone can view published playlist items" ON quest_playlist_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM quest_playlists WHERE id = playlist_id AND is_published = true)
  );

-- Likes: users can manage own likes, anyone can read
CREATE POLICY "Users can manage own likes" ON template_likes
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view likes" ON template_likes
  FOR SELECT TO authenticated USING (true);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_playlists_user ON quest_playlists(user_id);
CREATE INDEX idx_playlists_published ON quest_playlists(is_published, like_count DESC);
CREATE INDEX idx_playlist_items_playlist ON quest_playlist_items(playlist_id, sort_order);
CREATE INDEX idx_likes_template ON template_likes(template_id);
CREATE INDEX idx_likes_playlist ON template_likes(playlist_id);
CREATE INDEX idx_likes_user ON template_likes(user_id);

-- ============================================================
-- Triggers
-- ============================================================
CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON quest_playlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update like_count on quest_playlists when a like is added/removed
CREATE OR REPLACE FUNCTION update_playlist_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.playlist_id IS NOT NULL THEN
    UPDATE quest_playlists SET like_count = like_count + 1 WHERE id = NEW.playlist_id;
  ELSIF TG_OP = 'DELETE' AND OLD.playlist_id IS NOT NULL THEN
    UPDATE quest_playlists SET like_count = GREATEST(0, like_count - 1) WHERE id = OLD.playlist_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON template_likes
  FOR EACH ROW EXECUTE FUNCTION update_playlist_like_count();

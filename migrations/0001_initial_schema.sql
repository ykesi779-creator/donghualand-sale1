-- DonghuaLand Initial Schema
-- Migration: 0001_initial_schema

-- ==================== ADMINS TABLE ====================
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==================== USERS TABLE ====================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',          -- 'user', 'moderator', 'admin'
  plan TEXT DEFAULT 'free',          -- 'free', 'premium'
  avatar TEXT,                        -- legacy avatar URL (auto-generated)
  profile_image TEXT,                 -- Cloudinary uploaded profile image URL
  cover_image TEXT,                   -- Cloudinary uploaded cover/banner image URL
  bio TEXT,                           -- user bio/description
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==================== ANIME TABLE ====================
CREATE TABLE IF NOT EXISTS anime (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tmdb_id INTEGER,
  title TEXT NOT NULL,
  title_native TEXT,
  title_english TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image TEXT,
  banner_image TEXT,
  trailer_url TEXT,
  status TEXT DEFAULT 'Ongoing',     -- 'Ongoing', 'Completed', 'Upcoming'
  type TEXT DEFAULT 'ONA',           -- 'ONA', 'TV', 'Movie', 'OVA', 'Special', 'Donghua'
  release_year INTEGER,
  season INTEGER,
  genres TEXT DEFAULT '[]',          -- JSON array
  studios TEXT DEFAULT '[]',         -- JSON array
  rating REAL DEFAULT 0,
  vote_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  episode_count INTEGER DEFAULT 0,
  duration TEXT,
  country TEXT DEFAULT 'CN',
  language TEXT DEFAULT 'Chinese',
  is_featured INTEGER DEFAULT 0,
  is_trending INTEGER DEFAULT 0,
  is_popular INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==================== EPISODES TABLE ====================
CREATE TABLE IF NOT EXISTS episodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  anime_id INTEGER NOT NULL,
  episode_number INTEGER NOT NULL,
  title TEXT,
  embed_url TEXT,
  video_url TEXT,
  thumbnail TEXT,
  air_date TEXT,
  is_members_only INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
  UNIQUE(anime_id, episode_number)
);

-- ==================== WATCHLIST TABLE ====================
CREATE TABLE IF NOT EXISTS watchlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  anime_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
  UNIQUE(user_id, anime_id)
);

-- ==================== WATCH HISTORY TABLE ====================
CREATE TABLE IF NOT EXISTS watch_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  anime_id INTEGER NOT NULL,
  episode_id INTEGER,
  episode_number INTEGER,
  progress_seconds INTEGER DEFAULT 0,
  watched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE
);

-- ==================== COMMENTS TABLE ====================
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  anime_id INTEGER,               -- comment on anime page
  episode_id INTEGER,             -- comment on episode/watch page
  parent_id INTEGER,              -- for replies (nullable = top-level)
  content TEXT NOT NULL,
  is_spoiler INTEGER DEFAULT 0,
  is_approved INTEGER DEFAULT 1,  -- moderation: 1=approved, 0=pending, -1=rejected
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
  FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- ==================== COMMENT LIKES TABLE ====================
CREATE TABLE IF NOT EXISTS comment_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  comment_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  UNIQUE(user_id, comment_id)
);

-- ==================== SCHEDULE TABLE ====================
CREATE TABLE IF NOT EXISTS schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  anime_id INTEGER NOT NULL,
  day_of_week TEXT NOT NULL,
  air_time TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
  UNIQUE(anime_id, day_of_week)
);

-- ==================== SETTINGS TABLE ====================
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_anime_slug ON anime(slug);
CREATE INDEX IF NOT EXISTS idx_anime_status ON anime(status);
CREATE INDEX IF NOT EXISTS idx_anime_trending ON anime(is_trending);
CREATE INDEX IF NOT EXISTS idx_anime_featured ON anime(is_featured);
CREATE INDEX IF NOT EXISTS idx_episodes_anime_id ON episodes(anime_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_anime_id ON comments(anime_id);
CREATE INDEX IF NOT EXISTS idx_comments_episode_id ON comments(episode_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user ON watch_history(user_id);

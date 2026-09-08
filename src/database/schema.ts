/**
 * SQLite Database Schema for Offline AI Language Tutor
 * Conforms to PRD Section 13 (Data Model)
 */

export const SQL_INIT_TABLES = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  native_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  level TEXT NOT NULL,
  daily_goal INTEGER NOT NULL,
  streak_days INTEGER DEFAULT 0,
  last_active_date TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  target_language TEXT NOT NULL,
  created_at TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  summary TEXT
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  correction_json TEXT,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mistakes (
  id TEXT PRIMARY KEY,
  message_id TEXT,
  category TEXT NOT NULL,
  original_text TEXT NOT NULL,
  corrected_text TEXT NOT NULL,
  explanation TEXT NOT NULL,
  severity TEXT NOT NULL,
  frequency INTEGER DEFAULT 1,
  last_seen TEXT NOT NULL,
  weakness_score REAL DEFAULT 1.0,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS vocabulary (
  id TEXT PRIMARY KEY,
  word TEXT NOT NULL,
  translation TEXT NOT NULL,
  phonetic TEXT,
  part_of_speech TEXT,
  example_sentence TEXT NOT NULL,
  example_translation TEXT NOT NULL,
  target_language TEXT NOT NULL,
  confidence INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  last_reviewed TEXT,
  next_review TEXT NOT NULL,
  interval_days INTEGER DEFAULT 1,
  ease_factor REAL DEFAULT 2.5
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  score INTEGER NOT NULL,
  completed_at TEXT NOT NULL,
  exercises_completed INTEGER DEFAULT 0,
  mistakes_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  skill TEXT NOT NULL UNIQUE,
  score INTEGER NOT NULL,
  trend TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_cat ON mistakes(category);
CREATE INDEX IF NOT EXISTS idx_vocab_next_review ON vocabulary(next_review);
`;

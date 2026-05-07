CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  event_date TEXT NOT NULL DEFAULT '',
  event_time TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  game_code TEXT NOT NULL DEFAULT 'SAVE',
  max_players INTEGER NOT NULL DEFAULT 50,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  instagram TEXT NOT NULL,
  slot INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, instagram)
);

CREATE TABLE IF NOT EXISTS game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  player_id UUID REFERENCES rsvps(id) ON DELETE SET NULL,
  player_name TEXT NOT NULL DEFAULT '',
  instagram TEXT NOT NULL DEFAULT '',
  puzzle_score INTEGER NOT NULL DEFAULT 0,
  quiz_score INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  rank TEXT NOT NULL DEFAULT '',
  round_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvps_session_created ON rsvps(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_results_session_created ON game_results(session_id, created_at);

INSERT INTO sessions (id, event_date, event_time, location, game_code, max_players)
VALUES ('default', '', '', '', 'SAVE', 50)
ON CONFLICT (id) DO NOTHING;

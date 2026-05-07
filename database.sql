CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  event_date TEXT NOT NULL DEFAULT '',
  event_time TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  game_code TEXT NOT NULL DEFAULT 'SAVE',
  max_players INTEGER NOT NULL DEFAULT 50,
  session_options JSONB NOT NULL DEFAULT '[]'::jsonb,
  logo_data_url TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  instagram TEXT NOT NULL,
  session_choice_id TEXT NOT NULL DEFAULT '',
  session_choice_label TEXT NOT NULL DEFAULT '',
  slot INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, instagram)
);

CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  rsvp_id UUID REFERENCES rsvps(id) ON DELETE SET NULL,
  name TEXT NOT NULL DEFAULT '',
  instagram TEXT NOT NULL,
  session_choice_id TEXT NOT NULL DEFAULT '',
  session_choice_label TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, instagram)
);

CREATE TABLE IF NOT EXISTS share_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  session_choice_id TEXT NOT NULL DEFAULT '',
  channel TEXT NOT NULL DEFAULT 'title',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  session_choice_id TEXT NOT NULL DEFAULT '',
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

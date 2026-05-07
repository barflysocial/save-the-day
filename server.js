require('dotenv').config();

const path = require('path');
const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_ID = 'default';
const DEFAULT_GAME_CODE = 'SAVE';
const DEFAULT_MAX_PLAYERS = 50;
const HOST_PIN = process.env.HOST_PIN || '1234';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function cleanGameCode(value) {
  return String(value || DEFAULT_GAME_CODE).trim().toUpperCase().replace(/\s+/g, '') || DEFAULT_GAME_CODE;
}

function normalizeInstagram(handle) {
  const clean = String(handle || '').trim().replace(/^@+/, '').toLowerCase();
  return clean ? `@${clean}` : '';
}

function safeText(value, maxLength = 100) {
  return String(value || '').trim().slice(0, maxLength);
}

function requireHostPin(req, res) {
  const submitted = req.body.hostPin || req.query.hostPin || req.headers['x-host-pin'];
  if (!HOST_PIN || submitted === HOST_PIN) return true;
  res.status(401).json({ error: 'Wrong host PIN.' });
  return false;
}

async function query(text, params = []) {
  if (!process.env.DATABASE_URL) {
    const error = new Error('DATABASE_URL is not configured.');
    error.code = 'NO_DATABASE_URL';
    throw error;
  }
  return pool.query(text, params);
}

async function initDb() {
  await query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      event_date TEXT NOT NULL DEFAULT '',
      event_time TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      game_code TEXT NOT NULL DEFAULT 'SAVE',
      max_players INTEGER NOT NULL DEFAULT 50,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS rsvps (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      instagram TEXT NOT NULL,
      slot INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(session_id, instagram)
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS checkins (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      rsvp_id UUID REFERENCES rsvps(id) ON DELETE SET NULL,
      name TEXT NOT NULL DEFAULT '',
      instagram TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(session_id, instagram)
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS share_clicks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      channel TEXT NOT NULL DEFAULT 'title',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await query(`
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
    )
  `);
  await query('CREATE INDEX IF NOT EXISTS idx_rsvps_session_created ON rsvps(session_id, created_at)');
  await query('CREATE INDEX IF NOT EXISTS idx_checkins_session_created ON checkins(session_id, created_at)');
  await query('CREATE INDEX IF NOT EXISTS idx_share_clicks_session_created ON share_clicks(session_id, created_at)');
  await query('CREATE INDEX IF NOT EXISTS idx_results_session_created ON game_results(session_id, created_at)');
  await query(`
    INSERT INTO sessions (id, event_date, event_time, location, game_code, max_players)
    VALUES ($1, '', '', '', $2, $3)
    ON CONFLICT (id) DO NOTHING
  `, [SESSION_ID, DEFAULT_GAME_CODE, DEFAULT_MAX_PLAYERS]);
}

async function getSession() {
  const sessionResult = await query('SELECT * FROM sessions WHERE id = $1', [SESSION_ID]);
  if (!sessionResult.rows[0]) {
    await query(`INSERT INTO sessions (id, game_code, max_players) VALUES ($1, $2, $3)`, [SESSION_ID, DEFAULT_GAME_CODE, DEFAULT_MAX_PLAYERS]);
    return getSession();
  }
  const session = sessionResult.rows[0];
  const countResult = await query('SELECT COUNT(*)::int AS count FROM rsvps WHERE session_id = $1', [SESSION_ID]);
  const checkinResult = await query('SELECT COUNT(*)::int AS count FROM checkins WHERE session_id = $1', [SESSION_ID]);
  const shareResult = await query('SELECT COUNT(*)::int AS count FROM share_clicks WHERE session_id = $1', [SESSION_ID]);
  return {
    settings: {
      date: session.event_date || '',
      time: session.event_time || '',
      location: session.location || '',
      gameCode: cleanGameCode(session.game_code)
    },
    rsvpCount: countResult.rows[0].count,
    checkinCount: checkinResult.rows[0].count,
    shareClickCount: shareResult.rows[0].count,
    maxPlayers: session.max_players || DEFAULT_MAX_PLAYERS,
    backendReady: true
  };
}

app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ ok: true, database: true });
  } catch (error) {
    res.status(500).json({ ok: false, database: false, error: error.message });
  }
});

app.get('/api/session', async (req, res) => {
  try {
    res.json(await getSession());
  } catch (error) {
    res.status(500).json({ error: error.message, backendReady: false });
  }
});

app.post('/api/rsvp', async (req, res) => {
  const name = safeText(req.body.name, 40);
  const instagram = normalizeInstagram(req.body.instagram);
  if (!name) return res.status(400).json({ error: 'Enter a player name to RSVP.' });
  if (!instagram) return res.status(400).json({ error: 'Enter an Instagram handle to RSVP.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('LOCK TABLE rsvps IN EXCLUSIVE MODE');
    const sessionResult = await client.query('SELECT max_players FROM sessions WHERE id = $1', [SESSION_ID]);
    const maxPlayers = sessionResult.rows[0]?.max_players || DEFAULT_MAX_PLAYERS;
    const countResult = await client.query('SELECT COUNT(*)::int AS count FROM rsvps WHERE session_id = $1', [SESSION_ID]);
    if (countResult.rows[0].count >= maxPlayers) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: `RSVP is closed. This game has reached ${maxPlayers} players.` });
    }

    const existing = await client.query('SELECT * FROM rsvps WHERE session_id = $1 AND instagram = $2', [SESSION_ID, instagram]);
    if (existing.rows[0]) {
      await client.query('COMMIT');
      return res.json({ player: existing.rows[0], rsvpCount: countResult.rows[0].count, maxPlayers, duplicate: true });
    }

    const slot = countResult.rows[0].count + 1;
    const insert = await client.query(
      `INSERT INTO rsvps (session_id, name, instagram, slot)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [SESSION_ID, name, instagram, slot]
    );
    await client.query('COMMIT');
    res.json({ player: insert.rows[0], rsvpCount: slot, maxPlayers });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});


app.post('/api/checkin', async (req, res) => {
  const instagram = normalizeInstagram(req.body.instagram);
  const submitted = cleanGameCode(req.body.gameCode || req.body.code);
  if (!instagram) return res.status(400).json({ error: 'Enter the Instagram handle used for RSVP.' });
  try {
    const session = await getSession();
    if (submitted !== session.settings.gameCode) return res.status(401).json({ error: 'Wrong game code.' });
    const rsvp = await query('SELECT * FROM rsvps WHERE session_id = $1 AND instagram = $2', [SESSION_ID, instagram]);
    if (!rsvp.rows[0]) return res.status(404).json({ error: 'No RSVP found for that Instagram handle. RSVP first.' });
    const player = rsvp.rows[0];
    const checkin = await query(
      `INSERT INTO checkins (session_id, rsvp_id, name, instagram)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (session_id, instagram)
       DO UPDATE SET rsvp_id = EXCLUDED.rsvp_id, name = EXCLUDED.name
       RETURNING *`,
      [SESSION_ID, player.id, player.name, player.instagram]
    );
    const checkinCount = await query('SELECT COUNT(*)::int AS count FROM checkins WHERE session_id = $1', [SESSION_ID]);
    res.json({ ok: true, player, checkin: checkin.rows[0], checkinCount: checkinCount.rows[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/share-click', async (req, res) => {
  const channel = safeText(req.body.channel || 'title', 30);
  try {
    await query('INSERT INTO share_clicks (session_id, channel) VALUES ($1, $2)', [SESSION_ID, channel]);
    const shareCount = await query('SELECT COUNT(*)::int AS count FROM share_clicks WHERE session_id = $1', [SESSION_ID]);
    res.json({ ok: true, shareClickCount: shareCount.rows[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/verify-code', async (req, res) => {
  try {
    const submitted = cleanGameCode(req.body.code);
    const session = await getSession();
    if (submitted !== session.settings.gameCode) return res.status(401).json({ ok: false, error: 'Wrong game code.' });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/api/host/settings', async (req, res) => {
  if (!requireHostPin(req, res)) return;
  const eventDate = safeText(req.body.date, 20);
  const eventTime = safeText(req.body.time, 20);
  const location = safeText(req.body.location, 80);
  const gameCode = cleanGameCode(req.body.gameCode);
  const maxPlayers = Math.max(1, Math.min(500, Number(req.body.maxPlayers || DEFAULT_MAX_PLAYERS)));
  try {
    await query(
      `UPDATE sessions
       SET event_date = $1, event_time = $2, location = $3, game_code = $4, max_players = $5, updated_at = NOW()
       WHERE id = $6`,
      [eventDate, eventTime, location, gameCode, maxPlayers, SESSION_ID]
    );
    res.json(await getSession());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/session/rsvps', async (req, res) => {
  if (!requireHostPin(req, res)) return;
  try {
    await query('DELETE FROM game_results WHERE session_id = $1', [SESSION_ID]);
    await query('DELETE FROM checkins WHERE session_id = $1', [SESSION_ID]);
    await query('DELETE FROM rsvps WHERE session_id = $1', [SESSION_ID]);
    res.json(await getSession());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/session/restore', async (req, res) => {
  if (!requireHostPin(req, res)) return;
  try {
    await query('DELETE FROM game_results WHERE session_id = $1', [SESSION_ID]);
    await query('DELETE FROM share_clicks WHERE session_id = $1', [SESSION_ID]);
    await query('DELETE FROM checkins WHERE session_id = $1', [SESSION_ID]);
    await query('DELETE FROM rsvps WHERE session_id = $1', [SESSION_ID]);
    await query(
      `UPDATE sessions
       SET event_date = '', event_time = '', location = '', game_code = $1, max_players = $2, updated_at = NOW()
       WHERE id = $3`,
      [DEFAULT_GAME_CODE, DEFAULT_MAX_PLAYERS, SESSION_ID]
    );
    res.json(await getSession());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/host/players', async (req, res) => {
  if (!requireHostPin(req, res)) return;
  try {
    const players = await query(
      `SELECT r.id, r.name, r.instagram, r.slot, r.created_at,
              c.created_at AS checked_in_at,
              gr.total_score, gr.rank, gr.created_at AS finished_at
       FROM rsvps r
       LEFT JOIN checkins c ON c.session_id = r.session_id AND c.instagram = r.instagram
       LEFT JOIN LATERAL (
         SELECT total_score, rank, created_at
         FROM game_results
         WHERE player_id = r.id
         ORDER BY created_at DESC
         LIMIT 1
       ) gr ON TRUE
       WHERE r.session_id = $1
       ORDER BY r.slot ASC`,
      [SESSION_ID]
    );
    const results = await query(
      `SELECT COUNT(*)::int AS finished_count, COALESCE(ROUND(AVG(total_score)::numeric, 1), 0) AS average_score
       FROM game_results WHERE session_id = $1`,
      [SESSION_ID]
    );
    const rsvps = await query('SELECT COUNT(*)::int AS count FROM rsvps WHERE session_id = $1', [SESSION_ID]);
    const checkins = await query('SELECT COUNT(*)::int AS count FROM checkins WHERE session_id = $1', [SESSION_ID]);
    const shares = await query('SELECT COUNT(*)::int AS count FROM share_clicks WHERE session_id = $1', [SESSION_ID]);
    res.json({
      players: players.rows,
      summary: {
        ...results.rows[0],
        rsvp_count: rsvps.rows[0].count,
        checkin_count: checkins.rows[0].count,
        share_click_count: shares.rows[0].count
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/results', async (req, res) => {
  const playerId = safeText(req.body.playerId, 80) || null;
  const playerName = safeText(req.body.playerName, 40);
  const instagram = normalizeInstagram(req.body.instagram);
  const puzzleScore = Math.max(0, Math.min(5, Number(req.body.puzzleScore || 0)));
  const quizScore = Math.max(0, Math.min(5, Number(req.body.quizScore || 0)));
  const totalScore = Math.max(0, Math.min(10, Number(req.body.totalScore || puzzleScore + quizScore)));
  const rank = safeText(req.body.rank, 60);
  const roundResults = Array.isArray(req.body.roundResults) ? req.body.roundResults : [];

  try {
    const result = await query(
      `INSERT INTO game_results (session_id, player_id, player_name, instagram, puzzle_score, quiz_score, total_score, rank, round_results)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
       RETURNING id, created_at`,
      [SESSION_ID, playerId, playerName, instagram, puzzleScore, quizScore, totalScore, rank, JSON.stringify(roundResults)]
    );
    res.json({ ok: true, result: result.rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Save the Day V9 running on port ${PORT}`));
  })
  .catch(error => {
    console.error('Database initialization failed:', error.message);
    app.listen(PORT, () => console.log(`Save the Day V9 running without database on port ${PORT}`));
  });

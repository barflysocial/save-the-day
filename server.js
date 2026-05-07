
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

const DEFAULT_SESSION_OPTIONS = [
  { id: 'session-1', label: 'Session 1', date: '', time: '', gameCode: 'SAVE1', maxPlayers: 50, status: 'open' },
  { id: 'session-2', label: 'Session 2', date: '', time: '', gameCode: 'SAVE2', maxPlayers: 50, status: 'open' },
  { id: 'session-3', label: 'Session 3', date: '', time: '', gameCode: 'SAVE3', maxPlayers: 50, status: 'open' }
];

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

function safeImageDataUrl(value, maxLength = 1800000) {
  const text = String(value || '').trim();
  if (!text.startsWith('data:image/')) return '';
  return text.slice(0, maxLength);
}

function cleanStatus(status) {
  const value = safeText(status || 'open', 20).toLowerCase();
  return ['open', 'checkin', 'started', 'closed'].includes(value) ? value : 'open';
}

function sanitizeSessionOptions(options = []) {
  const input = Array.isArray(options) ? options : [];
  const merged = [0, 1, 2].map(index => {
    const source = input[index] || DEFAULT_SESSION_OPTIONS[index];
    const fallback = DEFAULT_SESSION_OPTIONS[index];
    return {
      id: safeText(source.id || fallback.id, 40) || fallback.id,
      label: safeText(source.label || fallback.label, 40) || fallback.label,
      date: safeText(source.date, 20),
      time: safeText(source.time, 20),
      gameCode: cleanGameCode(source.gameCode || fallback.gameCode),
      maxPlayers: Math.max(1, Math.min(500, Number(source.maxPlayers || DEFAULT_MAX_PLAYERS))),
      status: cleanStatus(source.status || 'open')
    };
  });
  return merged;
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
      session_options JSONB NOT NULL DEFAULT '[]'::jsonb,
      logo_data_url TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await query("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS session_options JSONB NOT NULL DEFAULT '[]'::jsonb");
  await query("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS logo_data_url TEXT NOT NULL DEFAULT ''");

  await query(`
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
    )
  `);
  await query("ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS session_choice_id TEXT NOT NULL DEFAULT ''");
  await query("ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS session_choice_label TEXT NOT NULL DEFAULT ''");

  await query(`
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
    )
  `);
  await query("ALTER TABLE checkins ADD COLUMN IF NOT EXISTS session_choice_id TEXT NOT NULL DEFAULT ''");
  await query("ALTER TABLE checkins ADD COLUMN IF NOT EXISTS session_choice_label TEXT NOT NULL DEFAULT ''");

  await query(`
    CREATE TABLE IF NOT EXISTS share_clicks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      session_choice_id TEXT NOT NULL DEFAULT '',
      channel TEXT NOT NULL DEFAULT 'title',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await query("ALTER TABLE share_clicks ADD COLUMN IF NOT EXISTS session_choice_id TEXT NOT NULL DEFAULT ''");

  await query(`
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
    )
  `);
  await query("ALTER TABLE game_results ADD COLUMN IF NOT EXISTS session_choice_id TEXT NOT NULL DEFAULT ''");

  await query('CREATE INDEX IF NOT EXISTS idx_rsvps_session_choice ON rsvps(session_id, session_choice_id)');
  await query('CREATE INDEX IF NOT EXISTS idx_checkins_session_choice ON checkins(session_id, session_choice_id)');
  await query('CREATE INDEX IF NOT EXISTS idx_share_clicks_session_choice ON share_clicks(session_id, session_choice_id)');
  await query('CREATE INDEX IF NOT EXISTS idx_results_session_choice ON game_results(session_id, session_choice_id)');

  await query(`
    INSERT INTO sessions (id, event_date, event_time, location, game_code, max_players, session_options, logo_data_url)
    VALUES ($1, '', '', '', $2, $3, $4::jsonb, '')
    ON CONFLICT (id) DO NOTHING
  `, [SESSION_ID, DEFAULT_GAME_CODE, DEFAULT_MAX_PLAYERS, JSON.stringify(DEFAULT_SESSION_OPTIONS)]);

  const current = await query('SELECT session_options FROM sessions WHERE id = $1', [SESSION_ID]);
  const options = sanitizeSessionOptions(current.rows[0]?.session_options || []);
  if (!options.length || options.length < 3) {
    await query('UPDATE sessions SET session_options = $1::jsonb WHERE id = $2', [JSON.stringify(DEFAULT_SESSION_OPTIONS), SESSION_ID]);
  }
}

async function getSession() {
  const sessionResult = await query('SELECT * FROM sessions WHERE id = $1', [SESSION_ID]);
  if (!sessionResult.rows[0]) {
    await query(`INSERT INTO sessions (id, game_code, max_players, session_options, logo_data_url) VALUES ($1, $2, $3, $4::jsonb, '')`, [SESSION_ID, DEFAULT_GAME_CODE, DEFAULT_MAX_PLAYERS, JSON.stringify(DEFAULT_SESSION_OPTIONS)]);
    return getSession();
  }
  const session = sessionResult.rows[0];
  const options = sanitizeSessionOptions(session.session_options || DEFAULT_SESSION_OPTIONS);

  const rsvpRows = await query('SELECT session_choice_id, COUNT(*)::int AS count FROM rsvps WHERE session_id = $1 GROUP BY session_choice_id', [SESSION_ID]);
  const checkinRows = await query('SELECT session_choice_id, COUNT(*)::int AS count FROM checkins WHERE session_id = $1 GROUP BY session_choice_id', [SESSION_ID]);
  const shareRows = await query('SELECT session_choice_id, COUNT(*)::int AS count FROM share_clicks WHERE session_id = $1 GROUP BY session_choice_id', [SESSION_ID]);
  const resultRows = await query('SELECT session_choice_id, COUNT(*)::int AS count FROM game_results WHERE session_id = $1 GROUP BY session_choice_id', [SESSION_ID]);

  const countMap = rows => Object.fromEntries(rows.map(row => [row.session_choice_id || '', row.count]));
  const rsvps = countMap(rsvpRows.rows);
  const checkins = countMap(checkinRows.rows);
  const shares = countMap(shareRows.rows);
  const results = countMap(resultRows.rows);

  const enriched = options.map(option => {
    const rsvpCount = rsvps[option.id] || 0;
    const spotsLeft = Math.max(0, (option.maxPlayers || DEFAULT_MAX_PLAYERS) - rsvpCount);
    const computedStatus = option.status === 'open' && spotsLeft <= 0 ? 'full' : option.status;
    return {
      ...option,
      rsvpCount,
      checkinCount: checkins[option.id] || 0,
      shareClickCount: shares[option.id] || 0,
      resultCount: results[option.id] || 0,
      spotsLeft,
      computedStatus
    };
  });

  return {
    settings: {
      date: session.event_date || '',
      time: session.event_time || '',
      location: session.location || '',
      gameCode: cleanGameCode(session.game_code),
      sessionOptions: enriched,
      logoDataUrl: session.logo_data_url || ''
    },
    rsvpCount: Object.values(rsvps).reduce((a,b)=>a+b,0),
    checkinCount: Object.values(checkins).reduce((a,b)=>a+b,0),
    shareClickCount: Object.values(shares).reduce((a,b)=>a+b,0),
    maxPlayers: session.max_players || DEFAULT_MAX_PLAYERS,
    backendReady: true
  };
}

function findSessionOption(sessionData, sessionChoiceId) {
  const options = sanitizeSessionOptions(sessionData.settings.sessionOptions || []);
  return options.find(option => option.id === sessionChoiceId) || options[0];
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
  const sessionChoiceId = safeText(req.body.sessionChoiceId, 40);
  if (!name) return res.status(400).json({ error: 'Enter a player name to RSVP.' });
  if (!instagram) return res.status(400).json({ error: 'Enter an Instagram handle to RSVP.' });
  if (!sessionChoiceId) return res.status(400).json({ error: 'Choose a session before RSVPing.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('LOCK TABLE rsvps IN EXCLUSIVE MODE');

    const sessionResult = await client.query('SELECT * FROM sessions WHERE id = $1', [SESSION_ID]);
    const options = sanitizeSessionOptions(sessionResult.rows[0]?.session_options || DEFAULT_SESSION_OPTIONS);
    const option = options.find(item => item.id === sessionChoiceId);
    if (!option) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'That session is not available. Choose another session.' });
    }
    if (option.status === 'closed' || option.status === 'started') {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'That session is no longer accepting RSVPs.' });
    }

    const countResult = await client.query('SELECT COUNT(*)::int AS count FROM rsvps WHERE session_id = $1 AND session_choice_id = $2', [SESSION_ID, option.id]);
    if (countResult.rows[0].count >= option.maxPlayers) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: `This session is full. Choose another session.` });
    }

    const existing = await client.query('SELECT * FROM rsvps WHERE session_id = $1 AND instagram = $2', [SESSION_ID, instagram]);
    if (existing.rows[0]) {
      await client.query('COMMIT');
      const session = await getSession();
      return res.json({ player: existing.rows[0], session, duplicate: true });
    }

    const totalCount = await client.query('SELECT COUNT(*)::int AS count FROM rsvps WHERE session_id = $1', [SESSION_ID]);
    const slot = totalCount.rows[0].count + 1;
    const sessionChoiceLabel = safeText(req.body.sessionChoiceLabel, 80) || `${option.label}`;
    const insert = await client.query(
      `INSERT INTO rsvps (session_id, name, instagram, session_choice_id, session_choice_label, slot)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [SESSION_ID, name, instagram, option.id, sessionChoiceLabel, slot]
    );
    await client.query('COMMIT');
    const session = await getSession();
    res.json({ player: insert.rows[0], session, rsvpCount: session.rsvpCount, maxPlayers: session.maxPlayers });
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
  const sessionChoiceId = safeText(req.body.sessionChoiceId, 40);
  if (!instagram) return res.status(400).json({ error: 'Enter the Instagram handle used for RSVP.' });
  if (!sessionChoiceId) return res.status(400).json({ error: 'Choose your session before checking in.' });
  try {
    const session = await getSession();
    const option = (session.settings.sessionOptions || []).find(item => item.id === sessionChoiceId);
    if (!option) return res.status(404).json({ error: 'That session was not found.' });
    if (submitted !== cleanGameCode(option.gameCode)) return res.status(401).json({ error: 'Wrong game code for this session.' });

    const rsvp = await query('SELECT * FROM rsvps WHERE session_id = $1 AND instagram = $2', [SESSION_ID, instagram]);
    if (!rsvp.rows[0]) return res.status(404).json({ error: 'No RSVP found for that Instagram handle. RSVP first.' });
    const player = rsvp.rows[0];
    if (player.session_choice_id !== sessionChoiceId) return res.status(409).json({ error: `You RSVP'd for ${player.session_choice_label || 'another session'}. Choose that session to check in.` });

    const checkin = await query(
      `INSERT INTO checkins (session_id, rsvp_id, name, instagram, session_choice_id, session_choice_label)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (session_id, instagram)
       DO UPDATE SET rsvp_id = EXCLUDED.rsvp_id, name = EXCLUDED.name, session_choice_id = EXCLUDED.session_choice_id, session_choice_label = EXCLUDED.session_choice_label
       RETURNING *`,
      [SESSION_ID, player.id, player.name, player.instagram, player.session_choice_id || '', player.session_choice_label || '']
    );
    const updated = await getSession();
    res.json({ ok: true, player, checkin: checkin.rows[0], session: updated, checkinCount: updated.checkinCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/share-click', async (req, res) => {
  const channel = safeText(req.body.channel || 'title', 30);
  const sessionChoiceId = safeText(req.body.sessionChoiceId, 40);
  try {
    await query('INSERT INTO share_clicks (session_id, session_choice_id, channel) VALUES ($1, $2, $3)', [SESSION_ID, sessionChoiceId, channel]);
    const session = await getSession();
    res.json({ ok: true, session, shareClickCount: session.shareClickCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/verify-code', async (req, res) => {
  try {
    const submitted = cleanGameCode(req.body.code);
    const sessionChoiceId = safeText(req.body.sessionChoiceId, 40);
    const session = await getSession();
    const option = (session.settings.sessionOptions || []).find(item => item.id === sessionChoiceId) || findSessionOption(session, sessionChoiceId);
    if (submitted !== cleanGameCode(option.gameCode)) return res.status(401).json({ ok: false, error: 'Wrong game code for this session.' });
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
  const logoDataUrl = safeImageDataUrl(req.body.logoDataUrl);
  const maxPlayers = Math.max(1, Math.min(500, Number(req.body.maxPlayers || DEFAULT_MAX_PLAYERS)));
  const sessionOptions = sanitizeSessionOptions(req.body.sessionOptions || DEFAULT_SESSION_OPTIONS);
  try {
    await query(
      `UPDATE sessions
       SET event_date = $1, event_time = $2, location = $3, game_code = $4, max_players = $5, session_options = $6::jsonb, logo_data_url = $7, updated_at = NOW()
       WHERE id = $8`,
      [eventDate, eventTime, location, gameCode, maxPlayers, JSON.stringify(sessionOptions), logoDataUrl, SESSION_ID]
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

app.delete('/api/session/selected', async (req, res) => {
  if (!requireHostPin(req, res)) return;
  const sessionChoiceId = safeText(req.body.sessionChoiceId, 40);
  if (!sessionChoiceId) return res.status(400).json({ error: 'Choose a session to clear.' });
  try {
    await query('DELETE FROM game_results WHERE session_id = $1 AND session_choice_id = $2', [SESSION_ID, sessionChoiceId]);
    await query('DELETE FROM checkins WHERE session_id = $1 AND session_choice_id = $2', [SESSION_ID, sessionChoiceId]);
    await query('DELETE FROM rsvps WHERE session_id = $1 AND session_choice_id = $2', [SESSION_ID, sessionChoiceId]);
    await query('DELETE FROM share_clicks WHERE session_id = $1 AND session_choice_id = $2', [SESSION_ID, sessionChoiceId]);
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
       SET event_date = '', event_time = '', location = '', game_code = $1, max_players = $2, session_options = $3::jsonb, logo_data_url = '', updated_at = NOW()
       WHERE id = $4`,
      [DEFAULT_GAME_CODE, DEFAULT_MAX_PLAYERS, JSON.stringify(DEFAULT_SESSION_OPTIONS), SESSION_ID]
    );
    res.json(await getSession());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/host/players', async (req, res) => {
  if (!requireHostPin(req, res)) return;
  const filterSessionId = safeText(req.query.sessionId || '', 40);
  const filterClause = filterSessionId ? 'AND r.session_choice_id = $2' : '';
  const params = filterSessionId ? [SESSION_ID, filterSessionId] : [SESSION_ID];
  try {
    const players = await query(
      `SELECT r.id, r.name, r.instagram, r.slot, r.created_at, r.session_choice_id, r.session_choice_label,
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
       WHERE r.session_id = $1 ${filterClause}
       ORDER BY r.session_choice_id ASC, r.slot ASC`,
      params
    );

    const session = await getSession();
    const stats = session.settings.sessionOptions || [];
    const selected = filterSessionId ? stats.find(s => s.id === filterSessionId) : null;
    const summary = {
      rsvp_count: filterSessionId ? (selected?.rsvpCount || 0) : session.rsvpCount,
      checkin_count: filterSessionId ? (selected?.checkinCount || 0) : session.checkinCount,
      share_click_count: filterSessionId ? (selected?.shareClickCount || 0) : session.shareClickCount,
      finished_count: filterSessionId ? (selected?.resultCount || 0) : stats.reduce((sum, s) => sum + (s.resultCount || 0), 0),
      average_score: 0,
      session_stats: stats
    };
    res.json({ players: players.rows, summary });
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
  const sessionChoiceId = safeText(req.body.sessionChoiceId, 40);
  const roundResults = Array.isArray(req.body.roundResults) ? req.body.roundResults : [];

  try {
    const result = await query(
      `INSERT INTO game_results (session_id, session_choice_id, player_id, player_name, instagram, puzzle_score, quiz_score, total_score, rank, round_results)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)
       RETURNING id, created_at`,
      [SESSION_ID, sessionChoiceId, playerId, playerName, instagram, puzzleScore, quizScore, totalScore, rank, JSON.stringify(roundResults)]
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
    app.listen(PORT, () => console.log(`Save the Day V12 running on port ${PORT}`));
  })
  .catch(error => {
    console.error('Database initialization failed:', error.message);
    app.listen(PORT, () => console.log(`Save the Day V12 running without database on port ${PORT}`));
  });

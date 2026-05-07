# Save the Day V8 — Barfly Intro + Database Backend

This version keeps the full-stack PostgreSQL backend and adds a reusable Barfly intro animation before the title screen.

## What changed in V8

- Barfly neon swirl intro added
- Intro fades into the Save the Day title screen
- Skip Intro and Replay Intro controls added
- Node/Express backend retained
- PostgreSQL database support retained
- RSVP list is now shared across devices
- Player cap is enforced by the backend
- Host can update event date, time, location, game code, and player cap
- Host can clear the live RSVP session
- Host can restore the original state
- Final scores/ranks save to the database
- Host roster can show RSVP players and finished scores
- Browser fallback remains if the database is unavailable

## Demo defaults

- Game code: `SAVE`
- Local development host PIN: `1234`
- Production host PIN: set the `HOST_PIN` environment variable
- Player cap: `50`

## Files

- `index.html` — game UI
- `styles.css` — game styling
- `script.js` — frontend game logic + API calls
- `server.js` — Express API + PostgreSQL connection
- `database.sql` — database schema
- `package.json` — Node dependencies/scripts
- `.env.example` — environment variable example
- `render.yaml` — Render blueprint starter

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a PostgreSQL database and set your environment variables:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
HOST_PIN=your-private-pin
PORT=3000
```

3. Start the app:

```bash
npm start
```

4. Open:

```text
http://localhost:3000
```

The server automatically creates the database tables on startup. You can also run the schema manually:

```bash
psql $DATABASE_URL -f database.sql
```

## Render setup

Use this as a **Web Service**, not a Static Site.

1. Upload the unzipped V8 folder to GitHub.
2. In Render, create a PostgreSQL database.
3. Create a new Web Service from the GitHub repo.
4. Use:

```text
Build Command: npm install
Start Command: npm start
```

5. Add environment variables:

```text
DATABASE_URL = your Render PostgreSQL internal connection string
HOST_PIN = your private host PIN
NODE_ENV = production
```

6. Deploy.

## Main API routes

- `GET /api/session` — current event settings and RSVP count
- `POST /api/rsvp` — create player RSVP
- `POST /api/verify-code` — verify game code
- `POST /api/host/settings` — update host settings, requires host PIN
- `DELETE /api/session/rsvps` — clear RSVPs, requires host PIN
- `POST /api/session/restore` — restore original state, requires host PIN
- `GET /api/host/players` — host roster/results, requires host PIN
- `POST /api/results` — save final player score
- `GET /api/health` — database health check

## Important note

This is a functional prototype backend. For paid/public production use, add stronger host authentication, rate limiting, admin login, and per-event sessions so multiple venues can run different games at the same time.


## V8 Updates

- Adds a reusable **Barfly neon swirl intro** before the title screen.
- Intro fades in, shows **BARFLY**, displays **Barfly Presents**, teases **Save the Day**, then fades into the title screen.
- Adds a **Skip Intro** button for fast event testing.
- Adds a **Replay Intro** button on the title screen.
- Keeps the full V5 database backend: RSVP cap, game code, host PIN, host setup, roster/results, and PostgreSQL support.


## V8 add-on

- Added a shareable victory social media graphic for successful players
- Final screen now shows a social share preview when a player beats the game
- Added Download Graphic and Share Graphic buttons
- Uses the current RSVP player name in the victory message


## V8 add-on

- Added a square victory social post export
- Added an Instagram Story victory export
- Added a failed mission social graphic
- Result graphics now include Barfly branding, game title, player name, score, rank, and host event details (venue/location, date, time)
- Final screen includes preview controls for result graphics plus download/share actions

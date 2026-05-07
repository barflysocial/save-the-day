# Save the Day V12 — Host Logo Slot

V12 makes the three sessions truly separate while keeping one general public player link.

## Main URLs

- Player URL: `/player`
- Host URL: `/host`

The Share button still shares the general `/player` link so new players can choose any open session if one session is full.

## What changed in V12

- Three separate sessions
- Each session has its own:
  - date
  - time
  - game code
  - player cap
  - status
  - RSVP count
  - check-in count
  - share click count
  - roster/results filter
- Host can clear one selected session or clear all sessions
- Player session picker shows:
  - RSVP count
  - check-in count
  - spots left
  - status: Open, Check-In Open, Game Started, Closed, or Full
- Player-facing share uses the general `/player` URL
- Host dashboard can filter by All Sessions, Session 1, Session 2, or Session 3
- Keeps mobile-constrained layout, Barfly intro, database backend, RSVP, check-in, scoring, and social result graphics

## Demo defaults

- Session 1 code: `SAVE1`
- Session 2 code: `SAVE2`
- Session 3 code: `SAVE3`
- Local development host PIN: `1234`
- Production host PIN: set the `HOST_PIN` environment variable
- Default player cap per session: `50`

## Render setup

Use this as a **Web Service**, not a Static Site.

1. Upload the unzipped V12 folder to GitHub.
2. In Render, create a PostgreSQL database.
3. Create a new Web Service from the GitHub repo.
4. Use:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - `DATABASE_URL = your Render PostgreSQL internal connection string`
   - `HOST_PIN = your private host PIN`
   - `NODE_ENV = production`
6. Deploy.


V12 updates: host can upload a venue/event logo, preview it in host setup, remove it, and display it inside the Event Details card on the player title screen and related player screens.

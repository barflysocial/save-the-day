SAVE THE DAY V4 — HOST SESSION CONTROLS

This is a static HTML/CSS/JavaScript web prototype.

How to run:
1. Unzip the folder.
2. Open index.html in a browser.
3. Use the title screen to RSVP, enter the game code, or open Host Setup.

Default player game code:
SAVE

V4 updates:
- Host Setup screen added.
- Host can enter event date, time, location, and game code.
- Event details appear on the title/access screens and during gameplay.
- RSVP still collects name + Instagram.
- RSVP cap remains 50 players.
- RSVP closes for that player after they submit.
- Rounds remain 5 minutes each.
- Selected tools stay highlighted while in the build box.
- 10-second clue popup remains between rounds.
- Reset Current Player Game: clears gameplay progress but keeps the current RSVP.
- Clear RSVP Session: clears RSVP list and current check-in for this browser.
- Restore Original State: clears RSVPs, host setup details, and player progress.

Important static-site note:
The RSVP list, player cap, host settings, and resets use local browser storage. This is good for a playable prototype and testing. For a live event where multiple phones share the same 50-player cap, this needs to connect to a backend/database.


## V9 add-on

- Added a shareable victory social media graphic for successful players
- Final screen now shows a social share preview when a player beats the game
- Added Download Graphic and Share Graphic buttons
- Uses the current RSVP player name in the victory message


## V9 add-on

- Added a square victory social post export
- Added an Instagram Story victory export
- Added a failed mission social graphic
- Result graphics now include Barfly branding, game title, player name, score, rank, and host event details (venue/location, date, time)
- Final screen includes preview controls for result graphics plus download/share actions


## V9 add-on

- Added separate player-facing and host-only URL support
- Player URL: `/save-the-day`
- Host URL: `/save-the-day/host`
- Player title screen now only shows RSVP, Check In, and Share
- Barfly Social logo image fades in/out before the Save the Day title screen
- Title screen background was cleaned so the old Start Mission, How to Play, and bottom status text are removed
- Added database-backed check-ins
- Added database-backed share-click tracking
- Host dashboard now shows RSVP count, check-in count, share-click count, player roster, check-in status, and results

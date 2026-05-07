const DEFAULT_GAME_CODE = 'SAVE';
const MAX_PLAYERS = 50;
const INTRO_DURATION_MS = 5800;
const SHARE_MIN_SCORE = 6;
const SHARE_GAME_TITLE = 'SAVE THE DAY';
const SHARE_BRAND = 'BARFLY';
const RSVP_KEY = 'saveTheDayCurrentRsvpV4';
const RSVP_LIST_KEY = 'saveTheDayRsvpListV4';
const HOST_SETTINGS_KEY = 'saveTheDayHostSettingsV5';
const PLAYER_ID_KEY = 'saveTheDayPlayerIdV5';
const PLAYER_KEY = 'saveTheDayCurrentPlayerV5';
const LEGACY_KEYS = ['saveTheDayCurrentRsvpV3', 'saveTheDayRsvpListV3', 'saveTheDayCurrentRsvpV4', 'saveTheDayRsvpListV4', 'saveTheDayHostSettingsV4'];

const ITEM_BANK = {
  ductTape: { name: 'Duct Tape', icon: '🩹', use: 'Seals leaks, binds parts, and stabilizes quick repairs.' },
  paperClip: { name: 'Paper Clip', icon: '📎', use: 'Can bridge tiny contacts, pick latches, or hold a trigger in place.' },
  rope: { name: 'Rope', icon: '🪢', use: 'Useful for climbing, pulling, anchoring, or making a rescue line.' },
  flashlight: { name: 'Flashlight', icon: '🔦', use: 'Provides focused light and can power a signal or reveal hidden markings.' },
  battery: { name: 'Battery', icon: '🔋', use: 'Stores power for small circuits, sparks, transmitters, and lights.' },
  wire: { name: 'Copper Wire', icon: '🧵', use: 'Carries electricity and can tie together improvised circuits.' },
  oilCan: { name: 'Oil Can', icon: '🛢️', use: 'Lubricates stuck hinges, pulleys, gears, and mechanical locks.' },
  cloth: { name: 'Cloth Rag', icon: '🧻', use: 'Filters smoke, protects hands, absorbs liquid, or pads a tool grip.' },
  hook: { name: 'Metal Hook', icon: '🪝', use: 'Latches onto ledges, grates, handles, or objects out of reach.' },
  screwdriver: { name: 'Screwdriver', icon: '🪛', use: 'Opens panels, adjusts terminals, and removes covers.' },
  magnet: { name: 'Magnet', icon: '🧲', use: 'Retrieves metal pieces or triggers magnetic sensors.' },
  mirror: { name: 'Mirror Shard', icon: '🪞', use: 'Redirects light, checks blind corners, or reflects laser beams.' },
  rubberTube: { name: 'Rubber Tube', icon: '〰️', use: 'Moves air or liquid and can insulate a live wire.' },
  wrench: { name: 'Wrench', icon: '🔧', use: 'Turns valves, clamps bolts, and locks mechanical parts in place.' },
  fuse: { name: 'Fuse', icon: '⚡', use: 'Restores or redirects power when matched to the right circuit.' },
  glassJar: { name: 'Glass Jar', icon: '🥛', use: 'Holds liquid, smoke, chemical samples, or pressure safely.' },
  antenna: { name: 'Antenna', icon: '📡', use: 'Improves signal range for radio or tracking devices.' },
  whistle: { name: 'Whistle', icon: '📣', use: 'Creates a loud signal or distraction.' },
  glove: { name: 'Rubber Glove', icon: '🧤', use: 'Protects against heat, current, sharp edges, or chemicals.' },
  map: { name: 'Facility Map', icon: '🗺️', use: 'Reveals service tunnels, control rooms, and hidden exits.' }
};

const rounds = [
  {
    title: 'Stop the Boiler Blast',
    label: 'Round 1',
    seconds: 300,
    story: 'A pressure valve in the basement boiler is screaming. If it bursts, the whole lower level floods with steam and the hostage route closes forever.',
    objectives: ['Find the leaking valve', 'Create a temporary pressure seal', 'Keep the basement route open'],
    items: ['ductTape','paperClip','rope','flashlight','battery','wire','oilCan','cloth','hook','screwdriver','magnet','mirror'],
    tools: [
      {
        id: 'pressureSeal',
        option: 'A',
        name: 'Pressure Seal Patch',
        recipe: ['ductTape','cloth','wrench'],
        recipeFallback: ['ductTape','cloth','screwdriver'],
        description: 'A reinforced wrap that seals the pressure valve long enough to pass safely.',
        outcome: 'You wrap the valve, brace it tight, and the steam pressure drops. The basement route stays open.',
        correct: true
      },
      {
        id: 'sparkBypass',
        option: 'B',
        name: 'Spark Bypass Key',
        recipe: ['paperClip','battery','wire'],
        description: 'A tiny electrical bypass that can jump a low-voltage lock.',
        outcome: 'The bypass sparks, but the valve keeps climbing. The boiler ruptures and blocks the route.',
        correct: false
      }
    ],
    twist: 'Clue found: The pressure spike was triggered remotely from the security wing.'
  },
  {
    title: 'Escape the Laser Corridor',
    label: 'Round 2',
    seconds: 300,
    story: 'The next hallway is sealed by moving red beams. A wrong move triggers lockdown and traps the hostage deeper in the facility.',
    objectives: ['Analyze the laser path', 'Build a tool to control the beam', 'Reach the security door'],
    items: ['ductTape','paperClip','rope','flashlight','battery','wire','oilCan','cloth','hook','screwdriver','magnet','mirror'],
    tools: [
      {
        id: 'mirrorSignal',
        option: 'A',
        name: 'Mirror Signal Device',
        recipe: ['mirror','paperClip','battery','wire'],
        description: 'Reflects the beam into the control sensor to open a safe path.',
        outcome: 'The reflected beam hits the sensor. The lasers freeze in place and the corridor opens.',
        correct: true
      },
      {
        id: 'grapplingHook',
        option: 'B',
        name: 'Grappling Hook Launcher',
        recipe: ['rope','hook','oilCan','ductTape'],
        description: 'Fires a hook so you can swing past the beams.',
        outcome: 'The hook grabs, but the swing crosses a hidden sensor. The alarm locks the corridor.',
        correct: false
      }
    ],
    twist: 'Clue found: Someone wanted the rescue path to look possible, but every shortcut was booby-trapped.'
  },
  {
    title: 'Free the Elevator Cage',
    label: 'Round 3',
    seconds: 300,
    story: 'The hostage is moved upward in an old freight elevator. The cage jams halfway, and the motor starts smoking above an open shaft.',
    objectives: ['Stop the motor burn', 'Release the jammed brake', 'Keep the hostage from falling'],
    items: ['rope','hook','oilCan','cloth','screwdriver','magnet','mirror','rubberTube','wrench','fuse','battery','wire'],
    tools: [
      {
        id: 'manualBrakeRelease',
        option: 'A',
        name: 'Manual Brake Release',
        recipe: ['oilCan','wrench','screwdriver','cloth'],
        description: 'Lubricates and turns the brake assembly without snapping the cable.',
        outcome: 'The brake releases smoothly. The elevator cage lowers safely to the service platform.',
        correct: true
      },
      {
        id: 'magnetCableSnare',
        option: 'B',
        name: 'Magnet Cable Snare',
        recipe: ['magnet','rope','hook','wire'],
        description: 'Attempts to catch the cable and pull the cage sideways.',
        outcome: 'The cable jerks hard and the cage swings. You save time, but lose control of the elevator.',
        correct: false
      }
    ],
    twist: 'Clue found: The elevator sabotage used a maintenance-only brake command.'
  },
  {
    title: 'Send the Emergency Broadcast',
    label: 'Round 4',
    seconds: 300,
    story: 'Outside backup cannot reach you because the villain jammed every normal signal. You need one clear broadcast before the facility doors lock.',
    objectives: ['Restore signal range', 'Avoid the jammer', 'Send the rescue code'],
    items: ['flashlight','battery','wire','ductTape','paperClip','antenna','whistle','glassJar','mirror','map','fuse','screwdriver'],
    tools: [
      {
        id: 'emergencyTransmitter',
        option: 'A',
        name: 'Emergency Transmitter',
        recipe: ['battery','wire','antenna','paperClip','ductTape'],
        description: 'A crude transmitter that punches a short rescue code through the jammer.',
        outcome: 'The transmitter squeals, then cuts through the static. Backup receives your location.',
        correct: true
      },
      {
        id: 'signalFlareLamp',
        option: 'B',
        name: 'Signal Flare Lamp',
        recipe: ['flashlight','mirror','glassJar','fuse'],
        description: 'A bright visual signal meant to flash from the roof windows.',
        outcome: 'The lamp flashes bright, but the facility has no visible exterior windows from here.',
        correct: false
      }
    ],
    twist: 'Clue found: The jamming pattern is coming from inside the CEO safe room.'
  },
  {
    title: 'Shut Down Omega Protocol',
    label: 'Round 5',
    seconds: 300,
    story: 'The final door opens to the core control room. Omega Protocol is counting down. It will wipe the evidence and lock everyone inside.',
    objectives: ['Bypass the control panel', 'Stop the lockdown command', 'Rescue the hostage'],
    items: ['ductTape','paperClip','rope','flashlight','battery','wire','rubberTube','wrench','fuse','glove','map','screwdriver'],
    tools: [
      {
        id: 'safeCircuitBridge',
        option: 'A',
        name: 'Safe Circuit Bridge',
        recipe: ['glove','wire','fuse','screwdriver','battery'],
        description: 'Insulates the live panel and bridges the shutdown circuit safely.',
        outcome: 'The bridge catches. The countdown dies at one second, the doors unlock, and the hostage is free.',
        correct: true
      },
      {
        id: 'doorRamBrace',
        option: 'B',
        name: 'Door Ram Brace',
        recipe: ['rope','wrench','ductTape','rubberTube'],
        description: 'A leverage tool designed to force the control-room door open.',
        outcome: 'The brace bends the door frame, but Omega Protocol keeps running. The evidence starts deleting.',
        correct: false
      }
    ],
    twist: 'Final clue: The culprit is the person with access to the safe room, maintenance brake controls, and jammer.'
  }
];

// Add fallback items that are only needed in some rounds so every recipe can exist in that round inventory.
rounds[0].items = ['ductTape','paperClip','rope','flashlight','battery','wire','oilCan','cloth','hook','screwdriver','magnet','wrench'];

const quiz = [
  {
    q: 'Who caused the facility crisis?',
    options: ['A random intruder', 'The Omega Industries CEO', 'The hostage', 'The rescue pilot'],
    answer: 1
  },
  {
    q: 'What was the villain trying to do?',
    options: ['Hide evidence by triggering Omega Protocol', 'Steal the helicopter', 'Win a public contest', 'Drain the boiler for repairs'],
    answer: 0
  },
  {
    q: 'Which clue exposed the culprit?',
    options: ['A broken flashlight', 'The safe-room jammer pattern and maintenance-only commands', 'A rope left in the corridor', 'The color of the laser beams'],
    answer: 1
  },
  {
    q: 'What was the real danger at the end?',
    options: ['The evidence wipe and facility lockdown', 'A missing paper clip', 'A fake hostage note', 'An empty battery box'],
    answer: 0
  },
  {
    q: 'What final action saves the day?',
    options: ['Swing across the core room', 'Build the Safe Circuit Bridge and stop the countdown', 'Wait for backup only', 'Break the main door with a brace'],
    answer: 1
  }
];

const sessionCache = {
  settings: { date: '', time: '', location: '', gameCode: DEFAULT_GAME_CODE },
  rsvpCount: 0,
  maxPlayers: MAX_PLAYERS,
  backendReady: false,
  lastError: ''
};

const state = {
  screen: 'title',
  roundIndex: 0,
  puzzleScore: 0,
  quizScore: 0,
  selectedItems: [],
  builtTools: new Set(),
  activeTimer: null,
  clueTimer: null,
  timeLeft: 0,
  accessGranted: false,
  inspectedId: null,
  roundResults: []
};

const shareState = {
  assets: {},
  currentKey: '',
  currentLabel: 'Square Post'
};

const screen = document.getElementById('screen');
let introTimeout = null;

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function renderTemplate(id) {
  const tpl = document.getElementById(id);
  screen.innerHTML = '';
  screen.appendChild(tpl.content.cloneNode(true));
}


const DEFAULT_HOST_SETTINGS = {
  date: '',
  time: '',
  location: '',
  gameCode: DEFAULT_GAME_CODE
};

function cleanGameCode(value) {
  return (value || DEFAULT_GAME_CODE).trim().toUpperCase().replace(/\s+/g, '') || DEFAULT_GAME_CODE;
}

async function apiJson(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  let data = {};
  try { data = await response.json(); } catch (error) { data = {}; }
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data;
}

function applySessionCache(data) {
  if (!data || !data.settings) return;
  sessionCache.settings = {
    date: data.settings.date || '',
    time: data.settings.time || '',
    location: data.settings.location || '',
    gameCode: cleanGameCode(data.settings.gameCode || DEFAULT_GAME_CODE)
  };
  sessionCache.rsvpCount = Number(data.rsvpCount || 0);
  sessionCache.maxPlayers = Number(data.maxPlayers || MAX_PLAYERS);
  sessionCache.backendReady = Boolean(data.backendReady !== false);
  sessionCache.lastError = '';
}

async function refreshSession() {
  try {
    const data = await apiJson('/api/session');
    applySessionCache(data);
  } catch (error) {
    sessionCache.backendReady = false;
    sessionCache.lastError = error.message;
    const saved = safeReadStorage(HOST_SETTINGS_KEY, null);
    if (saved && typeof saved === 'object') {
      sessionCache.settings = {
        date: saved.date || '',
        time: saved.time || '',
        location: saved.location || '',
        gameCode: cleanGameCode(saved.gameCode || DEFAULT_GAME_CODE)
      };
    }
    const list = safeReadStorage(RSVP_LIST_KEY, []);
    sessionCache.rsvpCount = Array.isArray(list) ? list.length : 0;
    sessionCache.maxPlayers = MAX_PLAYERS;
  }
  return sessionCache;
}

function getHostSettings() {
  return sessionCache.settings || { ...DEFAULT_HOST_SETTINGS };
}

function saveHostSettings(settings) {
  const next = {
    date: settings.date || '',
    time: settings.time || '',
    location: (settings.location || '').trim(),
    gameCode: cleanGameCode(settings.gameCode || DEFAULT_GAME_CODE)
  };
  sessionCache.settings = next;
  return safeWriteStorage(HOST_SETTINGS_KEY, next);
}

function formatDisplayDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDisplayTime(timeValue) {
  if (!timeValue) return '';
  const [hoursRaw, minutesRaw] = timeValue.split(':');
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw || 0);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return timeValue;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function eventDetailsText(settings = getHostSettings()) {
  const parts = [];
  const date = formatDisplayDate(settings.date);
  const time = formatDisplayTime(settings.time);
  if (date) parts.push(date);
  if (time) parts.push(time);
  if (settings.location) parts.push(settings.location);
  return parts.length ? parts.join(' • ') : 'Host has not added date, time, or location yet.';
}

function eventDetailsMarkup(settings = getHostSettings()) {
  return `
    <span class="small-label">Event Details</span>
    <strong>${eventDetailsText(settings)}</strong>
  `;
}

function fillEventSummaries() {
  const settings = getHostSettings();
  const titleSummary = $('#title-event-summary');
  const accessSummary = $('#access-event-summary');
  const roundPill = $('#round-event-pill');
  if (titleSummary) titleSummary.innerHTML = eventDetailsMarkup(settings);
  if (accessSummary) accessSummary.innerHTML = eventDetailsMarkup(settings);
  if (roundPill) roundPill.textContent = eventDetailsText(settings);
  const codeHint = $('#code-hint');
  if (codeHint) codeHint.innerHTML = sessionCache.backendReady
    ? 'Ask the host for the current code.'
    : `Offline demo mode. Current code: <strong>${settings.gameCode}</strong>`;
  const dbBadge = $('#database-status');
  if (dbBadge) dbBadge.textContent = sessionCache.backendReady ? 'Database connected' : 'Offline browser fallback';
}

function getHostPin() {
  return ($('#host-pin')?.value || '').trim();
}


function safeReadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function safeWriteStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function getRsvpList() {
  const list = safeReadStorage(RSVP_LIST_KEY, []);
  return Array.isArray(list) ? list : [];
}

function getCurrentRsvp() {
  const player = safeReadStorage(PLAYER_KEY, null);
  if (player && player.name) return player;
  const rsvp = safeReadStorage(RSVP_KEY, null);
  return rsvp && rsvp.name ? rsvp : null;
}

function normalizeInstagram(handle) {
  const clean = handle.trim().replace(/^@+/, '');
  return clean ? `@${clean}` : '';
}

async function renderAccessGate() {
  clearTimer();
  clearClueTimer();
  clearIntroTimer();
  await refreshSession();
  state.screen = 'access';
  renderTemplate('access-template');
  fillEventSummaries();

  const current = getCurrentRsvp();
  const list = getRsvpList();
  const count = sessionCache.backendReady ? sessionCache.rsvpCount : Math.min(list.length, MAX_PLAYERS);
  const maxPlayers = sessionCache.maxPlayers || MAX_PLAYERS;
  const full = count >= maxPlayers && !current;

  $('#player-count').textContent = `${count} / ${maxPlayers}`;
  const backendNote = $('#backend-note');
  if (backendNote) backendNote.textContent = sessionCache.backendReady ? 'Live database RSVP count is active.' : 'Database is not connected, so RSVP is saved only in this browser.';

  const rsvpSection = $('#rsvp-section');
  const confirmedSection = $('#rsvp-confirmed');
  const codeSection = $('#code-section');

  if (current) {
    rsvpSection.hidden = true;
    confirmedSection.hidden = false;
    codeSection.hidden = false;
    $('#confirmed-copy').textContent = `${current.name} ${current.instagram ? `(${current.instagram})` : ''} is checked in. RSVP is now closed for this player.`;
    setTimeout(() => $('#game-code')?.focus(), 50);
  } else if (full) {
    rsvpSection.hidden = false;
    $('#rsvp-status').textContent = `RSVP is closed. This game has reached ${maxPlayers} players.`;
    $('#player-name').disabled = true;
    $('#player-instagram').disabled = true;
    $('[data-action="submit-rsvp"]').disabled = true;
    codeSection.hidden = true;
  } else {
    rsvpSection.hidden = false;
    confirmedSection.hidden = true;
    codeSection.hidden = true;
    setTimeout(() => $('#player-name')?.focus(), 50);
  }

  bindGlobalActions();
}


async function submitRsvp() {
  const nameInput = $('#player-name');
  const instagramInput = $('#player-instagram');
  const status = $('#rsvp-status');
  const name = nameInput.value.trim();
  const instagram = normalizeInstagram(instagramInput.value);

  if (!name) {
    status.textContent = 'Enter a player name to RSVP.';
    nameInput.focus();
    return;
  }
  if (!instagram) {
    status.textContent = 'Enter an Instagram handle to RSVP.';
    instagramInput.focus();
    return;
  }

  if (sessionCache.backendReady) {
    try {
      status.textContent = 'Saving RSVP to database...';
      const data = await apiJson('/api/rsvp', {
        method: 'POST',
        body: JSON.stringify({ name, instagram })
      });
      const player = {
        id: data.player.id,
        name: data.player.name,
        instagram: data.player.instagram,
        slot: data.player.slot,
        createdAt: data.player.created_at
      };
      safeWriteStorage(PLAYER_ID_KEY, player.id);
      safeWriteStorage(PLAYER_KEY, player);
      sessionCache.rsvpCount = Number(data.rsvpCount || sessionCache.rsvpCount);
      sessionCache.maxPlayers = Number(data.maxPlayers || sessionCache.maxPlayers);
      await renderAccessGate();
      return;
    } catch (error) {
      status.textContent = error.message;
      return;
    }
  }

  const list = getRsvpList();
  if (list.length >= MAX_PLAYERS) {
    status.textContent = 'RSVP is closed. This game has reached 50 players.';
    return;
  }

  const player = {
    name,
    instagram,
    slot: list.length + 1,
    createdAt: new Date().toISOString()
  };

  list.push(player);
  const savedList = safeWriteStorage(RSVP_LIST_KEY, list);
  const savedCurrent = safeWriteStorage(RSVP_KEY, player);
  safeWriteStorage(PLAYER_KEY, player);
  if (!savedList || !savedCurrent) {
    status.textContent = 'This browser blocked saved RSVP data. Try another browser or disable private mode.';
    return;
  }

  await renderAccessGate();
}


async function verifyGameCode() {
  const codeInput = $('#game-code');
  const status = $('#code-status');
  const current = getCurrentRsvp();
  if (!current) {
    status.textContent = 'RSVP first before entering the game code.';
    return;
  }
  const submitted = cleanGameCode(codeInput.value);

  if (sessionCache.backendReady) {
    try {
      await apiJson('/api/verify-code', {
        method: 'POST',
        body: JSON.stringify({ code: submitted })
      });
      state.accessGranted = true;
      startGame();
      return;
    } catch (error) {
      status.textContent = error.message || 'Wrong game code. Ask the host for the current code.';
      codeInput.select();
      return;
    }
  }

  const activeCode = getHostSettings().gameCode;
  if (submitted !== activeCode) {
    status.textContent = 'Wrong game code. Ask the host for the current code.';
    codeInput.select();
    return;
  }
  state.accessGranted = true;
  startGame();
}



async function renderHost() {
  clearTimer();
  clearClueTimer();
  clearIntroTimer();
  await refreshSession();
  state.screen = 'host';
  renderTemplate('host-template');
  const settings = getHostSettings();
  $('#host-date').value = settings.date;
  $('#host-time').value = settings.time;
  $('#host-location').value = settings.location;
  $('#host-game-code').value = settings.gameCode;
  const maxField = $('#host-max-players');
  if (maxField) maxField.value = sessionCache.maxPlayers || MAX_PLAYERS;
  const status = $('#host-status');
  if (status) status.textContent = sessionCache.backendReady ? 'Database connected. Host controls will affect the live session.' : 'Database is not connected. Host changes will only save in this browser.';
  fillEventSummaries();
  bindGlobalActions();
  setTimeout(() => $('#host-date')?.focus(), 50);
}

async function saveHostDetails() {
  const status = $('#host-status');
  const payload = {
    date: $('#host-date').value,
    time: $('#host-time').value,
    location: $('#host-location').value,
    gameCode: $('#host-game-code').value,
    maxPlayers: $('#host-max-players')?.value || MAX_PLAYERS,
    hostPin: getHostPin()
  };

  if (sessionCache.backendReady) {
    try {
      status.textContent = 'Saving host details to database...';
      const data = await apiJson('/api/host/settings', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      applySessionCache(data);
      status.textContent = 'Host details saved to database.';
      return;
    } catch (error) {
      status.textContent = error.message;
      return;
    }
  }

  const saved = saveHostSettings(payload);
  status.textContent = saved ? 'Host details saved in this browser.' : 'This browser blocked saved host settings.';
}

function resetCurrentPlayerGame() {
  clearTimer();
  clearClueTimer();
  state.roundIndex = 0;
  state.puzzleScore = 0;
  state.quizScore = 0;
  state.selectedItems = [];
  state.builtTools = new Set();
  state.activeTimer = null;
  state.clueTimer = null;
  state.timeLeft = 0;
  state.accessGranted = false;
  state.inspectedId = null;
  state.roundResults = [];
  const status = $('#host-status');
  if (status) status.textContent = 'Current player gameplay has been reset. RSVP stays saved.';
}

async function clearSession() {
  const ok = window.confirm('Clear all RSVPs for this session? This also removes the current player check-in on this device.');
  if (!ok) return;
  const status = $('#host-status');
  clearTimer();
  clearClueTimer();

  if (sessionCache.backendReady) {
    try {
      status.textContent = 'Clearing live database RSVPs...';
      const data = await apiJson('/api/session/rsvps', {
        method: 'DELETE',
        body: JSON.stringify({ hostPin: getHostPin() })
      });
      applySessionCache(data);
    } catch (error) {
      status.textContent = error.message;
      return;
    }
  } else {
    localStorage.removeItem(RSVP_LIST_KEY);
  }

  localStorage.removeItem(RSVP_LIST_KEY);
  localStorage.removeItem(RSVP_KEY);
  localStorage.removeItem(PLAYER_KEY);
  localStorage.removeItem(PLAYER_ID_KEY);
  resetCurrentPlayerGame();
  if (status) status.textContent = 'RSVP session cleared. Players can RSVP again from 0.';
}

async function restoreOriginalState() {
  const ok = window.confirm('Restore original state? This clears RSVPs, results, player progress, and host date/time/location settings.');
  if (!ok) return;
  const status = $('#host-status');
  clearTimer();
  clearClueTimer();

  if (sessionCache.backendReady) {
    try {
      status.textContent = 'Restoring live database session...';
      const data = await apiJson('/api/session/restore', {
        method: 'POST',
        body: JSON.stringify({ hostPin: getHostPin() })
      });
      applySessionCache(data);
    } catch (error) {
      status.textContent = error.message;
      return;
    }
  }

  [RSVP_LIST_KEY, RSVP_KEY, PLAYER_KEY, PLAYER_ID_KEY, HOST_SETTINGS_KEY, ...LEGACY_KEYS].forEach(key => localStorage.removeItem(key));
  resetCurrentPlayerGame();
  renderTitle();
}

async function loadHostRoster() {
  const status = $('#host-status');
  const list = $('#host-roster-list');
  const live = $('#host-live-status');
  if (!sessionCache.backendReady) {
    const localList = getRsvpList();
    if (live) live.textContent = `Offline fallback: ${localList.length} local RSVP(s).`;
    if (list) list.innerHTML = localList.map(player => `<div class="roster-row"><span>${player.slot}. ${player.name}</span><strong>${player.instagram}</strong></div>`).join('') || '<p class="small-hint">No local RSVPs yet.</p>';
    return;
  }
  try {
    status.textContent = 'Loading live roster...';
    const params = new URLSearchParams({ hostPin: getHostPin() });
    const data = await apiJson(`/api/host/players?${params.toString()}`);
    if (live) live.textContent = `${data.players.length} RSVP(s). ${data.summary.finished_count || 0} finished. Average score: ${data.summary.average_score || 0}.`;
    if (list) {
      list.innerHTML = data.players.map(player => `
        <div class="roster-row">
          <span>${player.slot}. ${player.name} <small>${player.instagram}</small></span>
          <strong>${player.rank ? `${player.total_score}/10 • ${player.rank}` : 'RSVP'}</strong>
        </div>
      `).join('') || '<p class="small-hint">No RSVPs yet.</p>';
    }
    status.textContent = 'Roster loaded.';
  } catch (error) {
    status.textContent = error.message;
  }
}


function clearIntroTimer() {
  if (introTimeout) {
    clearTimeout(introTimeout);
    introTimeout = null;
  }
}

function renderIntro(autoAdvance = true) {
  clearTimer();
  clearClueTimer();
  clearIntroTimer();
  state.screen = 'intro';
  renderTemplate('intro-template');
  bindGlobalActions();
  if (autoAdvance) {
    introTimeout = setTimeout(() => {
      introTimeout = null;
      renderTitle();
    }, INTRO_DURATION_MS);
  }
}

function renderTitle() {
  clearTimer();
  clearClueTimer();
  clearIntroTimer();
  state.screen = 'title';
  renderTemplate('title-template');
  fillEventSummaries();
  refreshSession().then(fillEventSummaries);
  bindGlobalActions();
}

function renderHow() {
  clearTimer();
  clearClueTimer();
  clearIntroTimer();
  renderTemplate('how-template');
  bindGlobalActions();
}

function startGame() {
  if (!getCurrentRsvp() || !state.accessGranted) {
    renderAccessGate();
    return;
  }
  clearClueTimer();
  state.roundIndex = 0;
  state.puzzleScore = 0;
  state.quizScore = 0;
  state.roundResults = [];
  renderRound();
}

function currentRound() {
  return rounds[state.roundIndex];
}

function recipeLength(tool) {
  return tool.recipe.length;
}

function recipeCountLabel(tool) {
  const main = tool.recipe.length;
  const fallback = tool.recipeFallback ? tool.recipeFallback.length : main;
  return main === fallback ? `${main} items` : `${Math.min(main, fallback)}-${Math.max(main, fallback)} items`;
}

function roundRecipeSummary(round) {
  return round.tools.map(tool => `Option ${tool.option}: ${recipeCountLabel(tool)}`).join(' • ');
}

function renderRecipeHelper(round) {
  const helper = $('#recipe-helper');
  if (!helper) return;
  const selected = state.selectedItems.length;
  const counts = [...new Set(round.tools.flatMap(tool => [tool.recipe.length, tool.recipeFallback ? tool.recipeFallback.length : tool.recipe.length]))].sort((a, b) => a - b);
  const closest = counts.find(count => count >= selected) || counts[counts.length - 1];
  const progressText = selected === 0 ? '0 items selected' : `${selected} item${selected === 1 ? '' : 's'} selected`;
  const ready = counts.includes(selected);
  helper.innerHTML = `
    <div class="recipe-count-card ${ready ? 'ready' : ''}">
      <span>Build Targets</span>
      <strong>${roundRecipeSummary(round)}</strong>
    </div>
    <div class="recipe-count-card ${ready ? 'ready' : ''}">
      <span>Build Box</span>
      <strong>${progressText}${selected > 0 ? ` / ${closest}` : ''}</strong>
    </div>
  `;
}

function renderRound() {
  clearTimer();
  clearClueTimer();
  clearIntroTimer();
  state.selectedItems = [];
  state.builtTools = new Set();
  state.inspectedId = null;
  renderTemplate('round-template');

  const round = currentRound();
  $('#round-label').textContent = round.label;
  $('#round-title').textContent = round.title;
  $('#round-story').textContent = round.story;
  $('#score').textContent = `${state.puzzleScore} / 5`;
  fillEventSummaries();

  const objectives = $('#objective-list');
  objectives.innerHTML = round.objectives.map(item => `<li>${item}</li>`).join('');

  renderInventory(round);
  renderBuildBox();
  renderRecipeHelper(round);
  renderChoices(round);
  bindRoundActions();
  startTimer(round.seconds);
}

function renderInventory(round) {
  const inventory = $('#inventory');
  inventory.innerHTML = round.items.map(id => {
    const item = ITEM_BANK[id];
    return `
      <button class="item-card" draggable="true" data-item="${id}" aria-label="${item.name}">
        <span class="item-icon">${item.icon}</span>
        <span class="item-name">${item.name}</span>
      </button>
    `;
  }).join('');

  $all('.item-card').forEach(card => {
    card.addEventListener('click', () => handleItemTap(card.dataset.item));
    card.addEventListener('dragstart', event => {
      event.dataTransfer.setData('text/plain', card.dataset.item);
    });
  });
  syncSelectedInventory();
}


function syncSelectedInventory() {
  $all('.item-card').forEach(card => {
    const itemId = card.dataset.item;
    card.classList.toggle('selected-in-build', state.selectedItems.includes(itemId));
    card.classList.toggle('selected-inspect', state.inspectedId === itemId);
  });
}

function handleItemTap(itemId) {
  inspectItem(itemId);
  if (!state.selectedItems.includes(itemId)) {
    addItemToBuild(itemId);
  }
}

function inspectItem(itemId) {
  state.inspectedId = itemId;
  const item = ITEM_BANK[itemId];
  $('#inspect-card').innerHTML = `
    <span class="small-label">Item Inspector</span>
    <h3>${item.icon} ${item.name}</h3>
    <p>${item.use}</p>
  `;
  syncSelectedInventory();
}

function addItemToBuild(itemId) {
  if (state.selectedItems.includes(itemId)) return;
  const maxRecipeItems = Math.max(...currentRound().tools.flatMap(tool => [tool.recipe.length, tool.recipeFallback ? tool.recipeFallback.length : tool.recipe.length]));
  if (state.selectedItems.length >= maxRecipeItems) {
    pulseBuildBox(`Too many items. This round only needs up to ${maxRecipeItems} items for a tool.`);
    return;
  }
  state.selectedItems.push(itemId);
  renderBuildBox();
}

function removeItemFromBuild(itemId) {
  state.selectedItems = state.selectedItems.filter(id => id !== itemId);
  renderBuildBox();
}

function renderBuildBox(message) {
  const buildBox = $('#build-box');
  if (!buildBox) return;
  if (state.selectedItems.length === 0) {
    buildBox.innerHTML = `<div class="empty-build">${message || 'Drop or tap items to add them here.'}</div>`;
  } else {
    buildBox.innerHTML = state.selectedItems.map(id => {
      const item = ITEM_BANK[id];
      return `
        <span class="built-chip">
          <span>${item.icon}</span>
          <span>${item.name}</span>
          <button aria-label="Remove ${item.name}" data-remove="${id}">×</button>
        </span>
      `;
    }).join('');
  }
  renderRecipeHelper(currentRound());
  syncSelectedInventory();
  $all('[data-remove]', buildBox).forEach(btn => {
    btn.addEventListener('click', () => removeItemFromBuild(btn.dataset.remove));
  });
}

function renderChoices(round) {
  const choices = $('#choices');
  choices.innerHTML = round.tools.map(tool => `
    <button class="tool-choice option-${tool.option.toLowerCase()} locked" data-tool="${tool.id}" disabled>
      <em>Option ${tool.option}</em>
      <strong>${tool.name}</strong>
      <span>${tool.description}</span>
      <span class="recipe-count">Build Requires: ${recipeCountLabel(tool)}</span>
      <span class="lock-copy">Build this tool to unlock choice.</span>
    </button>
  `).join('');
}

function bindRoundActions() {
  bindGlobalActions();

  $('[data-action="assemble"]').addEventListener('click', assembleTool);
  $('[data-action="clear"]').addEventListener('click', () => {
    state.selectedItems = [];
    $('#created-tool').hidden = true;
    renderBuildBox();
  });

  const buildBox = $('#build-box');
  buildBox.addEventListener('dragover', event => {
    event.preventDefault();
    buildBox.classList.add('drag-over');
  });
  buildBox.addEventListener('dragleave', () => buildBox.classList.remove('drag-over'));
  buildBox.addEventListener('drop', event => {
    event.preventDefault();
    buildBox.classList.remove('drag-over');
    const itemId = event.dataTransfer.getData('text/plain');
    if (itemId) {
      inspectItem(itemId);
      addItemToBuild(itemId);
    }
  });
}

function normalizeSet(ids) {
  return [...ids].sort().join('|');
}

function recipeMatches(selected, recipe) {
  return normalizeSet(selected) === normalizeSet(recipe);
}

function assembleTool() {
  const round = currentRound();
  const validCounts = new Set(round.tools.flatMap(tool => [tool.recipe.length, tool.recipeFallback ? tool.recipeFallback.length : tool.recipe.length]));
  if (state.selectedItems.length < 2) {
    pulseBuildBox('Add more items before assembling.');
    return;
  }
  if (!validCounts.has(state.selectedItems.length)) {
    const countText = [...validCounts].sort((a, b) => a - b).join(' or ');
    pulseBuildBox(`This round needs ${countText} items to build a tool.`);
    return;
  }

  const matched = round.tools.find(tool => {
    return recipeMatches(state.selectedItems, tool.recipe) || (tool.recipeFallback && recipeMatches(state.selectedItems, tool.recipeFallback));
  });

  if (!matched) {
    const box = $('#build-box');
    box.classList.remove('shake');
    void box.offsetWidth;
    box.classList.add('shake');
    showCreatedTool('No Stable Tool', 'Those parts do not create a useful tool for this situation.', false);
    return;
  }

  state.builtTools.add(matched.id);
  showCreatedTool(matched.name, matched.description, true);
  unlockChoice(matched.id);
  state.selectedItems = [];
  renderBuildBox('Tool built. Build the other option or choose now.');
}

function showCreatedTool(name, description, success) {
  const card = $('#created-tool');
  card.hidden = false;
  card.querySelector('h3').textContent = name;
  card.querySelector('p').textContent = description;
  card.style.borderColor = success ? 'rgba(111,255,154,.5)' : 'rgba(255,59,50,.75)';
}

function unlockChoice(toolId) {
  const button = $(`.tool-choice[data-tool="${toolId}"]`);
  if (!button) return;
  button.disabled = false;
  button.classList.remove('locked');
  button.classList.add('unlocked');
  const lockCopy = $('.lock-copy', button);
  if (lockCopy) lockCopy.textContent = 'Ready to choose.';
  button.addEventListener('click', () => chooseTool(toolId), { once: true });
}

function pulseBuildBox(message) {
  const box = $('#build-box');
  renderBuildBox(message);
  box.classList.remove('shake');
  void box.offsetWidth;
  box.classList.add('shake');
}

function chooseTool(toolId) {
  clearTimer();
  const round = currentRound();
  const tool = round.tools.find(t => t.id === toolId);
  const correct = Boolean(tool.correct);
  if (correct) state.puzzleScore += 1;
  state.roundResults.push({
    round: round.label,
    title: round.title,
    tool: tool.name,
    correct,
    twist: round.twist
  });
  renderRoundResult(correct, tool.outcome, round.twist);
}

function renderRoundResult(correct, outcome, twist) {
  clearTimer();
  clearClueTimer();
  renderTemplate('round-result-template');
  const panel = $('#result-panel');
  panel.classList.add(correct ? 'correct' : 'wrong');
  $('#result-label').textContent = `${currentRound().label} Clue Popup`;
  $('#result-title').textContent = correct ? 'Point Earned' : 'Wrong Tool';
  $('#result-copy').textContent = outcome;

  let clueSeconds = 10;
  const nextLabel = state.roundIndex === rounds.length - 1 ? 'Final Quiz' : 'Next Round';
  const nextBtn = $('#next-btn');
  nextBtn.disabled = true;

  function updateClueCountdown() {
    $('#result-score').innerHTML = `Puzzle Score: ${state.puzzleScore} / 5<br><span>${twist}</span><span class="clue-countdown">${nextLabel} in ${clueSeconds}</span>`;
    nextBtn.textContent = `${nextLabel} in ${clueSeconds}`;
  }

  function advance() {
    clearClueTimer();
    if (state.roundIndex === rounds.length - 1) {
      renderQuiz();
    } else {
      state.roundIndex += 1;
      renderRound();
    }
  }

  updateClueCountdown();
  state.clueTimer = setInterval(() => {
    clueSeconds -= 1;
    updateClueCountdown();
    if (clueSeconds <= 0) {
      advance();
    }
  }, 1000);
}

function startTimer(seconds) {
  state.timeLeft = seconds;
  updateTimerDisplay();
  state.activeTimer = setInterval(() => {
    state.timeLeft -= 1;
    updateTimerDisplay();
    if (state.timeLeft <= 0) {
      clearTimer();
      const round = currentRound();
      state.roundResults.push({
        round: round.label,
        title: round.title,
        tool: 'No tool chosen',
        correct: false,
        twist: round.twist
      });
      renderRoundResult(false, 'Time ran out. The situation got worse before you could commit to a solution.', round.twist);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timer = $('#timer');
  if (!timer) return;
  const min = Math.floor(state.timeLeft / 60).toString().padStart(2, '0');
  const sec = (state.timeLeft % 60).toString().padStart(2, '0');
  timer.textContent = `${min}:${sec}`;
}

function clearTimer() {
  if (state.activeTimer) {
    clearInterval(state.activeTimer);
    state.activeTimer = null;
  }
}

function clearClueTimer() {
  if (state.clueTimer) {
    clearInterval(state.clueTimer);
    state.clueTimer = null;
  }
}

function renderQuiz() {
  clearTimer();
  clearClueTimer();
  clearIntroTimer();
  renderTemplate('quiz-template');
  const form = $('#quiz-form');
  form.innerHTML = quiz.map((question, qIndex) => `
    <fieldset class="question-card">
      <h3>${qIndex + 1}. ${question.q}</h3>
      <div class="quiz-options">
        ${question.options.map((option, oIndex) => `
          <label class="quiz-option">
            <input type="radio" name="q${qIndex}" value="${oIndex}" required />
            <span>${option}</span>
          </label>
        `).join('')}
      </div>
    </fieldset>
  `).join('');
  bindGlobalActions();
}

function submitQuiz() {
  const form = $('#quiz-form');
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  state.quizScore = quiz.reduce((sum, question, index) => {
    return sum + (Number(data.get(`q${index}`)) === question.answer ? 1 : 0);
  }, 0);
  renderFinal();
}

function getRank(total) {
  if (total <= 3) return ['Failed Mission', 'The facility wins this round. You missed too many critical choices to save the day.'];
  if (total <= 5) return ['Barely Escaped', 'You made it out, but the mission was messy and the evidence trail nearly vanished.'];
  if (total <= 7) return ['Field Agent', 'Solid instincts. You solved enough of the action and case work to complete the mission.'];
  if (total <= 9) return ['Master Improviser', 'You built smart tools, read the clues, and stayed ahead of the villain.'];
  return ['Legendary Day Saver', 'Perfect mission. Every build, every choice, every deduction was on target.'];
}

function renderFinal() {
  clearIntroTimer();
  renderTemplate('final-template');
  const total = state.puzzleScore + state.quizScore;
  const [rank, summary] = getRank(total);
  $('#final-rank').textContent = rank;
  $('#final-summary').textContent = summary;
  $('#final-score').textContent = `${total} / 10 Total Points`;
  $('#breakdown').innerHTML = `
    <div class="breakdown-row"><span>Puzzle Rounds</span><strong>${state.puzzleScore} / 5</strong></div>
    <div class="breakdown-row"><span>Case Quiz</span><strong>${state.quizScore} / 5</strong></div>
    ${state.roundResults.map(result => `
      <div class="breakdown-row">
        <span>${result.round}: ${result.title}<br><small>${result.tool}</small></span>
        <strong>${result.correct ? '✓' : '✕'}</strong>
      </div>
    `).join('')}
  `;
  bindGlobalActions();
  prepareShareGraphic(total, rank);
  saveResultToBackend(rank, total);
}

async function saveResultToBackend(rank, total) {
  if (!sessionCache.backendReady) return;
  const current = getCurrentRsvp();
  if (!current) return;
  try {
    await apiJson('/api/results', {
      method: 'POST',
      body: JSON.stringify({
        playerId: current.id || safeReadStorage(PLAYER_ID_KEY, null),
        playerName: current.name || '',
        instagram: current.instagram || '',
        puzzleScore: state.puzzleScore,
        quizScore: state.quizScore,
        totalScore: total,
        rank,
        roundResults: state.roundResults
      })
    });
  } catch (error) {
    console.warn('Result was not saved to the database:', error.message);
  }
}

function getCurrentPlayerName() {
  const current = getCurrentRsvp();
  if (current?.name) return current.name;
  const saved = safeReadStorage(PLAYER_KEY, null);
  if (saved?.name) return saved.name;
  return 'Player';
}

function getCurrentInstagram() {
  const current = getCurrentRsvp();
  if (current?.instagram) return current.instagram;
  const saved = safeReadStorage(PLAYER_KEY, null);
  return saved?.instagram || '';
}

function getSafePlayerSlug() {
  return getCurrentPlayerName().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'player';
}

function getShareMeta(total, rank) {
  const settings = getHostSettings();
  return {
    success: total >= SHARE_MIN_SCORE,
    total,
    rank,
    playerName: getCurrentPlayerName(),
    instagram: getCurrentInstagram(),
    date: formatDisplayDate(settings.date) || 'Date TBD',
    time: formatDisplayTime(settings.time) || '',
    venue: settings.location || 'Venue TBD',
    details: eventDetailsText(settings),
    gameTitle: SHARE_GAME_TITLE,
    brand: SHARE_BRAND
  };
}

function fitFont(ctx, text, maxWidth, startSize, family = 'Arial', weight = 'bold') {
  let size = startSize;
  while (size > 18) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

function wrapTextLines(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawNeonPanel(ctx, x, y, w, h, glow, fill = 'rgba(8,16,34,0.78)') {
  ctx.save();
  ctx.shadowColor = glow;
  ctx.shadowBlur = 18;
  ctx.fillStyle = fill;
  ctx.strokeStyle = glow;
  ctx.lineWidth = 3;
  roundRect(ctx, x, y, w, h, 22);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawBackground(ctx, width, height, success) {
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#050814');
  bg.addColorStop(0.55, '#0a1030');
  bg.addColorStop(1, '#13071d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const glowA = ctx.createRadialGradient(width * 0.2, height * 0.2, 20, width * 0.2, height * 0.2, width * 0.45);
  glowA.addColorStop(0, success ? 'rgba(255,73,136,0.65)' : 'rgba(255,89,89,0.58)');
  glowA.addColorStop(1, 'rgba(255,73,136,0)');
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, width, height);

  const glowB = ctx.createRadialGradient(width * 0.78, height * 0.28, 30, width * 0.78, height * 0.28, width * 0.42);
  glowB.addColorStop(0, success ? 'rgba(41,219,255,0.52)' : 'rgba(117,181,255,0.42)');
  glowB.addColorStop(1, 'rgba(41,219,255,0)');
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i += 1) {
    ctx.beginPath();
    ctx.moveTo(0, (height / 8) * i + 0.5);
    ctx.lineTo(width, (height / 8) * i + 0.5);
    ctx.stroke();
  }

  ctx.save();
  ctx.strokeStyle = success ? 'rgba(255,80,130,0.24)' : 'rgba(255,88,88,0.26)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(width * 0.1, height * 0.17);
  ctx.lineTo(width * 0.5, height * 0.08);
  ctx.lineTo(width * 0.88, height * 0.17);
  ctx.stroke();
  ctx.restore();
}

function drawHeaderLockup(ctx, width, success, story = false) {
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7be8ff';
  ctx.font = `${story ? 26 : 24}px Arial`;
  ctx.fillText(`${SHARE_BRAND} PRESENTS`, width / 2, story ? 72 : 74);

  ctx.shadowColor = success ? 'rgba(255,77,140,0.9)' : 'rgba(255,82,82,0.9)';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#ff5b88';
  ctx.font = `bold ${story ? 58 : 52}px Arial`;
  ctx.fillText('SAVE', width / 2, story ? 140 : 140);
  ctx.shadowColor = 'rgba(73,210,255,0.9)';
  ctx.fillStyle = '#d7efff';
  ctx.font = `bold ${story ? 88 : 82}px Arial`;
  ctx.fillText('THE DAY', width / 2, story ? 215 : 220);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#59d4ff';
  ctx.font = `${story ? 24 : 22}px Arial`;
  ctx.fillText('An Improvised Escape Adventure', width / 2, story ? 252 : 256);
}

function drawEventStrip(ctx, width, height, meta, story = false) {
  const y = story ? 284 : 308;
  const h = story ? 96 : 92;
  const x = story ? 72 : 70;
  const w = width - x * 2;
  drawNeonPanel(ctx, x, y, w, h, 'rgba(58,214,255,0.45)');
  ctx.textAlign = 'left';
  ctx.fillStyle = '#91f0ff';
  ctx.font = `bold ${story ? 24 : 22}px Arial`;
  ctx.fillText('EVENT DETAILS', x + 24, y + 30);
  ctx.fillStyle = '#eef7ff';
  ctx.font = `${story ? 24 : 22}px Arial`;
  ctx.fillText(meta.venue, x + 24, y + 60, w - 48);
  const secondLine = [meta.date, meta.time].filter(Boolean).join(' • ');
  ctx.fillStyle = '#9fb6d7';
  ctx.font = `${story ? 22 : 20}px Arial`;
  ctx.fillText(secondLine || 'Date and time coming soon', x + 24, y + h - 18, w - 48);
}

function drawPlayerBlock(ctx, width, height, meta, success, story = false) {
  const x = story ? 72 : 70;
  const y = story ? 430 : 432;
  const w = width - x * 2;
  const h = story ? 390 : 320;
  drawNeonPanel(ctx, x, y, w, h, success ? 'rgba(255,85,138,0.45)' : 'rgba(255,90,90,0.45)');

  ctx.textAlign = 'center';
  ctx.fillStyle = success ? '#ff608f' : '#ff6b6b';
  ctx.font = `bold ${story ? 54 : 56}px Arial`;
  ctx.fillText(success ? 'MISSION COMPLETE' : 'MISSION FAILED', width / 2, y + 74);

  const nameY = y + (story ? 165 : 154);
  ctx.fillStyle = '#eef7ff';
  const maxName = w - 70;
  const nameSize = fitFont(ctx, meta.playerName.toUpperCase(), maxName, story ? 86 : 82);
  ctx.font = `bold ${nameSize}px Arial`;
  ctx.fillText(meta.playerName.toUpperCase(), width / 2, nameY, maxName);

  ctx.fillStyle = '#45d7ff';
  ctx.font = `bold ${story ? 52 : 48}px Arial`;
  ctx.fillText(success ? 'SAVED THE DAY' : 'TRY AGAIN', width / 2, nameY + 72);

  ctx.fillStyle = '#d0ddf7';
  ctx.font = `${story ? 30 : 28}px Arial`;
  const message = success
    ? 'You beat the game and completed the mission.'
    : 'The mission slipped away this time. Rebuild and try again.';
  const lines = wrapTextLines(ctx, message, w - 80);
  lines.forEach((line, index) => ctx.fillText(line, width / 2, nameY + 130 + (index * 34), w - 80));

  if (meta.instagram) {
    ctx.fillStyle = '#94f1ff';
    ctx.font = `${story ? 26 : 24}px Arial`;
    ctx.fillText(meta.instagram, width / 2, y + h - 28, w - 80);
  }
}

function drawScoreCards(ctx, width, height, meta, success, story = false) {
  const baseY = story ? 850 : 798;
  const cardH = story ? 160 : 150;
  const leftW = story ? 460 : 450;
  const rightW = story ? 320 : 300;
  const x1 = story ? 72 : 70;
  const x2 = width - rightW - (story ? 72 : 70);
  drawNeonPanel(ctx, x1, baseY, leftW, cardH, success ? 'rgba(255,85,138,0.38)' : 'rgba(255,90,90,0.4)');
  drawNeonPanel(ctx, x2, baseY, rightW, cardH, 'rgba(58,214,255,0.42)');

  ctx.textAlign = 'left';
  ctx.fillStyle = '#a1f1ff';
  ctx.font = `bold ${story ? 24 : 22}px Arial`;
  ctx.fillText('GAME TITLE', x1 + 24, baseY + 32);
  ctx.fillStyle = '#eff8ff';
  ctx.font = `bold ${story ? 34 : 32}px Arial`;
  ctx.fillText(SHARE_GAME_TITLE, x1 + 24, baseY + 78);
  ctx.fillStyle = '#aab8d3';
  ctx.font = `${story ? 21 : 20}px Arial`;
  const detailsLabel = meta.success ? 'BARFLY RESULT POST' : 'BARFLY RETRY POST';
  ctx.fillText(detailsLabel, x1 + 24, baseY + cardH - 22);

  ctx.textAlign = 'center';
  ctx.fillStyle = success ? '#ff648f' : '#ff6b6b';
  ctx.font = `bold ${story ? 74 : 70}px Arial`;
  ctx.fillText(`${meta.total}/10`, x2 + rightW / 2, baseY + 82);
  ctx.fillStyle = '#f1f8ff';
  ctx.font = `bold ${story ? 26 : 24}px Arial`;
  const rankLines = wrapTextLines(ctx, meta.rank.toUpperCase(), rightW - 40);
  rankLines.slice(0, 2).forEach((line, index) => ctx.fillText(line, x2 + rightW / 2, baseY + 116 + (index * 28), rightW - 40));
}

function drawFooter(ctx, width, height, meta, success, story = false) {
  ctx.textAlign = 'center';
  ctx.fillStyle = '#8ba6cc';
  ctx.font = `${story ? 20 : 18}px Arial`;
  const footer = success
    ? "You didn't just play. You made a difference."
    : 'Gear up, replay the mission, and save the day next time.';
  ctx.fillText(footer, width / 2, height - (story ? 42 : 36), width - 100);
}

function renderSocialGraphic(meta, format = 'square') {
  const story = format === 'story';
  const width = 1080;
  const height = story ? 1920 : 1080;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  drawBackground(ctx, width, height, meta.success);
  drawHeaderLockup(ctx, width, meta.success, story);
  drawEventStrip(ctx, width, height, meta, story);
  drawPlayerBlock(ctx, width, height, meta, meta.success, story);
  drawScoreCards(ctx, width, height, meta, meta.success, story);
  drawFooter(ctx, width, height, meta, meta.success, story);
  return canvas.toDataURL('image/png');
}

function setSharePreview(key) {
  if (!shareState.assets[key]) return;
  shareState.currentKey = key;
  const preview = $('#share-preview');
  const canvas = $('#share-canvas');
  const formatLabel = $('#share-format-label');
  if (preview) preview.src = shareState.assets[key].dataUrl;
  if (formatLabel) formatLabel.textContent = `${shareState.assets[key].label} preview`;
  if (canvas) {
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = shareState.assets[key].dataUrl;
  }
  $all('#share-actions button[data-preview-key]').forEach(btn => {
    btn.classList.toggle('active-preview', btn.dataset.previewKey === key);
  });
}

function renderShareButtons(success) {
  const actions = $('#share-actions');
  if (!actions) return;
  if (success) {
    actions.innerHTML = `
      <button class="ghost-btn" type="button" data-action="preview-square" data-preview-key="victory-square">Preview Square Post</button>
      <button class="ghost-btn" type="button" data-action="preview-story" data-preview-key="victory-story">Preview Story Post</button>
      <button class="primary-btn" type="button" data-action="download-current-share">Download Current Graphic</button>
      <button class="ghost-btn" type="button" data-action="share-graphic">Share Current Graphic</button>
    `;
  } else {
    actions.innerHTML = `
      <button class="ghost-btn" type="button" data-action="preview-failed" data-preview-key="failed-square">Preview Failed Mission Post</button>
      <button class="primary-btn" type="button" data-action="download-current-share">Download Failed Mission Graphic</button>
      <button class="ghost-btn" type="button" data-action="share-graphic">Share Current Graphic</button>
    `;
  }
}

function prepareShareGraphic(total, rank) {
  const panel = $('#share-panel');
  if (!panel) return;
  panel.hidden = false;
  const meta = getShareMeta(total, rank);
  shareState.assets = {};

  const kicker = $('#share-kicker');
  const headline = $('#share-headline');
  const copy = $('#share-copy');
  if (meta.success) {
    if (kicker) kicker.textContent = 'Shareable Victory Graphics';
    if (headline) headline.textContent = `${meta.playerName} saved the day`;
    if (copy) copy.textContent = 'Create a square post or Instagram Story with Barfly branding, game title, and your event details.';
    shareState.assets['victory-square'] = {
      label: 'Square Post',
      filename: `save-the-day-${getSafePlayerSlug()}-square-victory.png`,
      dataUrl: renderSocialGraphic(meta, 'square')
    };
    shareState.assets['victory-story'] = {
      label: 'Instagram Story',
      filename: `save-the-day-${getSafePlayerSlug()}-story-victory.png`,
      dataUrl: renderSocialGraphic(meta, 'story')
    };
    renderShareButtons(true);
    bindGlobalActions();
    setSharePreview('victory-square');
  } else {
    if (kicker) kicker.textContent = 'Shareable Failed Mission Graphic';
    if (headline) headline.textContent = `${meta.playerName} missed the mission`;
    if (copy) copy.textContent = 'Download a failed mission post with Barfly branding, game title, and event details for a replay challenge.';
    shareState.assets['failed-square'] = {
      label: 'Failed Mission Post',
      filename: `save-the-day-${getSafePlayerSlug()}-failed-mission.png`,
      dataUrl: renderSocialGraphic(meta, 'square')
    };
    renderShareButtons(false);
    bindGlobalActions();
    setSharePreview('failed-square');
  }
}

function downloadCurrentShareGraphic() {
  const current = shareState.assets[shareState.currentKey];
  if (!current) return;
  const link = document.createElement('a');
  link.href = current.dataUrl;
  link.download = current.filename;
  link.click();
}

async function shareGraphic() {
  const current = shareState.assets[shareState.currentKey];
  if (!current) return downloadCurrentShareGraphic();
  const res = await fetch(current.dataUrl);
  const blob = await res.blob();
  const file = new File([blob], current.filename, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: current.label,
      text: `${getCurrentPlayerName()} played ${SHARE_GAME_TITLE} by ${SHARE_BRAND}.`
    });
  } else {
    downloadCurrentShareGraphic();
  }
}

function bindGlobalActions() {
  $all('[data-action]').forEach(button => {
    const action = button.dataset.action;
    button.addEventListener('click', () => {
      if (action === 'start') startGame();
      if (action === 'access') renderAccessGate();
      if (action === 'intro') renderIntro(true);
      if (action === 'skip-intro') renderTitle();
      if (action === 'host') renderHost();
      if (action === 'save-host') saveHostDetails();
      if (action === 'reset-game') resetCurrentPlayerGame();
      if (action === 'clear-session') clearSession();
      if (action === 'restore-original') restoreOriginalState();
      if (action === 'load-roster') loadHostRoster();
      if (action === 'submit-rsvp') submitRsvp();
      if (action === 'verify-code') verifyGameCode();
      if (action === 'how') renderHow();
      if (action === 'title') renderTitle();
      if (action === 'restart') startGame();
      if (action === 'submit-quiz') submitQuiz();
      if (action === 'preview-square') setSharePreview('victory-square');
      if (action === 'preview-story') setSharePreview('victory-story');
      if (action === 'preview-failed') setSharePreview('failed-square');
      if (action === 'download-current-share') downloadCurrentShareGraphic();
      if (action === 'share-graphic') shareGraphic();
    });
  });
}

renderIntro();

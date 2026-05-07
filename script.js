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
    seconds: 180,
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
    seconds: 180,
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
    seconds: 180,
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
    seconds: 180,
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
    seconds: 180,
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

const state = {
  screen: 'title',
  roundIndex: 0,
  puzzleScore: 0,
  quizScore: 0,
  selectedItems: [],
  builtTools: new Set(),
  activeTimer: null,
  timeLeft: 0,
  inspectedId: null,
  roundResults: []
};

const screen = document.getElementById('screen');

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

function renderTitle() {
  clearTimer();
  state.screen = 'title';
  renderTemplate('title-template');
  bindGlobalActions();
}

function renderHow() {
  clearTimer();
  renderTemplate('how-template');
  bindGlobalActions();
}

function startGame() {
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
  state.selectedItems = [];
  state.builtTools = new Set();
  state.inspectedId = null;
  renderTemplate('round-template');

  const round = currentRound();
  $('#round-label').textContent = round.label;
  $('#round-title').textContent = round.title;
  $('#round-story').textContent = round.story;
  $('#score').textContent = `${state.puzzleScore} / 5`;

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
  $all('.item-card').forEach(card => {
    card.classList.toggle('selected-inspect', card.dataset.item === itemId);
  });
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
  renderTemplate('round-result-template');
  const panel = $('#result-panel');
  panel.classList.add(correct ? 'correct' : 'wrong');
  $('#result-label').textContent = currentRound().label;
  $('#result-title').textContent = correct ? 'Point Earned' : 'Wrong Tool';
  $('#result-copy').textContent = outcome;
  $('#result-score').innerHTML = `Puzzle Score: ${state.puzzleScore} / 5<br><span>${twist}</span>`;
  $('#next-btn').textContent = state.roundIndex === rounds.length - 1 ? 'Start Final Quiz' : 'Next Round';
  $('#next-btn').addEventListener('click', () => {
    if (state.roundIndex === rounds.length - 1) {
      renderQuiz();
    } else {
      state.roundIndex += 1;
      renderRound();
    }
  });
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

function renderQuiz() {
  clearTimer();
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
}

function bindGlobalActions() {
  $all('[data-action]').forEach(button => {
    const action = button.dataset.action;
    button.addEventListener('click', () => {
      if (action === 'start') startGame();
      if (action === 'how') renderHow();
      if (action === 'title') renderTitle();
      if (action === 'restart') startGame();
      if (action === 'submit-quiz') submitQuiz();
    });
  });
}

renderTitle();

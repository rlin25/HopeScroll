// ── Brutalist ASCII art definitions ──────────────────────────────────────────
// Each art is an array of {text, color} segments per line, joined with newlines.
// Colors: Y=#f0c040, DY=#b8860b, O=#e67e22, R=#c0392b, P=#7f5af0, T=#2cb67d, W=#e0e0e0, G=#606060

const C = {
  Y: '#f0c040', DY: '#b8860b', O: '#e67e22', R: '#c0392b',
  P: '#7f5af0', T: '#2cb67d', W: '#e0e0e0', G: '#404060',
  GR: '#2ecc71', B: '#3498db', CY: '#00bcd4', PK: '#e91e63'
};

function span(text, color) {
  return `<span style="color:${color}">${text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>`;
}

function art(lines) { return lines.join('\n'); }

const ASCII_LEMONS = {

  fresh: art([
    span('        ▄█▄        ', C.DY),
    span('    ▄█████████▄    ', C.DY),
    span('   ', C.DY) + span('█', C.DY) + span('███████████', C.Y) + span('█', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('  ', C.Y) + span('◈', C.W) + span('     ', C.Y) + span('◈', C.W) + span('  ', C.Y) + span('██', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('             ', C.Y) + span('██', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('    ', C.Y) + span('▲', C.Y) + span('      ', C.Y) + span('██', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('  ', C.Y) + span('╰─────╯', C.Y) + span('  ', C.Y) + span('██', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('             ', C.Y) + span('██', C.DY),
    span('   ', C.DY) + span('█', C.DY) + span('███████████', C.Y) + span('█', C.DY),
    span('    ▀█████████▀    ', C.DY),
  ]),

  slightly_wilted: art([
    span('        ▄█▄        ', C.DY),
    span('    ▄█████████▄    ', C.DY),
    span('   ', C.DY) + span('█', C.DY) + span('███████████', C.Y) + span('█', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('  ', C.Y) + span('◉', C.W) + span('     ', C.Y) + span('◉', C.W) + span('  ', C.Y) + span('██', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('             ', C.Y) + span('██', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('    ', C.Y) + span('▾', C.DY) + span('      ', C.Y) + span('██', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('  ', C.Y) + span('╭─────╮', C.DY) + span('  ', C.Y) + span('██', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('  ', C.Y) + span('░░░░░░░', C.G)  + span('  ', C.Y) + span('██', C.DY),
    span('   ', C.DY) + span('█', C.DY) + span('███████████', C.Y) + span('█', C.DY),
    span('    ▀█████████▀    ', C.DY),
  ]),

  faded: art([
    span('        ▄░▄        ', C.G),
    span('    ▄░░░░░░░░░▄    ', C.G),
    span('   ', C.G)  + span('░', C.G)  + span('░', C.G) + span(' . . . . . ', C.G) + span('░', C.G) + span('░', C.G),
    span('  ', C.G)   + span('░░', C.G) + span(' ', C.G)  + span('•', C.W)   + span('  . . .  ', C.G) + span('•', C.W) + span(' ', C.G) + span('░░', C.G),
    span('  ', C.G)   + span('░░', C.G) + span(' . . . . . . .', C.G)        + span('░░', C.G),
    span('  ', C.G)   + span('░░', C.G) + span(' . . ', C.G) + span('▾', C.G) + span(' . . . ', C.G)  + span('░░', C.G),
    span('  ', C.G)   + span('░░', C.G) + span(' . ', C.G)   + span('╭─────╮', C.G) + span(' . ', C.G) + span('░░', C.G),
    span('  ', C.G)   + span('░░', C.G) + span(' . . . . . . .', C.G)        + span('░░', C.G),
    span('   ', C.G)  + span('░', C.G)  + span('░░░░░░░░░░░', C.G) + span('░', C.G),
    span('    ▀░░░░░░░░░▀    ', C.G),
  ]),

  brown_spots: art([
    span('        ▄█▄        ', C.DY),
    span('    ▄██', C.DY) + span('▓▓', C.O) + span('█', C.DY) + span('▓▓', C.O) + span('███▄    ', C.DY),
    span('   ', C.DY) + span('█', C.DY) + span('█', C.DY) + span('▓', C.O) + span('█████', C.Y) + span('▓', C.O) + span('██', C.DY) + span('█', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('  ', C.Y) + span('►', C.R) + span('     ', C.Y) + span('◄', C.R) + span('  ', C.Y) + span('██', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('  ', C.Y) + span('▓', C.O) + span('         ', C.Y) + span('██', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('    ', C.Y) + span('━━━━━', C.R) + span('    ', C.Y) + span('██', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('  ', C.Y) + span('▓', C.O) + span('  ', C.Y) + span('▓', C.O) + span('   ', C.Y) + span('▓', C.O) + span('  ', C.Y) + span('██', C.DY),
    span('   ', C.DY) + span('█', C.DY) + span('███', C.DY) + span('▓', C.O) + span('█████', C.Y) + span('▓', C.O) + span('█', C.DY),
    span('    ▀██', C.DY) + span('▓▓', C.O) + span('█', C.DY) + span('▓▓', C.O) + span('███▀    ', C.DY),
  ]),

  cracked: art([
    span('        ▄█▄        ', C.G),
    span('    ▄████', C.G) + span('\\', C.W) + span('████▄    ', C.G),
    span('   ', C.G) + span('█', C.G) + span('████', C.G) + span('/', C.W) + span('\\', C.W) + span('████', C.G) + span('█', C.G),
    span('  ', C.G) + span('██', C.G) + span('  ', C.G) + span(';', C.W) + span('     ', C.G) + span(';', C.W) + span('  ', C.G) + span('██', C.G),
    span('  ', C.G) + span('██', C.G) + span('   ', C.G) + span('_', C.W) + span('       ', C.G) + span('██', C.G),
    span('  ', C.G) + span('██', C.G) + span('  ', C.G) + span('╰──', C.G) + span('\\/', C.W) + span('──╯', C.G) + span('  ', C.G) + span('██', C.G),
    span('  ', C.G) + span('██', C.G) + span('   ', C.G) + span('/\\', C.W) + span('      ', C.G) + span('██', C.G),
    span('   ', C.G) + span('█', C.G) + span('████', C.G) + span('\\/', C.W) + span('████', C.G) + span('█', C.G),
    span('    ▀████', C.G) + span('/\\', C.W) + span('████▀    ', C.G),
  ]),

  moldy: art([
    span('      ', C.T) + span('~▄~', C.T) + span('      ', C.T),
    span('   ', C.T) + span('~▄', C.T) + span('█████', C.T) + span('▄~   ', C.T),
    span('  ', C.T) + span('~', C.T) + span('█', C.T) + span('~~', C.T) + span('█████', C.T) + span('~~', C.T) + span('█', C.T) + span('~  ', C.T),
    span('  ', C.T) + span('~~', C.T) + span('  ', C.T) + span('¬', C.T) + span('     ', C.T) + span('¬', C.T) + span('  ', C.T) + span('~~', C.T),
    span('  ', C.T) + span('~~', C.T) + span('  ', C.T) + span('~', C.T) + span('       ', C.T) + span('~~', C.T),
    span('  ', C.T) + span('~~', C.T) + span('   ', C.T) + span('═════', C.P) + span('   ', C.T) + span('~~', C.T),
    span('  ', C.T) + span('~~', C.T) + span(' ', C.T) + span('~', C.T) + span('  ', C.T) + span('~', C.T) + span('  ', C.T) + span('~', C.T) + span('  ', C.T) + span('~~', C.T),
    span('  ', C.T) + span('~', C.T) + span('█', C.T) + span('~~', C.T) + span('█████', C.T) + span('~~', C.T) + span('█', C.T) + span('~  ', C.T),
    span('   ', C.T) + span('~▀', C.T) + span('█████', C.T) + span('▀~   ', C.T),
  ]),

  glowing: art([
    span('   ', C.Y) + span('✦', C.W) + span('  ', C.Y)  + span('▄█▄', C.Y)  + span('  ', C.Y)  + span('✦', C.W) + span('   ', C.Y),
    span(' ', C.Y)  + span('✦', C.W) + span('  ▄█████████▄  ', C.Y) + span('✦', C.W),
    span('    ', C.Y) + span('█', C.DY) + span('███████████', C.Y) + span('█', C.DY),
    span('   ', C.Y)  + span('██', C.DY) + span('  ', C.Y) + span('◈', C.W) + span('     ', C.Y) + span('◈', C.W) + span('  ', C.Y) + span('██', C.DY),
    span('   ', C.Y)  + span('██', C.DY) + span('             ', C.Y) + span('██', C.DY),
    span('   ', C.Y)  + span('██', C.DY) + span('    ', C.Y) + span('▲', C.W) + span('      ', C.Y) + span('██', C.DY),
    span('   ', C.Y)  + span('██', C.DY) + span('  ', C.Y) + span('╰─────╯', C.W) + span('  ', C.Y) + span('██', C.DY),
    span('    ', C.Y) + span('█', C.DY) + span('███████████', C.Y) + span('█', C.DY),
    span(' ', C.Y) + span('✦', C.W) + span('  ▀█████████▀  ', C.Y) + span('✦', C.W),
    span('   ', C.Y) + span('✦', C.W) + span('           ', C.Y) + span('✦', C.W),
  ]),

  armored_helmet: art([
    span('      ┌─────┐      ', C.B),
    span('      │', C.B) + span('█████', C.W) + span('│      ', C.B),
    span('      │', C.B) + span('█', C.W) + span('[ + ]', C.Y) + span('█', C.W) + span('│      ', C.B),
    span('      │', C.B) + span('█████', C.W) + span('│      ', C.B),
    span('      └──┬──┘      ', C.B),
    span('        ▄█▄        ', C.DY),
    span('    ▄█████████▄    ', C.DY),
    span('   ', C.DY) + span('█', C.DY) + span('███████████', C.Y) + span('█', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('  ', C.Y) + span('◈', C.W) + span('     ', C.Y) + span('◈', C.W) + span('  ', C.Y) + span('██', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('    ', C.Y) + span('╰───╯', C.Y) + span('    ', C.Y) + span('██', C.DY),
    span('    ▀█████████▀    ', C.DY),
  ]),

  armored_sword_shield: art([
    span('      ┌─────┐      ', C.B),
    span('      │', C.B) + span('█████', C.W) + span('│    ', C.B) + span('/|', C.W),
    span('      │', C.B) + span('█[⚔]█', C.Y) + span('│', C.B) + span('  ', C.B) + span('+-+', C.W),
    span('      │', C.B) + span('█████', C.W) + span('│    ', C.B) + span('\\|', C.W),
    span('      └──┬──┘      ', C.B),
    span('        ▄█▄        ', C.DY),
    span('    ▄█████████▄    ', C.DY),
    span('   ', C.DY) + span('█', C.DY) + span('███████████', C.Y) + span('█', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('  ', C.Y) + span('◈', C.W) + span('     ', C.Y) + span('◈', C.W) + span('  ', C.Y) + span('██', C.DY),
    span('  ', C.DY) + span('██', C.DY) + span('    ', C.Y) + span('╰───╯', C.Y) + span('    ', C.Y) + span('██', C.DY),
    span('    ▀█████████▀    ', C.DY),
  ]),

  wilted: art([
    span('        ▄▒▄        ', C.G),
    span('    ▄▒▒▒▒▒▒▒▒▒▄    ', C.G),
    span('   ', C.G) + span('▒', C.G) + span('▒▒▒▒▒▒▒▒▒▒▒', C.G) + span('▒', C.G),
    span('  ', C.G) + span('▒▒', C.G) + span('  ', C.G) + span('·', C.G) + span('     ', C.G) + span('·', C.G) + span('  ', C.G) + span('▒▒', C.G),
    span('  ', C.G) + span('▒▒', C.G) + span('             ', C.G) + span('▒▒', C.G),
    span('  ', C.G) + span('▒▒', C.G) + span('   ', C.G) + span('▾▾▾▾▾', C.G) + span('   ', C.G) + span('▒▒', C.G),
    span('  ', C.G) + span('▒▒', C.G) + span('             ', C.G) + span('▒▒', C.G),
    span('   ', C.G) + span('▒', C.G) + span('▒▒▒▒▒▒▒▒▒▒▒', C.G) + span('▒', C.G),
    span('    ▀▒▒▒▒▒▒▒▒▒▀    ', C.G),
  ]),
};

const STATE_LABELS = {
  fresh:               'YOUR LEMON IS FRESH AND READY.',
  slightly_wilted:     'YOUR LEMON LOOKS A BIT TIRED.',
  wilted:              'YOUR LEMON IS WILTING.',
  faded:               'YOUR LEMON IS LOOKING FADED.',
  brown_spots:         'YOUR LEMON HAS DEVELOPED DARK SPOTS.',
  cracked:             'YOUR LEMON HAS TAKEN SOME CRACKS.',
  moldy:               'YOUR LEMON HAS MOLD CREEPING IN.',
  glowing:             'YOUR LEMON IS GLOWING.',
  armored_helmet:      'YOUR LEMON EARNED A HELMET. RESILIENT.',
  armored_sword_shield:'YOUR LEMON IS BATTLE-READY.',
  wilted:              'YOUR LEMON IS WILTING.',
};

function generateLemon(lemonState, armorLevel = 0) {
  const { condition, intensity_level } = lemonState;
  let eff = condition;
  if (armorLevel >= 2 && ['fresh','glowing'].includes(condition)) eff = 'armored_sword_shield';
  else if (armorLevel >= 1 && ['fresh','glowing'].includes(condition)) eff = 'armored_helmet';
  const neg = ['slightly_wilted','wilted','faded','brown_spots','cracked','moldy'];
  let label = STATE_LABELS[eff] || 'YOUR LEMON IS HERE.';
  if (neg.includes(eff) && intensity_level >= 5) label = label.replace('.', ' — HEAVILY.');
  else if (neg.includes(eff) && intensity_level >= 4) label = label.replace('.', ' — QUITE A BIT.');
  return { html: ASCII_LEMONS[eff] || ASCII_LEMONS.fresh, label };
}

// ── Journey map renderer ──────────────────────────────────────────────────────
function renderJourneyMap(beforeEm, afterEm) {
  if (!beforeEm || !afterEm) return;

  const setDot = (id, labelId, x, y, text) => {
    const dot = document.getElementById(id);
    dot.style.left = `${x}%`;
    dot.style.top  = `${y}%`;
    const lbl = document.getElementById(labelId);
    lbl.style.left = `${x}%`;
    lbl.style.top  = `${y}%`;
    lbl.textContent = text;
  };

  setDot('dot-before', 'label-before', beforeEm.x, beforeEm.y, beforeEm.label);
  setDot('dot-after',  'label-after',  afterEm.x,  afterEm.y,  afterEm.label);

  // Draw arrow in SVG
  const svg = document.getElementById('journey-svg');
  const map = document.getElementById('journey-map');
  const w = map.clientWidth || 460;
  const h = map.clientHeight || 220;

  const x1 = (beforeEm.x / 100) * w;
  const y1 = (beforeEm.y / 100) * h;
  const x2 = (afterEm.x  / 100) * w;
  const y2 = (afterEm.y  / 100) * h;

  // Shorten arrow so it doesn't overlap dots
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx*dx + dy*dy) || 1;
  const pad = 10;
  const sx = x1 + (dx/len)*pad, sy = y1 + (dy/len)*pad;
  const ex = x2 - (dx/len)*pad, ey = y2 - (dy/len)*pad;

  svg.innerHTML = `
    <defs>
      <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#2cb67d88"/>
      </marker>
    </defs>
    <line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}"
          stroke="#2cb67d44" stroke-width="1.5" stroke-dasharray="4,3"
          marker-end="url(#arrowhead)"/>
  `;
}

// ── Content analysis display ─────────────────────────────────────────────────
function displayContentAnalysis(ca) {
  const section = document.getElementById('content-analysis');
  if (!ca || ca.videos_analyzed === 0) { section.style.display = 'none'; return; }
  section.style.display = 'block';

  document.getElementById('videos-count').textContent =
    `${ca.videos_analyzed} video${ca.videos_analyzed !== 1 ? 's' : ''}`;
  document.getElementById('dominant-badge').textContent =
    (ca.dominant_sentiment || '').toUpperCase();

  const emojiMap = {
    outrage:'😡', anxiety:'😰', sadness:'😢',
    envy:'🟢', inspiration:'✨', joy:'😂', neutral:'😐'
  };
  const breakdown = ca.sentiment_breakdown || {};
  document.getElementById('sentiment-breakdown').innerHTML =
    Object.entries(breakdown)
      .filter(([,n]) => n > 0)
      .sort((a,b) => b[1]-a[1])
      .map(([s,n]) => `<span class="breakdown-item">${emojiMap[s]||''} ${s}: ${n}</span>`)
      .join('');

  document.getElementById('content-vs-experience').textContent = ca.content_vs_experience || '';
}

// ── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  let lemonState, narrativeSummary, observationQuestion, contentAnalysis;
  let feelingBefore, feelingAfter, beforeCoords, afterCoords, armorLevel = 0;

  if (typeof chrome !== 'undefined' && chrome.storage) {
    const data = await chrome.storage.local.get(['current_session','user_progression']);
    const s = data.current_session;
    if (!s) { document.getElementById('ascii-art').textContent = 'No session data found.'; return; }

    lemonState          = s.lemon_state;
    narrativeSummary    = s.narrative_summary;
    observationQuestion = s.observation_question;
    contentAnalysis     = s.content_analysis;
    feelingBefore = s.intention?.feeling_intended;
    beforeCoords  = s.intention?.feeling_intended_coords;
    feelingAfter  = s.feeling_actual;
    afterCoords   = s.feeling_actual_coords;
    armorLevel          = data.user_progression?.armor_level || 0;
  } else {
    const stored = sessionStorage.getItem('lemon_result');
    if (!stored) { document.getElementById('ascii-art').textContent = 'No session data.'; return; }
    const r = JSON.parse(stored);
    lemonState = r.lemonState; narrativeSummary = r.narrativeSummary;
    observationQuestion = r.observationQuestion; contentAnalysis = r.contentAnalysis;
    feelingBefore = r.feelingBefore;  feelingAfter = r.feelingAfter;
    beforeCoords  = r.feelingIntendedCoords; afterCoords = r.feelingActualCoords;
  }

  const lemon = generateLemon(
    lemonState || { expression:'neutral', condition:'fresh', intensity_level:1 },
    armorLevel
  );

  const artEl = document.getElementById('ascii-art');
  artEl.innerHTML = lemon.html;

  document.getElementById('state-label').textContent        = lemon.label;
  document.getElementById('narrative-summary').textContent  = narrativeSummary || 'Your session is complete.';
  document.getElementById('observation-question').textContent = observationQuestion || '';

  if (beforeCoords && afterCoords) {
    renderJourneyMap(
      { ...beforeCoords, label: `wanted: ${feelingBefore || '?'}` },
      { ...afterCoords,  label: `actual: ${feelingAfter  || '?'}` }
    );
  }

  displayContentAnalysis(contentAnalysis);
}

document.getElementById('done').addEventListener('click', () => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    window.parent.postMessage({ type: 'LEMON_DISMISS' }, '*');
  } else {
    window.close();
  }
});

init();

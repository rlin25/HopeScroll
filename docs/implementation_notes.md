# Implementation Notes

## Hackathon Constraints
- **Time:** 3.5 hours total
- **Team:** Assume 2-3 people
- **Format:** Pitch deck + recorded demos
- **Live component:** LLM sentiment analysis of sample notes + ASCII lemon generation

---

## Component 1: Chrome Extension

### File Structure
```
extension/
├── manifest.json
├── background.js
├── content-script.js
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── intention/
│   ├── intention.html
│   ├── intention.css
│   └── intention.js
├── journal/
│   ├── journal.html
│   ├── journal.css
│   └── journal.js
├── lemon/
│   ├── lemon.html
│   ├── lemon.css
│   └── lemon.js
└── storage.js
```

### manifest.json (Manifest V3)
```json
{
  "manifest_version": 3,
  "name": "Lemon Battle Companion",
  "version": "0.1.0",
  "description": "Fight toxic algorithms. Protect your lemon.",
  "permissions": ["storage", "tabs"],
  "host_permissions": ["*://*.youtube.com/*"],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["*://*.youtube.com/shorts/*"],
      "js": ["content-script.js"],
      "run_at": "document_start"
    }
  ],
  "action": {
    "default_popup": "popup/popup.html",
    "default_title": "Lemon Battle Companion"
  },
  "web_accessible_resources": [
    {
      "resources": ["intention/*", "journal/*", "lemon/*"],
      "matches": ["*://*.youtube.com/*"]
    }
  ]
}
```

### content-script.js Logic
```
1. Detect youtube.com/shorts URL
2. Check chrome.storage.local for current_session.status
3. If status is null or "complete":
   - Inject full-screen intention overlay (intention.html in an iframe)
   - Block YouTube UI until intention is submitted
4. If status is "intention_set":
   - Allow YouTube to load normally
   - Start session timer
5. On extension icon click:
   - If status is "scrolling", trigger journal overlay
```

### storage.js API
```javascript
// Simple wrapper around chrome.storage.local
const Storage = {
  async getCurrentSession() { /* returns current_session or null */ },
  async saveIntention(intention, benchmarks) { /* sets status to "scrolling" */ },
  async saveJournal(notes, benchmarks_post) { /* sets status to "complete" */ },
  async getSessionHistory() { /* returns array */ },
  async getUserProgression() { /* returns progression object */ },
  async completeSession(emotionAnalysis, lemonState, narrative) { 
    /* moves current to history, updates progression */
  }
};
```

### Key Build Notes
- Intention overlay: full viewport iframe with `z-index: 999999`. Prevent YouTube from loading until dismissed.
- Journal trigger: clicking extension icon during "scrolling" status opens journal overlay. Or set a 15-minute auto-trigger.
- All UI in plain HTML/CSS. No frameworks. Hackathon speed.
- Lemon reveal page loads after journal submission.

---

## Component 2: Intention Popup UI

### intention.html Structure
```
┌──────────────────────────────┐
│     Before you scroll...     │
│                              │
│  I want to feel [________]   │
│  while scrolling.            │
│                              │
│  I want to avoid feeling     │
│  [________].                 │
│                              │
│  If I start feeling          │
│  [________], I'll [_______]. │
│                              │
│  Rate yourself (1-10):       │
│  Motivation:   [■■■■■■■□□□] │
│  Freshness:    [■■■■□□□□□□] │
│  Clarity:      [■■■■■□□□□□] │
│                              │
│       [ BEGIN SESSION ]      │
└──────────────────────────────┘
```

### Implementation Details
- Three text inputs + three range sliders
- Sliders default to 5, show numeric value
- "BEGIN SESSION" saves to storage and dismisses overlay
- Minimal CSS. Dark theme. Monospace font for ASCII-compatible vibe.

---

## Component 3: Journal Popup UI

### journal.html Structure
```
┌──────────────────────────────┐
│     Session complete.        │
│                              │
│  Rate yourself now (1-10):   │
│  Motivation:   [■■■■□□□□□□] │
│  Freshness:    [■■■□□□□□□□] │
│  Clarity:      [■■■■■□□□□□] │
│                              │
│  What's on your mind?        │
│  ┌────────────────────────┐  │
│  │ (freeform text area)   │  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│      [ SEE YOUR LEMON ]      │
└──────────────────────────────┘
```

### Implementation Details
- Pre-fill benchmark sliders at last-known values, let user adjust
- Text area with placeholder: "How did that session feel compared to your intention?"
- "SEE YOUR LEMON" triggers: save to storage → send to LLM → navigate to lemon.html
- Optional: show pre-session benchmark values as small reference numbers above each slider

---

## Component 4: LLM Sentiment Analysis

### Prompt Template
```
You are analyzing journal notes from a user reflecting on their social media scrolling session.

USER'S INTENTION: {desired_emotion} / avoid {avoid_emotion}
BENCHMARKS BEFORE: Motivation {pre_motivation}/10, Freshness {pre_lemon_freshness}/10, Clarity {pre_clarity}/10
BENCHMARKS AFTER: Motivation {post_motivation}/10, Freshness {post_lemon_freshness}/10, Clarity {post_clarity}/10
JOURNAL NOTES: {journal_notes}

Return ONLY valid JSON with this exact structure:
{
  "narrative_summary": "2-3 sentences reflecting their emotional state back to them. Second person. Gentle tone. No advice.",
  "emotion_analysis": {
    "predominant_emotion": "one of: anxiety, anger, sadness, envy, inspiration, joy, neutral",
    "intensity": "1-10 integer",
    "secondary_emotion": "one of the above or null",
    "emotional_shift": {
      "direction": "improved or declined or stable",
      "description": "one brief sentence"
    }
  },
  "benchmark_insight": {
    "biggest_shift": "motivation or lemon_freshness or clarity",
    "shift_magnitude": "integer, absolute difference",
    "interpretation": "one sentence"
  },
  "lemon_state": {
    "expression": "one of: anxious, angry, sad, envious, inspired, joyful, neutral",
    "condition": "one of: fresh, slightly_wilted, wilted, faded, brown_spots, cracked, moldy, glowing",
    "intensity_level": "1-5 integer"
  },
  "observation_question": "one gentle question. never prescriptive. never wellness advice. end with ?"
}

Rules:
- If journal notes are empty, base analysis on benchmark shifts only.
- Condition mapping: anxiety=faded, anger=brown_spots, sadness=cracked, envy=moldy.
- Intensity level: 1-2 for small shifts, 3 for moderate, 4-5 for large drops.
- If benchmarks improved, use fresh or glowing condition.
- Observation question must NEVER suggest walking, breathing, drinking water, or any wellness action.
- Observation question should reference THEIR specific pattern when possible.
```

### API Call Notes
- Use Claude API or OpenAI API. Whichever is pre-approved for the hackathon.
- Set `temperature: 0.7` for narrative variety, `response_format: { type: "json_object" }` if available.
- Timeout: 10 seconds. Fallback to hardcoded neutral response on failure.
- Parse response. Validate JSON structure. Clamp values to valid ranges.

---

## Component 5: ASCII Lemon Generator

### State Definitions (Pre-Written)

#### Fresh (Baseline)
```
   .-""""-.
  /        \
 |          |
 |    .-.    |
 |   (   )   |
 |    `-'    |
  \        /
   `-....-´
  Your lemon is fresh and ready.
```

#### Slightly Wilted
```
   .-""""-.
  /        \
 |          |
 |    .-.    |
 |   (._.)   |
 |    `-'    |
  \        /
   `-....-´
  Your lemon looks a bit tired today.
```

#### Faded/Washed-Out (Anxiety)
```
   .-""""-.
  /        \
 |  . . . .  |
 |   . . .   |
 |    .-.    |
 |   (•_•)   |
 |    `-'    |
  \        /
   `-....-´
  Your lemon is looking faded.
```

#### Brown Spots/Rotting (Anger)
```
   .-""""-.
  /   **   \
 |   *  *   |
 |  *    *  |
 |    .-.    |
 |   (>_<)   |
 |    `-'    |
  \        /
   `-....-´
  Your lemon has developed some dark spots.
```

#### Cracked/Missing Pieces (Sadness)
```
   .-""""-.
  /   \/   \
 |    /\    |
 |   (  )   |
 |    .-.    |
 |   (;_;)   |
 |    `-'    |
  \        /
   `-..--´
  Your lemon has taken some cracks.
```

#### Moldy Edges (Envy)
```
   .-~~""-.
  / ~~   ~~\
 |  ~~   ~~ |
 |   ~~ ~~  |
 |    .-.    |
 |   (¬_¬)   |
 |    `-'    |
  \ ~~   ~~/
   `~-..-~´
  Your lemon has mold creeping in.
```

#### Glowing (Inspiration/Joy)
```
   .-""""-.
  /  ✦✦✦  \
 |  ✦✦✦✦✦  |
 |  ✦✦✦✦✦  |
 |    .-.    |
 |   (^_^)   |
 |    `-'    |
  \  ✦✦✦  /
   `-....-´
  Your lemon is glowing!
```

#### Armored - Helmet (Milestone 1)
```
    ___
   /   \
  | 🛡️🛡️ |
  |  🛡️  |
   \___/
   .-""""-.
  /        \
 |    .-.    |
 |   (•_•)   |
 |    `-'    |
  \        /
   `-....-´
  Your lemon earned a helmet! Resilient.
```

### Generator Logic
```javascript
function generateLemon(lemonState) {
  const { expression, condition, intensity_level } = lemonState;
  
  // Map condition to pre-written ASCII
  const asciiMap = {
    fresh: freshAscii,
    slightly_wilted: wiltedAscii,
    wilted: wiltedAscii,
    faded: fadedAscii,
    brown_spots: brownSpotsAscii,
    cracked: crackedAscii,
    moldy: moldyAscii,
    glowing: glowingAscii,
    armored_helmet: armoredHelmetAscii,
    armored_sword_shield: armoredSwordShieldAscii
  };
  
  // Check user progression for armor overlay
  const progression = await Storage.getUserProgression();
  if (progression.armor_level > 0) {
    // Override condition with appropriate armor state
    return applyArmorLevel(asciiMap, progression.armor_level, expression);
  }
  
  return {
    ascii_art: asciiMap[condition] || freshAscii,
    state_label: generateLabel(expression, condition, intensity_level)
  };
}
```

### Labels by State
```javascript
function generateLabel(expression, condition, intensity) {
  const labelMap = {
    fresh: "Your lemon is fresh and ready.",
    slightly_wilted: "Your lemon looks a bit tired.",
    wilted: "Your lemon is wilting.",
    faded: "Your lemon is looking faded.",
    brown_spots: "Your lemon has developed some dark spots.",
    cracked: "Your lemon has taken some cracks.",
    moldy: "Your lemon has mold creeping in.",
    glowing: "Your lemon is glowing!",
    armored_helmet: "Your lemon earned a helmet! Resilient.",
    armored_sword_shield: "Your lemon is battle-ready!"
  };
  return labelMap[condition] || "Your lemon is here.";
}
```

---

## Component 6: Lemon Reveal Page

### lemon.html Structure
```
┌──────────────────────────────┐
│                              │
│   {ASCII ART HERE}           │
│                              │
│   {state_label}              │
│                              │
│   "{narrative_summary}"      │
│                              │
│   ┌──────────────────────┐   │
│   │ Benchmark Shifts     │   │
│   │ Motivation:  7 → 4   │   │
│   │ Freshness:   6 → 3   │   │
│   │ Clarity:     8 → 5   │   │
│   └──────────────────────┘   │
│                              │
│   {observation_question}     │
│                              │
│        [ DONE ]              │
└──────────────────────────────┘
```

### Implementation Details
- Monospace font for ASCII art section
- Pre-formatted text in `<pre>` tag
- Benchmark comparison as simple table
- "DONE" saves everything to history and closes overlay
- Background: dark theme matching intention/journal pages

---

## Component 7: Feed Simulation (Standalone HTML)

### Structure
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Dark background, phone-shaped container */
    /* Post cards animate from bottom to top */
    /* Speed increases via setInterval with decreasing delay */
    /* Sentiment tag badge on each card */
  </style>
</head>
<body>
  <div id="phone-frame">
    <div id="feed-container">
      <!-- Posts injected by JS -->
    </div>
    <button id="stop-button">STOP</button>
  </div>
  <script>
    // Hardcoded array of 7 fake Shorts
    // Each: { title, description, sentiment, emoji }
    // Start interval: 1000ms
    // Exponential decay: interval *= 0.7 each post
    // On STOP: freeze, show "SESSION COMPLETE"
  </script>
</body>
</html>
```

### Post Data Template
```javascript
const posts = [
  { title: "You won't BELIEVE what happened next", desc: "The shocking truth about...", sentiment: "outrage", emoji: "😡" },
  { title: "This changed my life in 30 seconds", desc: "Why everyone is talking about...", sentiment: "inspiration", emoji: "✨" },
  { title: "They don't want you to see this", desc: "The media is hiding...", sentiment: "anger", emoji: "😡" },
  { title: "Watch this before it gets deleted", desc: "Controversial footage shows...", sentiment: "anxiety", emoji: "😰" },
  { title: "I tried this trend and regret it", desc: "Don't make the same mistake...", sentiment: "sadness", emoji: "😢" },
  { title: "The REAL reason you're unhappy", desc: "It's not your fault, it's...", sentiment: "outrage", emoji: "😡" },
  { title: "She got EVERYTHING I wanted", desc: "How she built her empire at 22...", sentiment: "envy", emoji: "🟢" },
];
```

### Animation Logic
```javascript
let interval = 1000;
let postIndex = 0;

function showNextPost() {
  if (postIndex >= posts.length) {
    // Loop or stop
    postIndex = 0;
  }
  // Create post card, append to feed
  // Scroll into view
  postIndex++;
  interval *= 0.7; // Accelerate
  setTimeout(showNextPost, interval);
}
```

---

## Component 8: Pitch Deck Assembly

### Slide Structure (Suggested)
1. **Title Slide** — Product name, tagline, team
2. **Problem** — The algorithm is winning. We scroll, we feel worse, we don't know why.
3. **Solution** — Meet your lemon. Your emotional battle companion.
4. **How It Works** — 3 steps: Set Intention → Scroll Aware → Reflect & Grow
5. **Demo Video 1** — Accelerating feed with sentiment tags (30 seconds)
6. **Demo Video 2** — Intention → Journal → Lemon Reveal (45 seconds)
7. **The Tech** — Chrome extension + LLM sentiment analysis + ASCII visualization
8. **The Psychology** — Putting feelings into words matters. The lemon makes the invisible visible.
9. **Vision** — Armor progression, breakthrough milestones, content theme training
10. **Ask/Next Steps** — What we'd build with more time

---

## Build Order (3.5 Hours)

| Time Block | Task | Owner |
|------------|------|-------|
| 0:00-0:30 | Chrome extension scaffold (manifest, storage, content-script trigger) | Dev 1 |
| 0:00-0:30 | Intention HTML/CSS/JS (standalone, tested outside extension) | Dev 2 |
| 0:30-1:00 | Journal HTML/CSS/JS + Lemon reveal page layout | Dev 2 |
| 0:30-1:00 | Wire content-script to intention/journal overlay injection | Dev 1 |
| 1:00-1:30 | LLM prompt template + API call function + JSON parsing | Dev 1 |
| 1:00-1:30 | ASCII lemon states (all 8+ variations) + generator function | Dev 2 |
| 1:30-2:00 | Feed simulation HTML/CSS/JS (standalone page) | Dev 1 |
| 1:30-2:00 | Lemon reveal page with benchmark comparison + narrative | Dev 2 |
| 2:00-2:30 | Screen recording: Feed simulation | Anyone |
| 2:00-2:30 | Screen recording: Extension flow (intention → journal → lemon) | Anyone |
| 2:30-3:00 | Pitch deck assembly | Anyone |
| 3:00-3:30 | Rehearsal, polish, backup fallbacks | All |

---

## Fallback Plan
- If Chrome extension breaks: Show recordings only. The LLM sentiment analysis + lemon generation is your live demo.
- If LLM API fails: Use hardcoded example output that matches your sample journal notes.
- If ASCII art misaligns: Have screenshots of the lemon states as backup slides.
- Pitch deck is the primary deliverable. Recordings are secondary. Live demo is tertiary.
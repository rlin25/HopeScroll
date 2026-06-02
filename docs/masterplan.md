# Master Plan + Sub-Plans

## Hackathon: Algorithm Battle Companion
### Duration: 3.5 Hours | Team: 2-3 People

---

# MASTER PLAN

## Phase 0: Pre-Flight (Before Timer Starts)

- [ ] Decisions document reviewed by all team members
- [ ] Interface contract reviewed by all team members
- [ ] Implementation notes reviewed by all team members
- [ ] GitHub repo created, everyone cloned
- [ ] API keys confirmed (Claude or OpenAI)
- [ ] Chrome extension developer mode enabled on demo machine
- [ ] Screen recording software tested (OBS or native)
- [ ] Pitch deck tool open (Google Slides, Figma, etc.)

---

## Phase 1: Foundation (First 30 Minutes)
**Two independent tracks. No dependencies.**

| Time | Track A: Extension Shell (Dev 1) | Track B: Intention UI (Dev 2) |
|------|------|------|
| 0:00-0:10 | Create folder structure, manifest.json, background.js | Create intention.html with template form |
| 0:10-0:20 | Write content-script.js with URL detection + injection logic | Create intention.css (dark theme, monospace) |
| 0:20-0:30 | Write storage.js helper functions, test extension loads | Create intention.js (save to storage, dismiss), test standalone |

**Checkpoint 0:30:** Extension loads in Chrome. Intention form works standalone.

---

## Phase 2: Core Flow (30 Min → 1:15)
**Tracks remain independent. Converge on storage schema only.**

| Time | Track A: Extension Integration (Dev 1) | Track B: Journal + Lemon UI (Dev 2) |
|------|------|------|
| 0:30-0:45 | Wire content-script to inject intention as iframe on Shorts URL | Create journal.html with sliders + text area |
| 0:45-1:00 | Block YouTube until submission, save to storage, start timer | Create journal.css, journal.js (save to storage) |
| 1:00-1:15 | Add extension icon click → journal overlay trigger | Create lemon.html, lemon.css, lemon.js (read from storage, populate) |

**Checkpoint 1:15:** Intention → YouTube → Journal → Lemon page all connected via storage.

---

## Phase 3: Intelligence (1:15 → 1:45)
**Tracks converge. Both touch storage schema.**

| Time | Track A: LLM Integration (Dev 1) | Track B: ASCII Lemon Generator (Dev 2) |
|------|------|------|
| 1:15-1:25 | Write prompt template with placeholders | Write all 8+ ASCII lemon states as constants |
| 1:25-1:35 | Write analyzeSentiment() function, call LLM API | Write generateLemon() + generateLabel() functions |
| 1:35-1:45 | Parse JSON, validate, add fallback, wire into journal.js | Wire into lemon.js, test with hardcoded inputs |

**Checkpoint 1:45:** Journal notes → LLM analysis → Lemon visual. Full loop works.

---

## Phase 4: Demo Assets (1:45 → 2:45)
**All parallel. Anyone can do any task.**

| Time | Task A: Feed Sim | Task B: Extension Recording | Task C: Pitch Deck Start |
|------|------|------|------|
| 1:45-2:15 | Build feed-sim/index.html | Prep Chrome, clear storage | Create slides 1-5 |
| 2:15-2:30 | Add animation + STOP button | Record full flow | Create slides 6-10 |
| 2:30-2:45 | Screen record feed sim | Save extension-demo.mp4 | Placeholder slides for videos |

**Checkpoint 2:45:** Both recordings done. Pitch deck skeleton ready. Live demo tested.

---

## Phase 5: Pitch Assembly (2:45 → 3:15)

- [ ] Insert feed-simulation.mp4 into deck
- [ ] Insert extension-demo.mp4 into deck
- [ ] Polish slide design
- [ ] Write speaker notes
- [ ] Prepare live demo segment
- [ ] Prepare fallback slides (screenshots, hardcoded examples)
- [ ] Export PDF backup

**Checkpoint 3:15:** Pitch deck complete. Live demo rehearsed. Fallbacks ready.

---

## Phase 6: Rehearsal & Polish (3:15 → 3:30)

- [ ] Full run-through with deck + videos + live demo
- [ ] Time presentation (aim for 2-3 minutes)
- [ ] Test on presentation machine
- [ ] Check video playback
- [ ] Final battery/charger/dongle check
- [ ] Assign speaking roles

---

## Dependency Map

```
Phase 1: No dependencies. Fully parallel.
Phase 2: Track A depends on Phase 1 Track A. Track B depends on Phase 1 Track B. Independent.
Phase 3: Track A depends on Phase 2 Track B (journal.js). Track B depends on Phase 2 Track B (lemon.js).
Phase 4: Feed sim: no dependencies. Recording: depends on Phase 3. Pitch deck: no dependencies.
Phase 5: Depends on Phase 4 recordings + Phase 3 live component.
Phase 6: Depends on Phase 5.
```

## Critical Path

```
Phase 1 Track A (0:30)
  → Phase 2 Track A (0:45)
    → Phase 3 Track A (0:30)
      → Phase 4 Recording (0:30)
        → Phase 5 Assembly (0:30)
          → Phase 6 Rehearsal (0:15)
Total: 3 hours. 30 min buffer.
```

## Risk Register

| Risk | Mitigation |
|------|------------|
| LLM API fails | Hardcoded fallback output ready |
| Extension won't inject overlay | Record standalone HTML pages instead |
| ASCII art misaligns | Screenshot backups of all lemon states |
| Feed sim JS bugs | Pre-render simpler version |
| Extension recording glitch | Record in 2 segments, stitch later |
| Running out of time | Phase 4 fully parallelizable. Cut feed sim polish first. |

## Go/No-Go Decision Points

| Time | Decision | If No-Go |
|------|----------|----------|
| 0:30 | Extension loads + intention form works | Fix before proceeding |
| 1:15 | Full extension flow connected | Show standalone HTML pages in recording |
| 1:45 | LLM + lemon generator work | Use hardcoded analysis + pre-saved lemon art |
| 2:45 | Both recordings complete | Prioritize extension recording over feed sim |
| 3:15 | Pitch deck complete | Ship anyway. Polish less. |

---

---

# SUB-PLAN 1: Chrome Extension Shell

## Objective
Working Manifest V3 extension that detects YouTube Shorts URLs and has storage utilities ready.

## Steps

### 1.1 Create Folder Structure (5 min)
```
mkdir extension
mkdir extension/popup
mkdir extension/intention
mkdir extension/journal
mkdir extension/lemon
touch extension/manifest.json
touch extension/background.js
touch extension/content-script.js
touch extension/storage.js
```

### 1.2 Write manifest.json (5 min)
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

### 1.3 Write background.js (5 min)
```javascript
// Minimal service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log("Lemon Battle Companion installed");
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SESSION_COMPLETE") {
    // Could trigger notifications here later
    console.log("Session complete:", message.data);
  }
  sendResponse({ received: true });
});
```

### 1.4 Write content-script.js (10 min)
```javascript
(function() {
  console.log("Lemon: Content script loaded on YouTube Shorts");
  
  // Check current session state
  chrome.storage.local.get("current_session", (data) => {
    const session = data.current_session;
    
    if (!session || session.status === "complete") {
      // No active session — inject intention overlay
      injectIntentionOverlay();
    } else if (session.status === "intention_set") {
      // Session in progress — allow YouTube, start monitoring
      console.log("Session active since:", session.start_time);
      startSessionTimer(session);
    }
  });
  
  function injectIntentionOverlay() {
    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("intention/intention.html");
    iframe.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      border: none;
      z-index: 999999;
    `;
    
    // Block YouTube content until intention is set
    document.documentElement.style.overflow = "hidden";
    document.body.appendChild(iframe);
    
    // Listen for intention completion
    window.addEventListener("message", (event) => {
      if (event.data.type === "INTENTION_SET") {
        iframe.remove();
        document.documentElement.style.overflow = "";
        console.log("Intention set. Session begins.");
      }
    });
  }
  
  function startSessionTimer(session) {
    // Store session start if not already
    if (!session.start_time) {
      session.start_time = new Date().toISOString();
      session.status = "scrolling";
      chrome.storage.local.set({ current_session: session });
    }
  }
})();
```

### 1.5 Write storage.js (5 min)
```javascript
const Storage = {
  async getCurrentSession() {
    const data = await chrome.storage.local.get("current_session");
    return data.current_session || null;
  },
  
  async saveIntention(intention, benchmarks) {
    const session = {
      session_id: crypto.randomUUID(),
      intention: intention,
      benchmarks_pre: benchmarks,
      start_time: new Date().toISOString(),
      status: "scrolling"
    };
    await chrome.storage.local.set({ current_session: session });
    return session;
  },
  
  async saveJournal(notes, benchmarks_post) {
    const data = await chrome.storage.local.get("current_session");
    const session = data.current_session;
    session.journal_notes = notes;
    session.benchmarks_post = benchmarks_post;
    session.status = "journaling";
    await chrome.storage.local.set({ current_session: session });
    return session;
  },
  
  async completeSession(emotionAnalysis, lemonState, narrativeSummary) {
    const data = await chrome.storage.local.get("current_session");
    const session = data.current_session;
    session.emotion_analysis = emotionAnalysis;
    session.lemon_state = lemonState;
    session.narrative_summary = narrativeSummary;
    session.status = "complete";
    session.completed_at = new Date().toISOString();
    
    // Move to history
    const historyData = await chrome.storage.local.get("session_history");
    const history = historyData.session_history || [];
    history.push(session);
    
    // Update progression
    const progData = await chrome.storage.local.get("user_progression");
    const progression = progData.user_progression || {
      armor_level: 0,
      total_sessions: 0,
      positive_streak: 0,
      breakthrough_milestones_earned: []
    };
    progression.total_sessions += 1;
    
    // Check for positive streak
    if (emotionAnalysis.emotional_shift.direction === "improved") {
      progression.positive_streak += 1;
    } else {
      progression.positive_streak = 0;
    }
    
    // Check for armor milestones
    if (progression.positive_streak >= 5 && progression.armor_level < 1) {
      progression.armor_level = 1;
      progression.breakthrough_milestones_earned.push("helmet");
    }
    if (progression.positive_streak >= 10 && progression.armor_level < 2) {
      progression.armor_level = 2;
      progression.breakthrough_milestones_earned.push("shield");
    }
    
    await chrome.storage.local.set({
      current_session: null,
      session_history: history,
      user_progression: progression
    });
    
    return { session, progression };
  },
  
  async getSessionHistory() {
    const data = await chrome.storage.local.get("session_history");
    return data.session_history || [];
  },
  
  async getUserProgression() {
    const data = await chrome.storage.local.get("user_progression");
    return data.user_progression || {
      armor_level: 0,
      total_sessions: 0,
      positive_streak: 0,
      breakthrough_milestones_earned: []
    };
  }
};
```

### 1.6 Test (Done throughout)
- Load extension in `chrome://extensions` with Developer Mode ON
- Navigate to `youtube.com/shorts/anything`
- Check console for "Lemon: Content script loaded"
- Verify storage functions from console

---

# SUB-PLAN 2: Intention Popup UI

## Objective
Standalone HTML page with fill-in-the-blank template and benchmark sliders. Works inside extension iframe or standalone for testing.

## Steps

### 2.1 Create intention.html (10 min)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="intention.css">
</head>
<body>
  <div id="intention-overlay">
    <div class="container">
      <h1>Before you scroll...</h1>
      
      <div class="field">
        <label>I want to feel</label>
        <input type="text" id="desired-emotion" placeholder="inspired, calm, informed...">
        <span class="inline-text">while scrolling.</span>
      </div>
      
      <div class="field">
        <label>I want to avoid feeling</label>
        <input type="text" id="avoid-emotion" placeholder="angry, anxious, envious...">
      </div>
      
      <div class="field">
        <label>If I start feeling</label>
        <input type="text" id="trigger-emotion" placeholder="overwhelmed, drained...">
        <span class="inline-text">I'll</span>
        <input type="text" id="action" placeholder="close the app, take a breath...">
      </div>
      
      <div class="benchmarks">
        <h2>How are you right now?</h2>
        
        <div class="slider-group">
          <label>Motivation <span class="value" id="motivation-value">5</span></label>
          <input type="range" id="motivation" min="1" max="10" value="5">
        </div>
        
        <div class="slider-group">
          <label>Lemon Freshness <span class="value" id="freshness-value">5</span></label>
          <input type="range" id="lemon-freshness" min="1" max="10" value="5">
        </div>
        
        <div class="slider-group">
          <label>Mental Clarity <span class="value" id="clarity-value">5</span></label>
          <input type="range" id="clarity" min="1" max="10" value="5">
        </div>
      </div>
      
      <button id="begin-session">BEGIN SESSION</button>
    </div>
  </div>
  <script src="intention.js"></script>
</body>
</html>
```

### 2.2 Create intention.css (10 min)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Courier New', monospace;
  background: #1a1a2e;
  color: #e0e0e0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#intention-overlay {
  width: 100%;
  max-width: 500px;
  padding: 40px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h1 {
  font-size: 24px;
  color: #f0c040;
  text-align: center;
  margin-bottom: 8px;
}

h2 {
  font-size: 16px;
  color: #c0c0c0;
  margin-bottom: 12px;
}

.field {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  font-size: 16px;
}

.field label {
  color: #c0c0c0;
}

.field input[type="text"] {
  background: transparent;
  border: none;
  border-bottom: 2px solid #f0c040;
  color: #f0c040;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  padding: 4px 8px;
  min-width: 120px;
  outline: none;
}

.field input[type="text"]:focus {
  border-bottom-color: #ffffff;
}

.inline-text {
  color: #c0c0c0;
}

.benchmarks {
  margin-top: 8px;
}

.slider-group {
  margin-bottom: 16px;
}

.slider-group label {
  display: flex;
  justify-content: space-between;
  color: #c0c0c0;
  font-size: 14px;
  margin-bottom: 4px;
}

.slider-group .value {
  color: #f0c040;
  font-weight: bold;
}

.slider-group input[type="range"] {
  width: 100%;
  accent-color: #f0c040;
}

#begin-session {
  background: #f0c040;
  color: #1a1a2e;
  border: none;
  padding: 16px;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}

#begin-session:hover {
  background: #ffffff;
}
```

### 2.3 Create intention.js (10 min)
```javascript
// Update slider values in real-time
document.getElementById("motivation").addEventListener("input", function() {
  document.getElementById("motivation-value").textContent = this.value;
});

document.getElementById("lemon-freshness").addEventListener("input", function() {
  document.getElementById("freshness-value").textContent = this.value;
});

document.getElementById("clarity").addEventListener("input", function() {
  document.getElementById("clarity-value").textContent = this.value;
});

// Handle submission
document.getElementById("begin-session").addEventListener("click", async () => {
  const intention = {
    desired_emotion: document.getElementById("desired-emotion").value || "informed",
    avoid_emotion: document.getElementById("avoid-emotion").value || "angry",
    if_feeling_action: `If I start feeling ${document.getElementById("trigger-emotion").value || "drained"}, I'll ${document.getElementById("action").value || "close the app"}.`
  };
  
  const benchmarks = {
    motivation: parseInt(document.getElementById("motivation").value),
    lemon_freshness: parseInt(document.getElementById("lemon-freshness").value),
    clarity: parseInt(document.getElementById("clarity").value)
  };
  
  // If running inside extension, save to storage
  if (typeof chrome !== "undefined" && chrome.storage) {
    await Storage.saveIntention(intention, benchmarks);
    // Notify content script to dismiss overlay
    window.parent.postMessage({ type: "INTENTION_SET" }, "*");
  } else {
    // Standalone testing — log to console
    console.log("Intention:", intention);
    console.log("Benchmarks:", benchmarks);
    alert("Intention set! (Standalone mode — data logged to console)");
  }
});
```

### 2.4 Test
- Open intention.html directly in browser
- Fill all fields, adjust sliders
- Click BEGIN SESSION
- Verify console.log output
- If loaded as extension iframe, verify storage update

---

# SUB-PLAN 3: Journal Popup UI

## Objective
Post-session overlay with benchmark sliders, freeform text area, and submit button that triggers analysis.

## Steps

### 3.1 Create journal.html (10 min)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="journal.css">
</head>
<body>
  <div id="journal-overlay">
    <div class="container">
      <h1>Session complete.</h1>
      
      <div class="benchmarks">
        <h2>Rate yourself now:</h2>
        
        <div class="slider-group">
          <label>Motivation <span class="value" id="motivation-value">5</span></label>
          <input type="range" id="motivation" min="1" max="10" value="5">
          <span class="pre-value" id="motivation-pre">Pre: —</span>
        </div>
        
        <div class="slider-group">
          <label>Lemon Freshness <span class="value" id="freshness-value">5</span></label>
          <input type="range" id="lemon-freshness" min="1" max="10" value="5">
          <span class="pre-value" id="freshness-pre">Pre: —</span>
        </div>
        
        <div class="slider-group">
          <label>Mental Clarity <span class="value" id="clarity-value">5</span></label>
          <input type="range" id="clarity" min="1" max="10" value="5">
          <span class="pre-value" id="clarity-pre">Pre: —</span>
        </div>
      </div>
      
      <div class="journal-prompt">
        <label>What's on your mind?</label>
        <textarea id="journal-notes" placeholder="How did that session feel compared to your intention?"></textarea>
      </div>
      
      <button id="see-lemon">SEE YOUR LEMON</button>
    </div>
  </div>
  <script src="journal.js"></script>
</body>
</html>
```

### 3.2 Create journal.css (5 min)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Courier New', monospace;
  background: #1a1a2e;
  color: #e0e0e0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#journal-overlay {
  width: 100%;
  max-width: 500px;
  padding: 40px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h1 {
  font-size: 24px;
  color: #f0c040;
  text-align: center;
}

h2 {
  font-size: 16px;
  color: #c0c0c0;
  margin-bottom: 12px;
}

.slider-group {
  margin-bottom: 12px;
}

.slider-group label {
  display: flex;
  justify-content: space-between;
  color: #c0c0c0;
  font-size: 14px;
  margin-bottom: 4px;
}

.slider-group .value {
  color: #f0c040;
  font-weight: bold;
}

.slider-group .pre-value {
  color: #808080;
  font-size: 12px;
}

.slider-group input[type="range"] {
  width: 100%;
  accent-color: #f0c040;
}

.journal-prompt {
  margin-top: 8px;
}

.journal-prompt label {
  color: #c0c0c0;
  font-size: 14px;
  display: block;
  margin-bottom: 8px;
}

.journal-prompt textarea {
  width: 100%;
  height: 100px;
  background: #16213e;
  border: 1px solid #333;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  padding: 12px;
  resize: vertical;
  outline: none;
}

.journal-prompt textarea:focus {
  border-color: #f0c040;
}

.journal-prompt textarea::placeholder {
  color: #666;
}

#see-lemon {
  background: #f0c040;
  color: #1a1a2e;
  border: none;
  padding: 16px;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

#see-lemon:hover {
  background: #ffffff;
}

#see-lemon:disabled {
  background: #666;
  cursor: not-allowed;
}
```

### 3.3 Create journal.js (15 min)
```javascript
let preBenchmarks = null;
let sessionData = null;

// Load pre-session benchmarks on init
async function init() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    const data = await chrome.storage.local.get("current_session");
    sessionData = data.current_session;
    if (sessionData && sessionData.benchmarks_pre) {
      preBenchmarks = sessionData.benchmarks_pre;
      document.getElementById("motivation-pre").textContent = `Pre: ${preBenchmarks.motivation}`;
      document.getElementById("freshness-pre").textContent = `Pre: ${preBenchmarks.lemon_freshness}`;
      document.getElementById("clarity-pre").textContent = `Pre: ${preBenchmarks.clarity}`;
      
      // Set sliders to pre values as starting point
      document.getElementById("motivation").value = preBenchmarks.motivation;
      document.getElementById("motivation-value").textContent = preBenchmarks.motivation;
      document.getElementById("lemon-freshness").value = preBenchmarks.lemon_freshness;
      document.getElementById("freshness-value").textContent = preBenchmarks.lemon_freshness;
      document.getElementById("clarity").value = preBenchmarks.clarity;
      document.getElementById("clarity-value").textContent = preBenchmarks.clarity;
    }
  }
}

// Update slider values
document.getElementById("motivation").addEventListener("input", function() {
  document.getElementById("motivation-value").textContent = this.value;
});

document.getElementById("lemon-freshness").addEventListener("input", function() {
  document.getElementById("freshness-value").textContent = this.value;
});

document.getElementById("clarity").addEventListener("input", function() {
  document.getElementById("clarity-value").textContent = this.value;
});

// Handle submission
document.getElementById("see-lemon").addEventListener("click", async () => {
  const button = document.getElementById("see-lemon");
  button.disabled = true;
  button.textContent = "ANALYZING...";
  
  const notes = document.getElementById("journal-notes").value;
  const benchmarks_post = {
    motivation: parseInt(document.getElementById("motivation").value),
    lemon_freshness: parseInt(document.getElementById("lemon-freshness").value),
    clarity: parseInt(document.getElementById("clarity").value)
  };
  
  if (typeof chrome !== "undefined" && chrome.storage) {
    // Save journal to storage
    await Storage.saveJournal(notes, benchmarks_post);
    
    // Get full session data for analysis
    const updatedSession = await Storage.getCurrentSession();
    
    // Send to background for LLM analysis
    chrome.runtime.sendMessage({
      type: "ANALYZE_SESSION",
      data: updatedSession
    }, async (response) => {
      if (response.success) {
        const { emotionAnalysis, lemonState, narrativeSummary } = response;
        await Storage.completeSession(emotionAnalysis, lemonState, narrativeSummary);
        
        // Navigate to lemon reveal page
        window.location.href = chrome.runtime.getURL("lemon/lemon.html");
      } else {
        // Fallback
        button.textContent = "ERROR - SEE YOUR LEMON";
        button.disabled = false;
      }
    });
  } else {
    // Standalone testing
    console.log("Journal notes:", notes);
    console.log("Post benchmarks:", benchmarks_post);
    
    // Simulate analysis
    const mockResult = getFallbackAnalysis(sessionData || {}, notes, benchmarks_post);
    console.log("Analysis result:", mockResult);
    
    // Store mock result and redirect
    sessionStorage.setItem("lemon_result", JSON.stringify(mockResult));
    window.location.href = "lemon/lemon.html";
  }
});

init();
```

### 3.4 Test
- Open journal.html in browser with console open
- Adjust sliders, type notes
- Click SEE YOUR LEMON
- Verify console output or storage update

---

# SUB-PLAN 4: LLM Sentiment Analysis

## Objective
Take session data + journal notes → call LLM API → return structured analysis + narrative summary.

## Steps

### 4.1 Write Prompt Template (5 min)
```javascript
const PROMPT_TEMPLATE = `You are analyzing journal notes from a user reflecting on their social media scrolling session.

USER'S INTENTION: They wanted to feel {desired_emotion} and avoid feeling {avoid_emotion}.
BENCHMARKS BEFORE: Motivation {pre_motivation}/10, Lemon Freshness {pre_lemon_freshness}/10, Clarity {pre_clarity}/10
BENCHMARKS AFTER: Motivation {post_motivation}/10, Lemon Freshness {post_lemon_freshness}/10, Clarity {post_clarity}/10
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

RULES:
- If journal notes are empty, base analysis on benchmark shifts only.
- Condition mapping: anxiety=faded, anger=brown_spots, sadness=cracked, envy=moldy.
- Intensity level: 1-2 for small shifts, 3 for moderate, 4-5 for large drops.
- If benchmarks improved, use fresh or glowing condition.
- Observation question must NEVER suggest walking, breathing, drinking water, or any wellness action.
- Observation question should reference THEIR specific pattern when possible.`;
```

### 4.2 Write analyzeSentiment Function (15 min)
```javascript
async function analyzeSentiment(sessionData) {
  const { intention, benchmarks_pre, benchmarks_post, journal_notes } = sessionData;
  
  // Build prompt
  const prompt = PROMPT_TEMPLATE
    .replace("{desired_emotion}", intention.desired_emotion)
    .replace("{avoid_emotion}", intention.avoid_emotion)
    .replace("{pre_motivation}", benchmarks_pre.motivation)
    .replace("{pre_lemon_freshness}", benchmarks_pre.lemon_freshness)
    .replace("{pre_clarity}", benchmarks_pre.clarity)
    .replace("{post_motivation}", benchmarks_post.motivation)
    .replace("{post_lemon_freshness}", benchmarks_post.lemon_freshness)
    .replace("{post_clarity}", benchmarks_post.clarity)
    .replace("{journal_notes}", journal_notes || "(no notes provided)");
  
  try {
    // Call Claude API (or swap for OpenAI)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "YOUR_API_KEY", // Replace with actual key
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307", // Fastest model for hackathon
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }]
      })
    });
    
    const data = await response.json();
    const text = data.content[0].text;
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    
    const result = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    return validateAnalysisResult(result);
    
  } catch (error) {
    console.error("LLM analysis failed:", error);
    return getFallbackAnalysis(sessionData);
  }
}
```

### 4.3 Write Validation Function (5 min)
```javascript
const VALID_EMOTIONS = ["anxiety", "anger", "sadness", "envy", "inspiration", "joy", "neutral"];
const VALID_CONDITIONS = ["fresh", "slightly_wilted", "wilted", "faded", "brown_spots", "cracked", "moldy", "glowing"];
const VALID_EXPRESSIONS = ["anxious", "angry", "sad", "envious", "inspired", "joyful", "neutral"];
const VALID_DIRECTIONS = ["improved", "declined", "stable"];

function validateAnalysisResult(result) {
  // Clamp and validate all fields
  if (!VALID_EMOTIONS.includes(result.emotion_analysis?.predominant_emotion)) {
    result.emotion_analysis.predominant_emotion = "neutral";
  }
  
  if (!VALID_CONDITIONS.includes(result.lemon_state?.condition)) {
    result.lemon_state.condition = "slightly_wilted";
  }
  
  if (!VALID_EXPRESSIONS.includes(result.lemon_state?.expression)) {
    result.lemon_state.expression = "neutral";
  }
  
  if (!VALID_DIRECTIONS.includes(result.emotion_analysis?.emotional_shift?.direction)) {
    result.emotion_analysis.emotional_shift.direction = "stable";
  }
  
  // Clamp numeric values
  result.emotion_analysis.intensity = Math.min(10, Math.max(1, result.emotion_analysis.intensity || 5));
  result.lemon_state.intensity_level = Math.min(5, Math.max(1, result.lemon_state.intensity_level || 3));
  
  return result;
}
```

### 4.4 Write Fallback Function (5 min)
```javascript
function getFallbackAnalysis(sessionData) {
  // Calculate simple benchmark shifts
  const pre = sessionData.benchmarks_pre || { motivation: 5, lemon_freshness: 5, clarity: 5 };
  const post = sessionData.benchmarks_post || { motivation: 5, lemon_freshness: 5, clarity: 5 };
  
  const avgDrop = ((pre.motivation - post.motivation) + 
                   (pre.lemon_freshness - post.lemon_freshness) + 
                   (pre.clarity - post.clarity)) / 3;
  
  let condition = "fresh";
  let intensity = 1;
  let direction = "improved";
  
  if (avgDrop > 3) {
    condition = "cracked";
    intensity = 5;
    direction = "declined";
  } else if (avgDrop > 2) {
    condition = "brown_spots";
    intensity = 4;
    direction = "declined";
  } else if (avgDrop > 1) {
    condition = "faded";
    intensity = 3;
    direction = "declined";
  } else if (avgDrop > 0) {
    condition = "slightly_wilted";
    intensity = 2;
    direction = "declined";
  } else if (avgDrop < -1) {
    condition = "glowing";
    intensity = 1;
    direction = "improved";
  } else {
    direction = "stable";
  }
  
  return {
    narrative_summary: sessionData.journal_notes 
      ? "You took time to reflect on your session. That self-awareness is the first step toward understanding how content affects you."
      : "Take a moment to reflect when you're ready. Your lemon is here whenever you need it.",
    emotion_analysis: {
      predominant_emotion: avgDrop > 2 ? "sadness" : "neutral",
      intensity: intensity + 2,
      secondary_emotion: null,
      emotional_shift: {
        direction: direction,
        description: avgDrop > 0 ? "You seem to be feeling a bit lower than before." : "You held steady through this session."
      }
    },
    benchmark_insight: {
      biggest_shift: "lemon_freshness",
      shift_magnitude: Math.abs(Math.round(avgDrop)),
      interpretation: avgDrop > 0 ? "Your lemon took some wear this session." : "Your lemon stayed fresh."
    },
    lemon_state: {
      expression: avgDrop > 2 ? "sad" : "neutral",
      condition: condition,
      intensity_level: intensity
    },
    observation_question: avgDrop > 2 
      ? "You've noticed a drop in how you're feeling. Any thoughts on what type of content might have contributed?"
      : "How did this session compare to what you intended?"
  };
}
```

### 4.5 Wire Into Background Script (5 min)
```javascript
// Add to background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ANALYZE_SESSION") {
    analyzeSentiment(message.data)
      .then(result => {
        sendResponse({
          success: true,
          emotionAnalysis: result.emotion_analysis,
          lemonState: result.lemon_state,
          narrativeSummary: result.narrative_summary,
          observationQuestion: result.observation_question,
          benchmarkInsight: result.benchmark_insight
        });
      })
      .catch(error => {
        const fallback = getFallbackAnalysis(message.data);
        sendResponse({
          success: true,
          emotionAnalysis: fallback.emotion_analysis,
          lemonState: fallback.lemon_state,
          narrativeSummary: fallback.narrative_summary,
          observationQuestion: fallback.observation_question,
          benchmarkInsight: fallback.benchmark_insight
        });
      });
    return true; // Keep message channel open for async
  }
});
```

### 4.6 Test
- Call `analyzeSentiment()` with mock session data
- Verify structured output
- Test with empty journal notes
- Test fallback by using invalid API key
- Verify JSON parsing handles edge cases

---

# SUB-PLAN 5: ASCII Lemon Generator

## Objective
Pure function: takes lemon_state → returns ASCII art string + human-readable label.

## Steps

### 5.1 Write All ASCII States (20 min)
```javascript
const ASCII_LEMONS = {
  fresh: `
   .-""""-.
  /        \\
 |          |
 |    .-.    |
 |   (   )   |
 |    \`-'    |
  \\        /
   \`-....-´`,

  slightly_wilted: `
   .-""""-.
  /        \\
 |          |
 |    .-.    |
 |   (._.)   |
 |    \`-'    |
  \\        /
   \`-....-´`,

  wilted: `
   .-""""-.
  /        \\
 |   ....   |
 |    .-.    |
 |   (._.)   |
 |    \`-'    |
  \\   ..   /
   \`-....-´`,

  faded: `
   .-""""-.
  /  . . .  \\
 |   . . .   |
 |    .-.    |
 |   (•_•)   |
 |    \`-'    |
  \\  . . .  /
   \`-....-´`,

  brown_spots: `
   .-""""-.
  /   **   \\
 |   *  *   |
 |  *    *  |
 |    .-.    |
 |   (>_<)   |
 |    \`-'    |
  \\   **   /
   \`-....-´`,

  cracked: `
   .-""""-.
  /   \\/   \\
 |    /\\    |
 |   (  )   |
 |    .-.    |
 |   (;_;)   |
 |    \`-'    |
  \\   //   /
   \`-..--´`,

  moldy: `
   .-~~""-.
  / ~~   ~~\\
 |  ~~   ~~ |
 |   ~~ ~~  |
 |    .-.    |
 |   (¬_¬)   |
 |    \`-'    |
  \\ ~~   ~~/
   \`~-..-~´`,

  glowing: `
   .-""""-.
  /  ✦✦✦  \\
 |  ✦✦✦✦✦  |
 |  ✦✦✦✦✦  |
 |    .-.    |
 |   (^_^)   |
 |    \`-'    |
  \\  ✦✦✦  /
   \`-....-´`,

  armored_helmet: `
    .-----.
   /       \\
  |  ╔═══╗  |
  |  ║ 🛡 ║  |
  |  ╚═══╝  |
   \\       /
    \`-----'
   .-""""-.
  /        \\
 |    .-.    |
 |   (•_•)   |
 |    \`-'    |
  \\        /
   \`-....-´`,

  armored_sword_shield: `
    .-----.
   /       \\
  |  ╔═══╗  |
  |  ║ 🛡 ║  |  ⚔
  |  ╚═══╝  |
   \\       /
    \`-----'
   .-""""-.
  /        \\
 |    .-.    |
 |   (•_•)   |
 |    \`-'    |
  \\        /
   \`-....-´`
};
```

### 5.2 Write generateLemon Function (5 min)
```javascript
function generateLemon(lemonState, armorLevel = 0) {
  const { condition, intensity_level } = lemonState;
  
  // If user has armor, override condition for positive states
  let effectiveCondition = condition;
  if (armorLevel > 0 && ["fresh", "glowing"].includes(condition)) {
    effectiveCondition = armorLevel >= 2 ? "armored_sword_shield" : "armored_helmet";
  }
  
  const asciiArt = ASCII_LEMONS[effectiveCondition] || ASCII_LEMONS.fresh;
  const label = generateLabel(lemonState.expression, effectiveCondition, intensity_level);
  
  return {
    ascii_art: asciiArt,
    state_label: label
  };
}
```

### 5.3 Write generateLabel Function (3 min)
```javascript
const STATE_LABELS = {
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

function generateLabel(expression, condition, intensity) {
  const baseLabel = STATE_LABELS[condition] || "Your lemon is here.";
  
  // Add intensity descriptor for strong states
  if (intensity >= 5 && condition !== "fresh" && condition !== "glowing") {
    return baseLabel.replace(".", " — heavily.");
  }
  if (intensity >= 4) {
    return baseLabel.replace(".", " — quite a bit.");
  }
  
  return baseLabel;
}
```

### 5.4 Test
```javascript
// Quick test harness
console.log(generateLemon({ expression: "anxious", condition: "faded", intensity_level: 3 }));
console.log(generateLemon({ expression: "joyful", condition: "glowing", intensity_level: 1 }));
console.log(generateLemon({ expression: "sad", condition: "cracked", intensity_level: 5 }));
console.log(generateLemon({ expression: "inspired", condition: "glowing", intensity_level: 1 }, 2));
```

---

# SUB-PLAN 6: Lemon Reveal Page

## Objective
Final page shown after journal submission. Displays ASCII lemon, narrative summary, benchmark comparison, and observation question.

## Steps

### 6.1 Create lemon.html (10 min)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="lemon.css">
</head>
<body>
  <div id="lemon-reveal">
    <div class="container">
      <pre id="ascii-art" class="ascii-container"></pre>
      
      <p id="state-label" class="state-label"></p>
      
      <blockquote id="narrative-summary" class="narrative"></blockquote>
      
      <div class="benchmark-comparison">
        <h3>Your Benchmarks</h3>
        <table>
          <tr>
            <th></th>
            <th>Before</th>
            <th>After</th>
            <th>Shift</th>
          </tr>
          <tr>
            <td>Motivation</td>
            <td id="pre-motivation">—</td>
            <td id="post-motivation">—</td>
            <td id="shift-motivation">—</td>
          </tr>
          <tr>
            <td>Lemon Freshness</td>
            <td id="pre-freshness">—</td>
            <td id="post-freshness">—</td>
            <td id="shift-freshness">—</td>
          </tr>
          <tr>
            <td>Clarity</td>
            <td id="pre-clarity">—</td>
            <td id="post-clarity">—</td>
            <td id="shift-clarity">—</td>
          </tr>
        </table>
      </div>
      
      <p id="observation-question" class="observation"></p>
      
      <button id="done">DONE</button>
    </div>
  </div>
  <script src="lemon.js"></script>
</body>
</html>
```

### 6.2 Create lemon.css (5 min)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Courier New', monospace;
  background: #1a1a2e;
  color: #e0e0e0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

#lemon-reveal {
  width: 100%;
  max-width: 500px;
  padding: 40px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.ascii-container {
  font-size: 14px;
  line-height: 1.2;
  color: #f0c040;
  text-align: center;
  white-space: pre;
  margin: 20px 0;
}

.state-label {
  font-size: 16px;
  color: #f0c040;
  text-align: center;
  font-weight: bold;
}

.narrative {
  font-size: 14px;
  color: #c0c0c0;
  text-align: center;
  font-style: italic;
  line-height: 1.5;
  border-left: 3px solid #f0c040;
  padding-left: 16px;
  max-width: 400px;
}

.benchmark-comparison {
  width: 100%;
  background: #16213e;
  padding: 16px;
  border-radius: 4px;
}

.benchmark-comparison h3 {
  color: #c0c0c0;
  font-size: 14px;
  margin-bottom: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  color: #808080;
  font-size: 12px;
  text-align: left;
  padding: 4px 8px;
}

td {
  font-size: 14px;
  padding: 6px 8px;
  color: #e0e0e0;
}

td:nth-child(4) {
  font-weight: bold;
}

.observation {
  font-size: 15px;
  color: #f0c040;
  text-align: center;
  font-style: italic;
  line-height: 1.5;
  max-width: 400px;
}

#done {
  background: #f0c040;
  color: #1a1a2e;
  border: none;
  padding: 12px 32px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 8px;
}

#done:hover {
  background: #ffffff;
}
```

### 6.3 Create lemon.js (10 min)
```javascript
async function init() {
  let result = null;
  let sessionData = null;
  
  if (typeof chrome !== "undefined" && chrome.storage) {
    // Load from extension storage
    const data = await chrome.storage.local.get("current_session");
    sessionData = data.current_session;
    
    if (sessionData) {
      result = {
        lemonState: sessionData.lemon_state,
        narrativeSummary: sessionData.narrative_summary,
        observationQuestion: sessionData.observation_question || generateFallbackQuestion(sessionData),
        benchmarksPre: sessionData.benchmarks_pre,
        benchmarksPost: sessionData.benchmarks_post,
        armorLevel: (await chrome.storage.local.get("user_progression")).user_progression?.armor_level || 0
      };
    }
  } else {
    // Standalone: load from sessionStorage (set by journal.js)
    const stored = sessionStorage.getItem("lemon_result");
    if (stored) {
      result = JSON.parse(stored);
    }
  }
  
  if (!result) {
    document.getElementById("ascii-art").textContent = "No session data found. Set an intention first.";
    return;
  }
  
  // Generate lemon
  const lemon = generateLemon(
    result.lemonState || { expression: "neutral", condition: "fresh", intensity_level: 1 },
    result.armorLevel || 0
  );
  
  document.getElementById("ascii-art").textContent = lemon.ascii_art;
  document.getElementById("state-label").textContent = lemon.state_label;
  document.getElementById("narrative-summary").textContent = 
    result.narrativeSummary || "Your session is complete.";
  document.getElementById("observation-question").textContent = 
    result.observationQuestion || "";
  
  // Populate benchmark table
  const pre = result.benchmarksPre || {};
  const post = result.benchmarksPost || {};
  
  document.getElementById("pre-motivation").textContent = pre.motivation || "—";
  document.getElementById("post-motivation").textContent = post.motivation || "—";
  document.getElementById("shift-motivation").textContent = 
    formatShift(pre.motivation, post.motivation);
  
  document.getElementById("pre-freshness").textContent = pre.lemon_freshness || "—";
  document.getElementById("post-freshness").textContent = post.lemon_freshness || "—";
  document.getElementById("shift-freshness").textContent = 
    formatShift(pre.lemon_freshness, post.lemon_freshness);
  
  document.getElementById("pre-clarity").textContent = pre.clarity || "—";
  document.getElementById("post-clarity").textContent = post.clarity || "—";
  document.getElementById("shift-clarity").textContent = 
    formatShift(pre.clarity, post.clarity);
}

function formatShift(pre, post) {
  if (pre === undefined || post === undefined) return "—";
  const diff = post - pre;
  if (diff > 0) return `↑ +${diff}`;
  if (diff < 0) return `↓ ${diff}`;
  return "— 0";
}

function generateFallbackQuestion(sessionData) {
  const pre = sessionData.benchmarks_pre || {};
  const post = sessionData.benchmarks_post || {};
  const avgDrop = ((pre.motivation || 5) - (post.motivation || 5) + 
                   (pre.lemon_freshness || 5) - (post.lemon_freshness || 5) + 
                   (pre.clarity || 5) - (post.clarity || 5)) / 3;
  
  if (avgDrop > 2) {
    return "Something shifted this session. What do you think contributed to that?";
  }
  return "How did this session compare to what you intended?";
}

// Handle done button
document.getElementById("done").addEventListener("click", () => {
  if (typeof chrome !== "undefined" && chrome.storage) {
    // Notify content script to dismiss overlay
    window.parent.postMessage({ type: "LEMON_DISMISS" }, "*");
  } else {
    window.close();
  }
});

init();
```

### 6.4 Test
- Load lemon.html after journal submission
- Verify ASCII art renders in monospace
- Verify benchmark table shows correct values
- Verify shift arrows and colors
- Test with missing data (should show "—")

---

# SUB-PLAN 7: Feed Simulation Video

## Objective
Standalone HTML page that simulates an accelerating social media feed. Record for pitch deck.

## Steps

### 7.1 Create feed-sim/index.html (25 min)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      background: #0a0a0a;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: Arial, sans-serif;
    }
    
    #phone-frame {
      width: 390px;
      height: 700px;
      background: #000;
      border-radius: 40px;
      overflow: hidden;
      position: relative;
      border: 3px solid #333;
    }
    
    #feed-container {
      height: 100%;
      overflow-y: hidden;
      padding: 20px 0;
      position: relative;
    }
    
    .post-card {
      background: #1a1a1a;
      margin: 0 16px 16px;
      padding: 20px;
      border-radius: 12px;
      animation: slideUp 0.3s ease-out;
      position: relative;
    }
    
    .sentiment-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #333;
      color: #fff;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .sentiment-badge.outrage { background: #8b0000; }
    .sentiment-badge.anxiety { background: #4a4a6a; }
    .sentiment-badge.sadness { background: #1a3a5c; }
    .sentiment-badge.envy { background: #2d5a1e; }
    .sentiment-badge.inspiration { background: #b8860b; }
    .sentiment-badge.joy { background: #2d6a4f; }
    
    .post-title {
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 8px;
      margin-right: 80px;
    }
    
    .post-desc {
      font-size: 13px;
      color: #aaa;
    }
    
    @keyframes slideUp {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    #stop-button {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      background: #ff4444;
      color: white;
      border: none;
      padding: 16px 40px;
      font-size: 20px;
      font-weight: bold;
      border-radius: 30px;
      cursor: pointer;
      z-index: 10;
      opacity: 0.9;
      letter-spacing: 2px;
    }
    
    #stop-button:hover {
      opacity: 1;
      background: #ff0000;
    }
    
    #session-complete {
      display: none;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #ff4444;
      font-size: 28px;
      font-weight: bold;
      text-align: center;
      z-index: 20;
      background: rgba(0,0,0,0.9);
      padding: 30px;
      border-radius: 20px;
      border: 2px solid #ff4444;
    }
  </style>
</head>
<body>
  <div id="phone-frame">
    <div id="feed-container"></div>
    <button id="stop-button">STOP</button>
    <div id="session-complete">SESSION<br>COMPLETE</div>
  </div>
  
  <script>
    const posts = [
      { title: "You won't BELIEVE what happened next", desc: "The shocking truth they don't want you to know...", sentiment: "outrage", emoji: "😡" },
      { title: "This changed my life in 30 seconds", desc: "Why everyone is obsessed with this simple hack...", sentiment: "inspiration", emoji: "✨" },
      { title: "They're hiding this from you", desc: "The mainstream media won't cover this story...", sentiment: "anger", emoji: "😡" },
      { title: "Watch before it gets deleted", desc: "Controversial footage that's going viral...", sentiment: "anxiety", emoji: "😰" },
      { title: "I tried this trend and instantly regretted it", desc: "Don't make the same mistake I did...", sentiment: "sadness", emoji: "😢" },
      { title: "The REAL reason you're unhappy", desc: "It's not your fault — it's the algorithm...", sentiment: "outrage", emoji: "😡" },
      { title: "She got everything I wanted by 22", desc: "How she built her empire while I was scrolling...", sentiment: "envy", emoji: "🟢" },
      { title: "This puppy will make your day", desc: "You won't stop smiling after seeing this...", sentiment: "joy", emoji: "😂" },
      { title: "What they found in the ocean is terrifying", desc: "Scientists are calling it unprecedented...", sentiment: "anxiety", emoji: "😰" },
      { title: "Wake up — it's worse than you think", desc: "The data they don't want you to see...", sentiment: "anger", emoji: "😡" },
    ];
    
    let interval = 1000;
    let postIndex = 0;
    let timerId = null;
    let stopped = false;
    
    const feedContainer = document.getElementById("feed-container");
    const stopButton = document.getElementById("stop-button");
    const sessionComplete = document.getElementById("session-complete");
    
    function showNextPost() {
      if (stopped) return;
      
      const post = posts[postIndex % posts.length];
      
      const card = document.createElement("div");
      card.className = "post-card";
      card.innerHTML = `
        <div class="sentiment-badge ${post.sentiment}">${post.emoji} ${post.sentiment.toUpperCase()}</div>
        <div class="post-title">${post.title}</div>
        <div class="post-desc">${post.desc}</div>
      `;
      
      feedContainer.appendChild(card);
      
      // Scroll to bottom
      feedContainer.scrollTop = feedContainer.scrollHeight;
      
      // Remove old cards if too many
      while (feedContainer.children.length > 7) {
        feedContainer.removeChild(feedContainer.firstChild);
      }
      
      postIndex++;
      interval *= 0.75; // Exponential acceleration
      
      timerId = setTimeout(showNextPost, Math.max(interval, 80));
    }
    
    stopButton.addEventListener("click", () => {
      stopped = true;
      clearTimeout(timerId);
      stopButton.style.display = "none";
      sessionComplete.style.display = "block";
    });
    
    // Start the feed
    showNextPost();
    
    // Auto-stop after all posts cycle twice
    setTimeout(() => {
      if (!stopped) stopButton.click();
    }, 20000);
  </script>
</body>
</html>
```

### 7.2 Record
- Open `feed-sim/index.html` in Chrome
- Enter fullscreen (F11)
- Start screen recording (OBS or native tool)
- Let feed play, hit STOP button around 10-15 seconds in
- Stop recording
- Save as `feed-simulation.mp4`

### 7.3 Test
- Verify animation is smooth
- Verify sentiment badges visible
- Verify STOP button works
- Verify SESSION COMPLETE appears
- Check recording quality

---

# SUB-PLAN 8: Pitch Deck Assembly

## Objective
10-slide deck with embedded recordings, ready to present.

## Steps

### 8.1 Slide Structure

**Slide 1: Title**
- Product Name: "Lemon Battle Companion" (or your chosen name)
- Tagline: "Equip your lemon. Fight the algorithm."
- Team names
- Hackathon name/date

**Slide 2: The Problem**
- "The algorithm is winning."
- Bullet points:
  - We scroll for hours, feel worse, don't know why
  - Content is designed to hijack emotions
  - No tool connects WHAT you consume to HOW you feel

**Slide 3: Our Solution**
- "Meet your lemon."
- Screenshot of ASCII lemon (glowing state)
- "An emotional battle companion that shows you exactly how content affects you"

**Slide 4: How It Works**
- Three steps with icons:
  1. Set Intention — What do you want to feel?
  2. Scroll Aware — We analyze the emotional charge
  3. Reflect & Grow — Your lemon shows the impact

**Slide 5: The Feed (Video)**
- Embedded `feed-simulation.mp4`
- Caption: "Every post carries an emotional charge. Most of it is designed to drain you."

**Slide 6: The Reflection (Video)**
- Embedded `extension-demo.mp4`
- Caption: "Set your intention. Journal after. Watch your lemon react."

**Slide 7: The Psychology**
- "Putting feelings into words matters."
- Quote: "Affect labeling reduces amygdala response." (Lieberman et al.)
- The lemon makes the invisible visible

**Slide 8: The Tech**
- Chrome Extension (Manifest V3)
- LLM Sentiment Analysis (Claude/OpenAI)
- ASCII Art Visualization
- Zero social features. Private by design.

**Slide 9: The Vision**
- Armor progression system
- Breakthrough milestones
- Content theme training
- "Killing toxic algorithms, one session at a time."

**Slide 10: Thank You**
- ASCII lemon in armored state
- Team contact info
- "Try it yourself: [link]"

### 8.2 Build (Timing: Parallel with recordings)

| Step | Time |
|------|------|
| Create title + problem slides | 10 min |
| Create solution + how it works | 10 min |
| Insert feed video placeholder | 5 min |
| Insert extension video placeholder | 5 min |
| Create psychology + tech slides | 10 min |
| Create vision + thank you | 10 min |
| Insert final videos | 5 min |
| Polish design | 10 min |

### 8.3 Speaker Notes Template

**Slide 1:** "[Name] here. In the next two minutes, we're going to show you something that changes how you see social media forever."

**Slide 2:** "We all know the feeling. You open TikTok or YouTube Shorts. Twenty minutes later you feel anxious, drained, or angry. You don't know why. The algorithm is designed to keep you scrolling by triggering your emotions — and it's winning."

**Slide 3:** "So we built a battle companion. This is your lemon. It's a visual representation of your emotional state. And it's here to help you fight back."

**Slide 4:** "Here's how it works in three steps. One: before you scroll, you set an intention. How do you want to feel? Two: you scroll. Three: you journal for 30 seconds about how you actually feel. Your lemon updates to show you the impact."

**Slide 5:** "Watch what happens during a typical session. [Play feed video] Every single post carries an emotional charge. Outrage, anxiety, envy. The algorithm feeds you more of what hooks you, not what helps you. And it accelerates. [Video ends with STOP] Until you stop it."

**Slide 6:** "Now watch the full experience. [Play extension video] Intention set. Session complete. Journal. And the lemon reveals the damage — or the growth. Your benchmarks drop, and the lemon shows you exactly where."

**Slide 7:** "Here's why this matters psychologically. Research shows that simply putting your feelings into words — a process called affect labeling — actually reduces activity in your amygdala, your brain's fear center. Our journaling feature isn't just data. It's therapeutic."

**Slide 8:** "Technically, it's a Chrome extension using Manifest V3. We use LLM sentiment analysis to process journal entries and generate ASCII lemon art. Everything is stored locally. No accounts, no sharing, no social features. We're fighting the attention economy, not building another one."

**Slide 9:** "Where we're going: as users complete more sessions, the lemon earns armor and weaponry. Breakthrough milestones mark real habit change. Eventually, users can train themselves to seek out content that helps them thrive. Killing toxic algorithms, one session at a time."

**Slide 10:** "We built this in 3.5 hours. Imagine what we could do with more. Thank you. Questions?"

---

## Final Checklist

- [ ] Chrome extension loads and detects YouTube Shorts
- [ ] Intention overlay appears and saves to storage
- [ ] Journal overlay appears and saves to storage
- [ ] LLM analysis returns valid JSON
- [ ] Fallback analysis works without API
- [ ] ASCII lemon generator outputs correct art for all states
- [ ] Lemon reveal page displays all data correctly
- [ ] Feed simulation recorded
- [ ] Extension flow recorded
- [ ] Pitch deck complete with embedded videos
- [ ] Speaker notes written
- [ ] Full run-through completed
- [ ] Backup files on USB or secondary machine
- [ ] API key confirmed working
- [ ] Battery charged, dongles packed
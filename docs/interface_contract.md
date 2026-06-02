# Interface Contract

## System Components

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Chrome Extension │────▶│  LLM Sentiment   │────▶│   ASCII Lemon   │
│  (User Input)    │     │    Analysis      │     │   Generator     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
  Journal Notes            Narrative Summary          ASCII Art String
  Benchmark Scores         Structured Tags            Display Ready
```

---

## Interface 1: Chrome Extension → LLM Sentiment Analysis

### Input Contract

```json
{
  "session_id": "string (uuid)",
  "timestamp": "ISO 8601 string",
  "intention": {
    "desired_emotion": "string",
    "avoid_emotion": "string",
    "if_feeling_action": "string"
  },
  "benchmarks_pre": {
    "motivation": "integer (1-10)",
    "lemon_freshness": "integer (1-10)",
    "clarity": "integer (1-10)"
  },
  "journal_notes": "string (freeform user text)",
  "benchmarks_post": {
    "motivation": "integer (1-10)",
    "lemon_freshness": "integer (1-10)",
    "clarity": "integer (1-10)"
  },
  "session_context": {
    "duration_minutes": "integer",
    "content_theme_selected": "string | null"
  }
}
```

### Output Contract

```json
{
  "session_id": "string (uuid)",
  "narrative_summary": "string (2-4 sentences, plain English, second-person)",
  "emotion_analysis": {
    "predominant_emotion": "anxiety | anger | sadness | envy | inspiration | joy | neutral",
    "intensity": "integer (1-10)",
    "secondary_emotion": "anxiety | anger | sadness | envy | inspiration | joy | neutral | null",
    "emotional_shift": {
      "direction": "improved | declined | stable",
      "description": "string (brief, 1 sentence)"
    }
  },
  "benchmark_insight": {
    "biggest_shift": "motivation | lemon_freshness | clarity",
    "shift_magnitude": "integer (absolute difference pre to post)",
    "interpretation": "string (1 sentence)"
  },
  "lemon_state": {
    "expression": "anxious | angry | sad | envious | inspired | joyful | neutral",
    "condition": "fresh | slightly_wilted | wilted | faded | brown_spots | cracked | moldy | glowing | armored_helmet | armored_sword_shield",
    "intensity_level": "integer (1-5, maps to visual severity)"
  },
  "observation_question": "string (1 gentle, non-prescriptive question)"
}
```

---

## Interface 2: LLM Sentiment Analysis → ASCII Lemon Generator

### Input Contract

```json
{
  "lemon_state": {
    "expression": "anxious | angry | sad | envious | inspired | joyful | neutral",
    "condition": "fresh | slightly_wilted | wilted | faded | brown_spots | cracked | moldy | glowing | armored_helmet | armored_sword_shield",
    "intensity_level": "integer (1-5)"
  }
}
```

### Output Contract

```json
{
  "ascii_art": "string (multi-line ASCII art, monospace-ready)",
  "state_label": "string (human-readable label, e.g. 'Your lemon is looking faded today')"
}
```

---

## Interface 3: Expression ↔ Condition Mapping Table

| Predominant Emotion | Expression | Negative Condition | Positive Condition |
|---------------------|------------|-------------------|-------------------|
| Anxiety | Anxious | Faded/Washed-out | — |
| Anger | Angry | Brown spots/Rotting | — |
| Sadness | Sad | Missing pieces/Cracks | — |
| Envy | Envious | Mold at edges | — |
| Inspiration | Inspired | — | Glowing |
| Joy | Joyful | — | Fresh + Glow |
| Neutral | Neutral | Slightly wilted | Fresh |

**Intensity Level (1-5):**
- 1-2: Subtle visual change
- 3: Moderate visual change
- 4-5: Severe visual change (max decay or max glow)

**Armor/Weaponry (separate from condition):**
- Added based on cumulative positive trend data (not single session)
- Levels: Helmet → Shield → Sword → Full Plate
- Stored separately in `chrome.storage.local` as `armor_level: 0-4`

---

## Interface 4: Benchmark Shift → Condition Severity Mapping

```
For each benchmark (motivation, lemon_freshness, clarity):
  pre_score - post_score = drop_magnitude

If any benchmark drops by >= 5: intensity = 5
If any benchmark drops by 3-4:  intensity = 4
If any benchmark drops by 1-2:  intensity = 3
If no drop or improvement:        intensity = 1 (positive condition)
If all benchmarks improve >= 2:   intensity = 1 + glow
```

---

## Interface 5: Observation Question Contract

### Input
```
predominant_emotion, content_theme_selected, emotional_shift.direction
```

### Output Template
```
"You've reported feeling {predominant_emotion} after {session_context} sessions 
{count} times this week. Any thoughts on what's pulling you toward that content?"
```

### Rules
- Never prescriptive (no "you should")
- Never generic wellness advice
- Always ends with a question mark
- References specific observed pattern when possible
- Defaults to: "Something shifted this session. Want to sit with that for a moment?" if no pattern detected

---

## Interface 6: Chrome Extension Storage Schema

```json
{
  "current_session": {
    "session_id": "string",
    "intention": {},
    "benchmarks_pre": {},
    "start_time": "ISO 8601",
    "status": "intention_set | scrolling | journaling | complete"
  },
  "session_history": [
    {
      "session_id": "string",
      "date": "ISO 8601",
      "intention": {},
      "benchmarks_pre": {},
      "benchmarks_post": {},
      "journal_notes": "string",
      "emotion_analysis": {},
      "lemon_state": {},
      "narrative_summary": "string"
    }
  ],
  "user_progression": {
    "armor_level": "integer (0-4)",
    "total_sessions": "integer",
    "positive_streak": "integer",
    "breakthrough_milestones_earned": ["string"]
  }
}
```

---

## Interface 7: Feed Simulation Video (Standalone HTML)

### Contract
```
Input: None (hardcoded for recording)
Output: Screen recording MP4

Structure:
- 5-7 fake YouTube Shorts cards
- Each card: title (string), description (string), sentiment tag (emoji + label)
- Speed: starts at 1 card/second, accelerates exponentially
- Stopped by: "STOP" button overlay
- Final frame: last card freeze + "SESSION COMPLETE" text
```

### Fake Content Schema
```json
[
  {
    "title": "string",
    "description": "string",
    "sentiment": "outrage | anxiety | sadness | envy | inspiration | joy | neutral",
    "sentiment_emoji": "😡 | 😰 | 😢 | 🟢 | ✨ | 😂 | 😐"
  }
]
```

---

## Validation Rules

1. All benchmark scores must be integers 1-10 inclusive
2. `session_id` must be unique per session
3. `journal_notes` accepts empty string (user may skip)
4. `predominant_emotion` must be from the approved set
5. ASCII art output must use monospace-compatible characters only
6. Observation question must never contain imperatives or wellness advice

---

## Error States

| Error | Handling |
|-------|----------|
| Empty journal notes | Return neutral emotion, condition based on benchmark shifts only |
| LLM timeout/failure | Return fallback: `{ predominant_emotion: "neutral", intensity: 1, narrative_summary: "Take a moment to reflect when you're ready." }` |
| Invalid benchmark input | Clamp to 1-10 range |
| Missing session data | Use pre-session benchmarks only, note missing data in summary |

---

Ready for Implementation Notes or Master Plan next.
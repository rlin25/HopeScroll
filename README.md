# HopeScroll — Your Brainrot Champion

> *Set your intention. Watch your shorts. Meet your lemon.*

---

## The Problem

The algorithm is winning.

YouTube Shorts is engineered to maximize watch time — not wellbeing. Every scroll feeds the recommendation engine data about what keeps you hooked: outrage, anxiety, envy, dopamine spikes. Most people finish a session feeling drained, distracted, or vaguely bad — and have no idea why.

There's no tool that connects **what you consumed** to **how you feel**. Until now.

---

## What It Does

**HopeScroll** is a Chrome extension that sits between you and your feed. It asks you what you want to feel before you scroll, tracks the emotional charge of every video you watch, analyzes your reflection after, and shows you exactly what the algorithm did to your head.

Your guide through all of it: **the lemon** — a brutalist ASCII mascot that transforms session by session, decaying or glowing based on what you consumed and how you came out the other side.

---

## The Flow

```
┌─────────────────────────────────────────────────────────────┐
│  PRE-SESSION                                                │
│                                                             │
│  "I'll watch  5  shorts."                                   │
│                                                             │
│  "I WANT TO FEEL ___"  →  2D valence/arousal spectrum       │
│                            click your intended emotion      │
└─────────────────────────────────────────────────────────────┘
                           ↓ scroll YouTube Shorts
┌─────────────────────────────────────────────────────────────┐
│  DURING SESSION                                             │
│                                                             │
│  Extension silently tracks every Short:                     │
│  • Video title + description + tags (YouTube Data API)      │
│  • Full transcript/captions (scraped in parallel)           │
│                                                             │
│  After your planned count → journal overlay auto-pops       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  POST-SESSION                                               │
│                                                             │
│  "HOW I AM FEELING"  →  write freely                        │
│                                                             │
│  Claude reads your words, infers your emotional state,      │
│  and maps it onto the valence/arousal spectrum              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  THE REVEAL                                                 │
│                                                             │
│  Your ASCII lemon appears — fresh, faded, cracked, glowing  │
│                                                             │
│  • Narrative: what the session actually did to you          │
│  • Journey map: where you wanted to be vs where you ended up│
│  • Content breakdown: dominant sentiment of what you watched│
│  • Observation question: one thing worth sitting with       │
└─────────────────────────────────────────────────────────────┘
```

---

## The Lemon

The lemon is not a gimmick. It's a diagnostic tool.

Each state maps to a specific emotional toll:

| Condition | Emotion | Visual |
|-----------|---------|--------|
| Glowing   | Inspired / Joyful | `✦✦✦` scattered, bright |
| Fresh     | Calm / Content | Clean block form |
| Faded     | Anxious | Washed-out `░░░` texture |
| Brown spots | Angry | `**` rot marks |
| Cracked   | Sad | `\/` fracture lines |
| Moldy     | Envious | `~~~` creeping edges |

Sustained positive streaks earn the lemon **armor** — a helmet, then a sword and shield. Fighting the algorithm, session by session.

---

## Why It Works: The Psychology

**Affect labeling** — the act of putting feelings into words — measurably reduces amygdala activity (Lieberman et al., 2007). The journal isn't a data-collection form. It's therapeutic.

HopeScroll makes the invisible visible: the emotional charge of content flows in, gets reflected back, and the gap between what you intended to feel and what you actually feel becomes something you can *see*.

No prescriptive nudges. No wellness advice. No "try drinking water." Just a mirror.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Chrome Extension (Manifest V3)                             │
│                                                             │
│  content-script.js                                          │
│  ├── Injects intention overlay on youtube.com/shorts/*      │
│  ├── Watches URL/title changes via MutationObserver         │
│  ├── Captures video ID + title per Short                    │
│  └── Auto-triggers journal after planned count              │
│                                                             │
│  background.js (Service Worker)                             │
│  ├── Batch-fetches metadata: YouTube Data API v3            │
│  ├── Fetches transcripts: scrapes ytInitialPlayerResponse   │
│  ├── Builds enriched content list (title + desc + transcript│
│  ├── Calls Claude Haiku for sentiment analysis              │
│  └── Maps inferred emotion → valence/arousal coordinates    │
│                                                             │
│  storage.js                                                 │
│  └── All state in chrome.storage.local — zero backend       │
└─────────────────────────────────────────────────────────────┘
```

### APIs Used

| API | Purpose |
|-----|---------|
| **Anthropic Claude Haiku** | Sentiment analysis, emotion inference from journal text, content classification, narrative generation |
| **YouTube Data API v3** | Batch video metadata: title, description, tags, channel |
| **YouTube Timedtext** | Full transcript/captions scraped from player response (same method as `youtube-transcript` npm library) |

---

## Emotion Model

Pre and post-session emotions are plotted on a **2D valence/arousal spectrum** — the same model used in affective computing research:

```
           ACTIVATED
               ↑
  angry    anxious │ excited   joyful
  stressed  tense  │ energized  elated
─────────────────── ┼ ──────────────── →
  sad   depressed  │ content   serene    PLEASANT
  bored  fatigued  │ calm     relaxed
               ↓
           DEACTIVATED
```

Claude classifies post-session journal text against this 28-emotion vocabulary. The journey map shows the gap between **intended** and **actual** — visualized as two dots with a dashed arrow.

---

## Setup

### Prerequisites
- Chrome (or any Chromium browser)
- An [Anthropic API key](https://console.anthropic.com/)
- A [Google Cloud API key](https://console.cloud.google.com/) with **YouTube Data API v3** enabled

### Install

1. Clone this repo
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** → select the `extension/` folder
5. Click the HopeScroll icon in the toolbar
6. Paste your **Anthropic API key** → SAVE KEY
7. Paste your **YouTube API key** → SAVE KEY

### Use

1. Navigate directly to `youtube.com/shorts/[any-id]`
2. Set how many Shorts you'll watch
3. Choose your intended emotion on the spectrum
4. Scroll
5. When your planned count is reached, the journal auto-pops
6. Write how you feel — Claude does the rest

---

## Privacy

Everything stays on your machine. No accounts. No backend. No data leaves your browser except the two API calls (Anthropic and Google). Session history lives in `chrome.storage.local`.

We're fighting the attention economy. We're not building another one.

---

## Feed Simulation

Open `feed-sim/index.html` in Chrome for a standalone demo of an accelerating algorithmic feed with sentiment badges — built for pitch deck recording.

---

## Tech Stack

- Chrome Extension (Manifest V3)
- Vanilla JS / HTML / CSS — zero frameworks, zero build step
- Brutalist ASCII art with per-character CSS coloring
- Claude Haiku (`claude-haiku-4-5-20251001`) via Anthropic Messages API
- YouTube Data API v3 for video metadata
- YouTube transcript scraping (no third-party library)

---

*Built at [Build for Humans Hackathon - #NYTechWeek] · 2026*

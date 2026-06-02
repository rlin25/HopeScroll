# Decisions Document: Algorithm Battle Companion

## Project Overview
A browser extension that helps users understand and combat the emotional impact of algorithmically-driven social media content, using YouTube Shorts as the initial platform. Users set intentions before scrolling, journal after, and receive emotional insights through sentiment analysis and an ASCII lemon mascot that visualizes their emotional state.

---

## 1. Platform & Container

**Decision:** Chrome browser extension  
**Rationale:** Fastest path to a functional prototype for a 3.5-hour hackathon. Triggers on YouTube Shorts URL detection. No app store approval, no mobile development, no backend required. Uses `chrome.storage.local` for session data.  
**Rejected:** Native mobile app (too complex for timeframe), Instagram/TikTok APIs (unavailable or hostile to third-party access).

---

## 2. Content Platform

**Decision:** YouTube Shorts via YouTube Data API v3  
**Rationale:** Stable, well-documented, free-tier API that provides title, description, tags, and comments. Sufficient for prototype sentiment pipeline.  
**Rejected:** Instagram (no dwell time, hostile API), TikTok (effectively no API access for this use case).

---

## 3. Content Scope

**Decision:** Engagement-based signals only  
**Rationale:** External APIs don't expose dwell/swipe time. Use likes, comments, and available metadata as proxies for attention and impact.  
**Rejected:** Feed-wide passive analysis with dwell time (privacy-invasive, technically impossible with available APIs).

---

## 4. Session Structure

**Decision:** Pre-session intention setting, then content session, then post-session journaling with benchmark comparison  
**Rationale:** Non-interruptive. Frames the session as an intentional act. Creates a clean data triangle: intention → content consumed → post-session emotional state.  
**Rejected:** Interval-based check-ins during session (too intrusive, harms flow).

---

## 5. Intention-Setting Format

**Decision:** Guided fill-in-the-blank template: "I want to feel [emotion] while scrolling. I want to avoid feeling [emotion]. If I start feeling [emotion], I'll [action]."  
**Rationale:** Teaches the form of a useful intention quickly. Avoids blank-box paralysis. Freeform after first session.  
**Rejected:** Open text box with no structure, example-based prompts only.

---

## 6. Post-Session Journaling Trigger

**Decision:** Benchmark-driven prompt with intention displayed as subtle context  
**Rationale:** Shows pre/post benchmark scores (Motivation, Lemon Freshness, Clarity) and asks: "Something shifted here. What do you think contributed?" Makes reflection data-informed and ties quantitative and qualitative layers together.  
**Rejected:** Intention-referencing contrast prompt alone, open-ended "how do you feel?" with no data context.

---

## 7. Numeric Benchmarks

**Decision:** Three benchmarks asked every session, pre and post:
- Motivation ("How motivated are you for what comes next?")
- Lemon Freshness ("How fresh does your lemon feel?")
- Mental Clarity ("How clear or foggy is your head right now?")

**Rationale:** Motivation, reward system state, and cognitive load are three distinct dimensions. Consistent longitudinal data enables clean trend visualization. Lemon Freshness uses the "lemon metaphor" (dopamine depletion as a squeezed lemon) without clinical language.  
**Rejected:** Dynamic benchmarks triggered by content signature (loses consistency), emotional temperature benchmark (overlaps with journaling).

---

## 8. Sentiment Analysis Approach

**Decision:** Emotion-specific classification using 4–6 emotions (anger, anxiety, sadness, envy, inspiration, joy)  
**Rationale:** Specific emotions enable actionable insights ("Your anxiety spikes after outrage content") rather than circular findings ("Negative content makes you feel negative"). Pre-trained sentiment API with emotion labels for hackathon speed.  
**Rejected:** Simple positive/negative/neutral valence scoring.

---

## 9. Sentiment Analysis Output Format

**Decision:** Narrative summary + structured tags  
**Rationale:** A short plain-English reflection demonstrates the core psychological value (putting feelings into words and seeing them mirrored back). Structured tags (`predominant_emotion`, `intensity`, `lemon_state`) drive the ASCII lemon generation. Both deliverables in one output.  
**Rejected:** JSON-only output (doesn't demonstrate the "putting into words" value).

---

## 10. ASCII Lemon Mascot

**Decision:** Pre-written hardcoded ASCII states with simple if-logic for the demo. Two-moment reveal (pre-session state, then post-session transformed state).  
**Rationale:** Hardcoded ASCII is instant, reliable, and hackathon-fast. The before/after reveal is theatrical and memorable for a pitch. Dynamic LLM-generated ASCII pitched as long-term vision.  
**Rejected:** Persistent on-screen lemon, live LLM-generated ASCII art.

---

## 11. Mascot State — Expression vs. Condition

**Decision:** Expression reflects the predominant emotion. Condition (decay vs. freshness) reflects the emotional toll. Two separate visual languages.  
**Rationale:** Creates a richer, more precise mascot. Expression says "what I'm feeling," condition says "what that feeling is doing to me."

---

## 12. Negative Emotion → Decay Visual Mapping

**Decision:**
- Anxiety → faded/washed-out appearance
- Anger → brown/rotting spots
- Sadness → missing pieces/cracks
- Envy → mold creeping at edges

**Rationale:** Each decay trait communicates a specific emotional toll at a glance. The user learns to read the lemon as a diagnostic tool.  
**Rejected:** Mapping decay to benchmark drops instead of emotions, treating all decay as a single "negative" blob.

---

## 13. Positive Visual Progression

**Decision:** Cosmetic glow and freshness for positive sessions. Armor and weaponry earned through sustained positive trends over weeks/months (long-term resilience progression).  
**Rationale:** Creates short-term emotional mirror and long-term engagement loop. Armor/weaponry represent growing emotional resilience, not combat against content. Ties to the adversarial "battle against the algorithm" framing.  
**Rejected:** Purely cosmetic positive states only, armor as baseline positive state.

---

## 14. Mascot State Driver

**Decision:** Composite model using content sentiment + benchmark shifts + session duration behind the scenes, displayed simply.  
**Rationale:** A mascot reacting only to Lemon Freshness score is just a mirror. Synthesizing all data creates a genuine summary of the session's toll or benefit. Simple presentation, depth available on tap.  
**Rejected:** Single-source (Lemon Freshness benchmark only).

---

## 15. Onboarding

**Decision:** Intentional minimal onboarding — only the intention-setting template is taught. The lemon is intuited through experience.  
**Rationale:** The metaphor is strong and users learn the relationship experientially. A narrative tutorial adds unnecessary friction for a hackathon and risks over-explaining.  
**Rejected:** Full narrative micro-journey onboarding explaining the lemon metaphor.

---

## 16. Post-Session Observation Question

**Decision:** A single, gentle observation question with no prescription: "You've reported feeling [emotion] after [content-type]-heavy sessions three times this week. Any thoughts on why that type of content pulls you in?"  
**Rationale:** Treats the user as the expert on their own experience. No generic wellness advice ("take a walk"). Hands agency entirely to the user.  
**Rejected:** Prescriptive action suggestions, content-curiosity redirects pushed post-session.

---

## 17. Action Points Rhythm

**Decision:** Weekly insight-driven suggestions based on aggregated session data. Example: "Your lemon tends to wilt after outrage-heavy sessions. Try a 10-minute limit and see how you feel."  
**Rationale:** Weekly suggestions feel earned and thoughtful. Enough data to spot real patterns, not noise. Aligns with long-term resilience arc.  
**Rejected:** Post-session micro-suggestions (risk feeling pushy).

---

## 18. Content Blocking Mechanism

**Decision:** Content theme selection before sessions, plus awareness flagging during intention-setting  
**Rationale:** Works with the power you actually have (influencing user behavior) rather than promising technical blocking that isn't feasible. "Blocking" is psychological and intentional, not technical.  
**Rejected:** Platform-native preference tuning guidance, technical content blocking.

---

## 19. Victory/Milestone Design

**Decision:** Periodic breakthrough milestones with visible impact at resilience thresholds. The lemon earns new armor pieces, a striking visual moment occurs, and a concrete stat is revealed. Victory is personal, not permanent.  
**Rationale:** Even adversarial stories need moments of triumph. Prevents the grind feeling endless. Mirrors real habit change.  
**Rejected:** No victory condition (endless grind), permanent "algorithm defeated" messaging.

---

## 20. Sharing & Social Features

**Decision:** No social features. The app is a private sanctuary.  
**Rationale:** Hackathon constraint. Also philosophically aligned: you don't fight the attention economy by building another one. Privacy as differentiator.  
**Rejected:** Anonymous milestone sharing, any social graph.

---

## 21. Hackathon Demo Architecture

**Decision:** Chrome extension prototype with pre-recorded supplemental videos for the pitch deck  
**Deliverables:**
- Pitch deck (primary)
- Screen recording of accelerating feed simulation (HTML/CSS/JS, LLM-generated, with sentiment tags)
- Recording of extension flow (intention → YouTube → journaling → lemon reveal)
- Live or recorded LLM sentiment analysis of sample journal notes
- ASCII lemon visualization based on sentiment output

**Rejected:** Fully integrated live prototype (unnecessary for hackathon pitch format).

---

## 22. Demo Session Simulation

**Decision:** Rapid-fire simulated feed with accelerating speed, stopped by user hitting a "STOP" button  
**Rationale:** Viscerally conveys how a session spirals. The act of stopping is a micro-moment of fighting back. Theatrical for a pitch.  
**Rejected:** Static summary card, timer-based auto-stop.

---

## 23. Video-to-Prototype Handoff

**Decision:** Separate pitch deck with embedded video recordings. No live clickable prototype needed.  
**Rationale:** Pitch deck + recordings is the format you committed to. Keeps scope tight for 3.5 hours.  
**Rejected:** Embedded video in prototype, live alt-tabbing between demo and video.

---

## 24. Tagline & Public Identity

**Decision:** Adversarial framing — "Equipping your lemon to do battle with the algorithms." Public identity leads with the fight. The lemon is the emotional heart.  
**Rationale:** Aligns with armor/weaponry progression, STOP button, and content theme selection features. Cohesive with visual language.  
**Rejected:** Self-care/wellness framing (Fitbit for emotions), self-mastery tone.

---

## Summary of Key Architectural Principles

- **Privacy-first:** No sharing, no social graph, local storage
- **Psychological depth over technical gimmicks:** Journaling and intention-setting are the core value
- **User agency:** No unsolicited advice, no prescriptive nudges
- **Adversarial but compassionate:** Fighting the algorithm, protecting the lemon
- **Hackathon-scoped:** Pre-recorded demo, hardcoded where possible, vision pitched for future
- **Emotion-specific, not valence-only:** Specific insights drive action
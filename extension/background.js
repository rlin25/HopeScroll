chrome.runtime.onInstalled.addListener(() => {
  console.log("HopeScroll installed");
});

const PROMPT_TEMPLATE = `You are analyzing a YouTube Shorts scrolling session.

CONTENT CONSUMED (titles + transcripts where available):
{content_list}

INTENDED FEELING: "{feeling_intended}" (what the user wanted to feel)
PLANNED SHORTS: {planned_shorts} | ACTUALLY WATCHED: {watched_count}

USER'S JOURNAL (written after the session — infer their actual emotional state from this):
{journal_notes}

Return ONLY valid JSON with this exact structure:
{
  "inferred_feeling": {
    "label": "the single closest emotion from this exact list: angry, tense, stressed, anxious, afraid, overwhelmed, sad, depressed, bored, fatigued, frustrated, envious, numb, uncertain, excited, elated, joyful, energized, inspired, amped, calm, relaxed, content, serene, grateful, hopeful, proud, happy"
  },
  "narrative_summary": "2-3 sentences. Reference the journal, the content consumed, and how they compare to the intended feeling. Second person. Gentle tone. No advice.",
  "content_analysis": {
    "videos_analyzed": 0,
    "dominant_sentiment": "outrage | anxiety | sadness | envy | inspiration | joy | neutral | mixed",
    "sentiment_breakdown": {
      "outrage": 0,
      "anxiety": 0,
      "sadness": 0,
      "envy": 0,
      "inspiration": 0,
      "joy": 0,
      "neutral": 0
    },
    "content_vs_experience": "One sentence comparing what they consumed to how they actually feel."
  },
  "emotion_analysis": {
    "predominant_emotion": "anxiety | anger | sadness | envy | inspiration | joy | neutral",
    "intensity": 5,
    "secondary_emotion": null,
    "emotional_shift": {
      "direction": "improved | declined | stable",
      "description": "one brief sentence"
    }
  },
  "benchmark_insight": {
    "biggest_shift": "motivation | lemon_freshness | clarity",
    "shift_magnitude": 2,
    "interpretation": "one sentence"
  },
  "lemon_state": {
    "expression": "anxious | angry | sad | envious | inspired | joyful | neutral",
    "condition": "fresh | slightly_wilted | wilted | faded | brown_spots | cracked | moldy | glowing",
    "intensity_level": 3
  },
  "observation_question": "one gentle question referencing the specific content-to-emotion pattern observed. end with ?"
}

RULES:
- inferred_feeling.label MUST be one of the 28 words listed above — no others.
- If journal is empty, infer from content pattern vs intended feeling.
- For videos WITH [TRANSCRIPT]: use transcript as the primary sentiment signal; title is secondary context.
- For videos marked [NO TRANSCRIPT]: classify from title only (lower confidence).
- Count all videos in sentiment_breakdown regardless of transcript availability.
- narrative_summary MUST reference the journal, the content, and the gap from intended feeling.
- Condition mapping: anxiety/tense/stressed/afraid=faded, angry/frustrated=brown_spots, sad/depressed/numb=cracked, envious=moldy, calm/relaxed/content/serene=fresh, excited/joyful/elated/inspired=glowing.
- Intensity level: 1-2 small, 3 moderate, 4-5 large divergence from intended.
- observation_question must reference the specific content-to-emotion pattern.
- observation_question must NEVER suggest walking, breathing, drinking water, or any wellness action.`;

const VALID_EMOTIONS = ["anxiety", "anger", "sadness", "envy", "inspiration", "joy", "neutral"];
const VALID_CONDITIONS = ["fresh", "slightly_wilted", "wilted", "faded", "brown_spots", "cracked", "moldy", "glowing"];
const VALID_EXPRESSIONS = ["anxious", "angry", "sad", "envious", "inspired", "joyful", "neutral"];
const VALID_DIRECTIONS = ["improved", "declined", "stable"];
const VALID_CONTENT_SENTIMENTS = ["outrage", "anxiety", "sadness", "envy", "inspiration", "joy", "neutral", "mixed"];

const EMOTION_COORDS = {
  angry:       { x: 8,  y: 8,  q: 1 }, tense:    { x: 20, y: 16, q: 1 },
  stressed:    { x: 10, y: 28, q: 1 }, anxious:  { x: 26, y: 12, q: 1 },
  afraid:      { x: 14, y: 40, q: 1 }, overwhelmed: { x: 32, y: 8, q: 1 },
  sad:         { x: 10, y: 68, q: 2 }, depressed:{ x: 6,  y: 82, q: 2 },
  bored:       { x: 26, y: 90, q: 2 }, fatigued: { x: 14, y: 80, q: 2 },
  frustrated:  { x: 20, y: 54, q: 2 }, envious:  { x: 34, y: 44, q: 2 },
  numb:        { x: 40, y: 86, q: 2 }, uncertain:{ x: 38, y: 58, q: 2 },
  excited:     { x: 84, y: 8,  q: 3 }, elated:   { x: 93, y: 18, q: 3 },
  joyful:      { x: 76, y: 16, q: 3 }, energized:{ x: 66, y: 10, q: 3 },
  inspired:    { x: 80, y: 30, q: 3 }, amped:    { x: 92, y: 30, q: 3 },
  calm:        { x: 74, y: 84, q: 4 }, relaxed:  { x: 84, y: 90, q: 4 },
  content:     { x: 70, y: 72, q: 4 }, serene:   { x: 88, y: 78, q: 4 },
  grateful:    { x: 66, y: 62, q: 4 }, hopeful:  { x: 62, y: 46, q: 4 },
  proud:       { x: 76, y: 56, q: 4 }, happy:    { x: 84, y: 44, q: 4 },
};

// ── Transcript fetching ───────────────────────────────────────────────────────

async function fetchTranscript(videoId) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { 'Accept-Language': 'en-US,en;q=0.9' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const html = await pageRes.text();

    // Extract captionTracks array from the serialised player response
    const match = html.match(/"captionTracks":(\[.*?\])/s);
    if (!match) return null;

    let tracks;
    try { tracks = JSON.parse(match[1]); } catch { return null; }
    if (!tracks?.length) return null;

    // Prefer English ASR, then any English, then first available
    const track =
      tracks.find(t => t.languageCode === 'en' && t.kind === 'asr') ||
      tracks.find(t => t.languageCode === 'en') ||
      tracks.find(t => t.languageCode?.startsWith('en')) ||
      tracks[0];

    if (!track?.baseUrl) return null;

    const xmlRes = await fetch(track.baseUrl);
    const xml = await xmlRes.text();

    const text = [...xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)]
      .map(m =>
        m[1]
          .replace(/&amp;/g,  '&')
          .replace(/&lt;/g,   '<')
          .replace(/&gt;/g,   '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g,  "'")
          .replace(/<[^>]+>/g, '')
          .trim()
      )
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    return text.length > 0 ? text.slice(0, 500) : null;
  } catch {
    return null;
  }
}

async function fetchVideosBatch(videoIds, apiKey) {
  if (!videoIds.length || !apiKey) return {};
  try {
    const ids = videoIds.join(',');
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${ids}&part=snippet&key=${apiKey}`
    );
    if (!res.ok) return {};
    const data = await res.json();
    const map = {};
    for (const item of (data.items || [])) map[item.id] = item.snippet;
    return map;
  } catch {
    return {};
  }
}

async function enrichContent(consumedContent) {
  if (!consumedContent?.length) return [];

  const keyData = await chrome.storage.local.get("youtube_api_key");
  const ytKey = keyData.youtube_api_key;

  const [metadataMap, transcripts] = await Promise.all([
    fetchVideosBatch(consumedContent.map(v => v.video_id), ytKey),
    Promise.allSettled(consumedContent.map(v => fetchTranscript(v.video_id)))
  ]);

  return consumedContent.map((v, i) => ({
    ...v,
    metadata:   metadataMap[v.video_id] || null,
    transcript: transcripts[i].status === 'fulfilled' ? transcripts[i].value : null
  }));
}

function formatContentList(consumedContent) {
  if (!consumedContent?.length) return "(none)";
  return consumedContent.map((v, i) => {
    const sn = v.metadata;
    const lines = [`${i + 1}. "${sn?.title || v.title}"${sn?.channelTitle ? ` — ${sn.channelTitle}` : ''}`];

    if (sn?.description) {
      const desc = sn.description.replace(/\n+/g, ' ').trim().slice(0, 200);
      if (desc) lines.push(`   Description: ${desc}`);
    }
    if (sn?.tags?.length) {
      lines.push(`   Tags: ${sn.tags.slice(0, 10).join(', ')}`);
    }

    lines.push(v.transcript
      ? `   [TRANSCRIPT]: ${v.transcript}`
      : `   [NO TRANSCRIPT]`
    );

    return lines.join('\n');
  }).join('\n\n');
}

function describeMovement(before, after) {
  const QUADRANT = { 1: "activated/unpleasant", 2: "deactivated/unpleasant", 3: "activated/pleasant", 4: "deactivated/pleasant" };
  if (!before || !after) return "unknown shift";
  if (before.q === after.q) return `stayed in ${QUADRANT[after.q]} zone`;
  return `moved from ${QUADRANT[before.q]} to ${QUADRANT[after.q]}`;
}

async function analyzeSentiment(sessionData) {
  const { intention, journal_notes, consumed_content } = sessionData;

  const enrichedContent = await enrichContent(consumed_content);

  const prompt = PROMPT_TEMPLATE
    .replace("{content_list}",     formatContentList(enrichedContent))
    .replace("{feeling_intended}", intention?.feeling_intended || "unknown")
    .replace("{planned_shorts}",   intention?.planned_shorts  || "unknown")
    .replace("{watched_count}",    consumed_content?.length   || 0)
    .replace("{journal_notes}",    journal_notes || "(no journal written)");

  const keyData = await chrome.storage.local.get("api_key");
  const apiKey = keyData.api_key;
  if (!apiKey) throw new Error("No API key configured");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const data = await response.json();
  const text = data.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in response");

  return validateAnalysisResult(JSON.parse(jsonMatch[0]));
}

function validateAnalysisResult(result) {
  result.emotion_analysis = result.emotion_analysis || {};
  result.lemon_state = result.lemon_state || {};
  result.emotion_analysis.emotional_shift = result.emotion_analysis.emotional_shift || {};
  result.content_analysis = result.content_analysis || {};

  if (!VALID_EMOTIONS.includes(result.emotion_analysis.predominant_emotion)) {
    result.emotion_analysis.predominant_emotion = "neutral";
  }
  if (!VALID_CONDITIONS.includes(result.lemon_state.condition)) {
    result.lemon_state.condition = "slightly_wilted";
  }
  if (!VALID_EXPRESSIONS.includes(result.lemon_state.expression)) {
    result.lemon_state.expression = "neutral";
  }
  if (!VALID_DIRECTIONS.includes(result.emotion_analysis.emotional_shift.direction)) {
    result.emotion_analysis.emotional_shift.direction = "stable";
  }
  if (!VALID_CONTENT_SENTIMENTS.includes(result.content_analysis.dominant_sentiment)) {
    result.content_analysis.dominant_sentiment = "neutral";
  }

  result.emotion_analysis.intensity = Math.min(10, Math.max(1, result.emotion_analysis.intensity || 5));
  result.lemon_state.intensity_level = Math.min(5, Math.max(1, result.lemon_state.intensity_level || 3));
  result.content_analysis.videos_analyzed = Math.max(0, result.content_analysis.videos_analyzed || 0);
  result.content_analysis.sentiment_breakdown = result.content_analysis.sentiment_breakdown || {};

  result.inferred_feeling = result.inferred_feeling || {};
  if (!EMOTION_COORDS[result.inferred_feeling.label]) result.inferred_feeling.label = "uncertain";

  return result;
}

function getFallbackAnalysis(sessionData) {
  const consumed = sessionData.consumed_content || [];
  const before = sessionData.intention?.feeling_intended_coords;
  const after  = sessionData.feeling_actual_coords;

  // Estimate shift from quadrant movement: q1/q2 = unpleasant, q3/q4 = pleasant
  const pleasant = q => q === 3 || q === 4;
  let condition = "slightly_wilted", intensity = 2, direction = "stable";
  if (before && after) {
    if (!pleasant(before.q) && pleasant(after.q))  { condition = "glowing";    intensity = 1; direction = "improved"; }
    if (pleasant(before.q)  && !pleasant(after.q)) { condition = "cracked";    intensity = 4; direction = "declined"; }
    if (!pleasant(before.q) && !pleasant(after.q)) { condition = "faded";      intensity = 3; direction = "stable";   }
    if (pleasant(before.q)  && pleasant(after.q))  { condition = "fresh";      intensity = 1; direction = "improved"; }
  }

  const inferredLabel = direction === "improved" ? "content" : direction === "declined" ? "uncertain" : "numb";
  return {
    inferred_feeling: { label: inferredLabel },
    narrative_summary: "Take a moment to reflect when you're ready. Your lemon is here whenever you need it.",
    content_analysis: {
      videos_analyzed: consumed.length,
      dominant_sentiment: "unknown",
      sentiment_breakdown: {},
      content_vs_experience: consumed.length > 0
        ? `You watched ${consumed.length} video${consumed.length !== 1 ? "s" : ""} this session. Full analysis unavailable — check your API key.`
        : "No content was tracked this session."
    },
    emotion_analysis: {
      predominant_emotion: "neutral",
      intensity: intensity + 1,
      secondary_emotion: null,
      emotional_shift: { direction, description: "Shift estimated from emotional positions." }
    },
    benchmark_insight: { biggest_shift: "emotional_state", shift_magnitude: 0, interpretation: "" },
    lemon_state: {
      expression: direction === "improved" ? "joyful" : direction === "declined" ? "sad" : "neutral",
      condition,
      intensity_level: intensity
    },
    observation_question: "How did this session compare to what you intended?"
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ANALYZE_SESSION") {
    analyzeSentiment(message.data)
      .then(result => {
        const label  = result.inferred_feeling?.label || "uncertain";
        const coords = EMOTION_COORDS[label] || { x: 38, y: 58, q: 2 };
        sendResponse({
          success: true,
          emotionAnalysis:    result.emotion_analysis,
          lemonState:         result.lemon_state,
          narrativeSummary:   result.narrative_summary,
          observationQuestion:result.observation_question,
          contentAnalysis:    result.content_analysis,
          feelingActual:      label,
          feelingActualCoords: coords
        });
      })
      .catch(() => {
        const fallback = getFallbackAnalysis(message.data);
        const label  = fallback.inferred_feeling?.label || "uncertain";
        const coords = EMOTION_COORDS[label] || { x: 38, y: 58, q: 2 };
        sendResponse({
          success: true,
          emotionAnalysis:    fallback.emotion_analysis,
          lemonState:         fallback.lemon_state,
          narrativeSummary:   fallback.narrative_summary,
          observationQuestion:fallback.observation_question,
          contentAnalysis:    fallback.content_analysis,
          feelingActual:      label,
          feelingActualCoords: coords
        });
      });
    return true;
  }
});

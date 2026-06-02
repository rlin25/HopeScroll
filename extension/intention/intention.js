const EMOTIONS = [
  { label: "angry",       x: 8,  y: 8,  q: 1 },
  { label: "tense",       x: 20, y: 16, q: 1 },
  { label: "stressed",    x: 10, y: 28, q: 1 },
  { label: "anxious",     x: 26, y: 12, q: 1 },
  { label: "afraid",      x: 14, y: 40, q: 1 },
  { label: "overwhelmed", x: 32, y: 8,  q: 1 },
  { label: "sad",         x: 10, y: 68, q: 2 },
  { label: "depressed",   x: 6,  y: 82, q: 2 },
  { label: "bored",       x: 26, y: 90, q: 2 },
  { label: "fatigued",    x: 14, y: 80, q: 2 },
  { label: "frustrated",  x: 20, y: 54, q: 2 },
  { label: "envious",     x: 34, y: 44, q: 2 },
  { label: "numb",        x: 40, y: 86, q: 2 },
  { label: "uncertain",   x: 38, y: 58, q: 2 },
  { label: "excited",     x: 84, y: 8,  q: 3 },
  { label: "elated",      x: 93, y: 18, q: 3 },
  { label: "joyful",      x: 76, y: 16, q: 3 },
  { label: "energized",   x: 66, y: 10, q: 3 },
  { label: "inspired",    x: 80, y: 30, q: 3 },
  { label: "amped",       x: 92, y: 30, q: 3 },
  { label: "calm",        x: 74, y: 84, q: 4 },
  { label: "relaxed",     x: 84, y: 90, q: 4 },
  { label: "content",     x: 70, y: 72, q: 4 },
  { label: "serene",      x: 88, y: 78, q: 4 },
  { label: "grateful",    x: 66, y: 62, q: 4 },
  { label: "hopeful",     x: 62, y: 46, q: 4 },
  { label: "proud",       x: 76, y: 56, q: 4 },
  { label: "happy",       x: 84, y: 44, q: 4 },
];

let plannedShorts = 5;
let emotionSelection = null;

// ── Step 0: number picker ──────────────────────────────────────────────────
const countInput = document.getElementById("short-count");

document.getElementById("count-dec").addEventListener("click", () => {
  countInput.value = Math.max(1, parseInt(countInput.value || 1) - 1);
});
document.getElementById("count-inc").addEventListener("click", () => {
  countInput.value = Math.min(99, parseInt(countInput.value || 1) + 1);
});

document.getElementById("lock-in").addEventListener("click", () => {
  plannedShorts = Math.max(1, parseInt(countInput.value) || 5);
  document.getElementById("step-0").classList.remove("active");
  document.getElementById("step-1").classList.add("active");
});

// ── Step 1: emotion spectrum ───────────────────────────────────────────────
const spectrum = document.getElementById("spectrum-1");

EMOTIONS.forEach(em => {
  const el = document.createElement("div");
  el.className = `emotion-word q${em.q}`;
  el.textContent = em.label;
  el.style.left = `${em.x}%`;
  el.style.top  = `${em.y}%`;
  el.addEventListener("click", () => {
    spectrum.querySelectorAll(".emotion-word").forEach(w => w.classList.remove("selected"));
    el.classList.add("selected");

    const cursor = document.getElementById("cursor-1");
    cursor.style.left = `${em.x}%`;
    cursor.style.top  = `${em.y}%`;
    cursor.style.display = "block";

    document.getElementById("selected-1").textContent = em.label;
    emotionSelection = em;

    const btn = document.getElementById("begin-session");
    btn.disabled = false;
    btn.style.opacity = "1";
  });
  spectrum.appendChild(el);
});

document.getElementById("begin-session").addEventListener("click", async () => {
  if (!emotionSelection) return;

  const intention = {
    feeling_intended:        emotionSelection.label,
    feeling_intended_coords: { x: emotionSelection.x, y: emotionSelection.y, q: emotionSelection.q },
    planned_shorts:          plannedShorts
  };

  if (typeof chrome !== "undefined" && chrome.storage) {
    await Storage.saveIntention(intention);
    window.parent.postMessage({ type: "INTENTION_SET" }, "*");
  } else {
    console.log("Intention:", intention);
    alert("Intention set! (Standalone)");
  }
});

async function init() {
  const data = await chrome.storage.local.get([
    "current_session", "session_history", "user_progression", "api_key", "youtube_api_key"
  ]);

  if (data.api_key) {
    const notice = document.getElementById("key-saved-notice");
    notice.style.display = "block";
    notice.textContent = `Key saved (…${data.api_key.slice(-4)})`;
  }

  if (data.youtube_api_key) {
    const notice = document.getElementById("yt-key-saved-notice");
    notice.style.display = "block";
    notice.textContent = `Key saved (…${data.youtube_api_key.slice(-4)})`;
  }

  const session = data.current_session;
  const statusEl = document.getElementById("session-status");

  if (!session || session.status === "complete") {
    statusEl.textContent = "No active session";
  } else if (session.status === "scrolling") {
    statusEl.textContent = "Session active — scrolling";
    statusEl.classList.add("active");
    document.getElementById("open-journal").style.display = "block";
  } else if (session.status === "journaling") {
    statusEl.textContent = "Session active — journaling";
    statusEl.classList.add("active");
    document.getElementById("open-journal").style.display = "block";
  }

  const history = data.session_history || [];
  const progression = data.user_progression || { positive_streak: 0 };
  document.getElementById("total-sessions").textContent =
    `${history.length} session${history.length !== 1 ? "s" : ""}`;
  if (progression.positive_streak > 1) {
    document.getElementById("streak").textContent = `🔥 ${progression.positive_streak} streak`;
  }
}

document.getElementById("save-key").addEventListener("click", async () => {
  const keyInput = document.getElementById("api-key");
  const key = keyInput.value.trim();
  const statusEl = document.getElementById("key-status");

  if (!key) {
    statusEl.textContent = "Enter a key first";
    statusEl.className = "key-status error";
    return;
  }

  await chrome.storage.local.set({ api_key: key });
  keyInput.value = "";
  statusEl.textContent = "✓ Saved";
  statusEl.className = "key-status";

  const notice = document.getElementById("key-saved-notice");
  notice.style.display = "block";
  notice.textContent = `Key saved (…${key.slice(-4)})`;
});

document.getElementById("save-yt-key").addEventListener("click", async () => {
  const input = document.getElementById("yt-api-key");
  const key = input.value.trim();
  const statusEl = document.getElementById("yt-key-status");

  if (!key) {
    statusEl.textContent = "Enter a key first";
    statusEl.className = "key-status error";
    return;
  }

  await chrome.storage.local.set({ youtube_api_key: key });
  input.value = "";
  statusEl.textContent = "✓ Saved";
  statusEl.className = "key-status";
  const notice = document.getElementById("yt-key-saved-notice");
  notice.style.display = "block";
  notice.textContent = `Key saved (…${key.slice(-4)})`;
});

document.getElementById("open-journal").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    await chrome.tabs.sendMessage(tab.id, { type: "SHOW_JOURNAL" });
    window.close();
  } catch {
    document.getElementById("session-status").textContent = "Navigate to YouTube Shorts first";
  }
});

init();

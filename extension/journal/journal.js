const notesEl = document.getElementById("journal-notes");
const btn     = document.getElementById("see-lemon");

notesEl.addEventListener("input", () => {
  btn.disabled = notesEl.value.trim().length === 0;
});

btn.addEventListener("click", async () => {
  btn.disabled = true;
  btn.textContent = "ANALYZING...";

  const notes = notesEl.value.trim();

  if (typeof chrome !== "undefined" && chrome.storage) {
    await Storage.saveJournal(notes);
    const session = await Storage.getCurrentSession();

    chrome.runtime.sendMessage({ type: "ANALYZE_SESSION", data: session }, async (response) => {
      if (response?.success) {
        await Storage.completeSession(
          response.emotionAnalysis,
          response.lemonState,
          response.narrativeSummary,
          response.observationQuestion,
          response.contentAnalysis,
          response.feelingActual,
          response.feelingActualCoords
        );
        window.location.href = chrome.runtime.getURL("lemon/lemon.html");
      } else {
        btn.textContent = "ERROR — RETRY";
        btn.disabled = false;
      }
    });
  } else {
    sessionStorage.setItem("lemon_result", JSON.stringify({
      lemonState: { expression: "neutral", condition: "slightly_wilted", intensity_level: 2 },
      narrativeSummary: "Standalone mode.",
      observationQuestion: "How did this feel?",
      feelingBefore: "unknown",
      feelingAfter: "uncertain",
      feelingIntendedCoords: { x: 50, y: 50, q: 1 },
      feelingActualCoords:   { x: 38, y: 58, q: 2 }
    }));
    window.location.href = "../lemon/lemon.html";
  }
});

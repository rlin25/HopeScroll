(function () {
  let currentOverlay = null;
  let contentObserver = null;
  let lastCapturedUrl = '';
  const viewedContent = [];

  chrome.storage.local.get("current_session", (data) => {
    const session = data.current_session;
    if (!session || session.status === "complete") {
      injectIntentionOverlay();
    } else if (session.status === "scrolling" || session.status === "intention_set") {
      startSessionTimer(session);
      startContentTracking();
    } else if (session.status === "journaling") {
      injectJournalOverlay();
    }
  });

  function injectIntentionOverlay() {
    if (currentOverlay) return;
    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("intention/intention.html");
    iframe.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;border:none;z-index:2147483647;";
    document.documentElement.style.overflow = "hidden";
    (document.body || document.documentElement).appendChild(iframe);
    currentOverlay = iframe;
  }

  function injectJournalOverlay() {
    if (currentOverlay) return;
    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("journal/journal.html");
    iframe.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;border:none;z-index:2147483647;";
    (document.body || document.documentElement).appendChild(iframe);
    currentOverlay = iframe;
  }

  function startSessionTimer(session) {
    if (!session.start_time) {
      chrome.storage.local.get("current_session", (data) => {
        const s = data.current_session;
        if (s) {
          s.start_time = new Date().toISOString();
          s.status = "scrolling";
          chrome.storage.local.set({ current_session: s });
        }
      });
    }
  }

  function startContentTracking() {
    captureCurrentVideo();

    const titleEl = document.querySelector('title');
    if (!titleEl) return;

    contentObserver = new MutationObserver(() => {
      if (location.href.includes('/shorts/') && location.href !== lastCapturedUrl) {
        setTimeout(captureCurrentVideo, 400);
      }
    });

    contentObserver.observe(titleEl, { childList: true, subtree: true, characterData: true });
  }

  function captureCurrentVideo() {
    if (!location.href.includes('/shorts/')) return;
    if (location.href === lastCapturedUrl) return;

    const videoId = location.href.match(/shorts\/([^?/]+)/)?.[1];
    if (!videoId) return;

    const title = document.title.replace(/ - YouTube$/, '').trim();
    if (!title || title === 'YouTube') return;

    lastCapturedUrl = location.href;
    viewedContent.push({ video_id: videoId, title });
    if (viewedContent.length > 50) viewedContent.shift();

    chrome.storage.local.get("current_session", (data) => {
      const session = data.current_session;
      if (session?.status === "scrolling") {
        session.consumed_content = [...viewedContent];
        chrome.storage.local.set({ current_session: session });

        const planned = session.intention?.planned_shorts;
        if (planned > 0 && viewedContent.length >= planned && !currentOverlay) {
          setTimeout(() => injectJournalOverlay(), 400);
        }
      }
    });
  }

  window.addEventListener("message", (event) => {
    if (event.data.type === "INTENTION_SET") {
      currentOverlay?.remove();
      currentOverlay = null;
      document.documentElement.style.overflow = "";
      startContentTracking();
    } else if (event.data.type === "LEMON_DISMISS") {
      currentOverlay?.remove();
      currentOverlay = null;
      contentObserver?.disconnect();
      contentObserver = null;
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SHOW_JOURNAL") {
      injectJournalOverlay();
      sendResponse({ received: true });
    }
    return true;
  });
})();

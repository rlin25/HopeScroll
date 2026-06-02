const Storage = {
  async getCurrentSession() {
    const data = await chrome.storage.local.get("current_session");
    return data.current_session || null;
  },

  async saveIntention(intention) {
    const session = {
      session_id: crypto.randomUUID(),
      intention,   // { feeling_before, feeling_before_coords, avoid_feeling, avoid_feeling_coords }
      start_time: new Date().toISOString(),
      status: "scrolling"
    };
    await chrome.storage.local.set({ current_session: session });
    return session;
  },

  async saveJournal(journalNotes) {
    const data = await chrome.storage.local.get("current_session");
    const session = data.current_session;
    session.journal_notes = journalNotes;
    session.status = "journaling";
    await chrome.storage.local.set({ current_session: session });
    return session;
  },

  async completeSession(emotionAnalysis, lemonState, narrativeSummary, observationQuestion, contentAnalysis, feelingActual, feelingActualCoords) {
    const data = await chrome.storage.local.get("current_session");
    const session = data.current_session;
    session.emotion_analysis    = emotionAnalysis;
    session.lemon_state         = lemonState;
    session.narrative_summary   = narrativeSummary;
    session.observation_question = observationQuestion;
    session.content_analysis     = contentAnalysis || null;
    session.feeling_actual       = feelingActual || null;
    session.feeling_actual_coords = feelingActualCoords || null;
    session.status              = "complete";
    session.completed_at        = new Date().toISOString();

    const historyData = await chrome.storage.local.get("session_history");
    const history = historyData.session_history || [];
    history.push(session);

    const progData = await chrome.storage.local.get("user_progression");
    const progression = progData.user_progression || {
      armor_level: 0, total_sessions: 0, positive_streak: 0,
      breakthrough_milestones_earned: []
    };
    progression.total_sessions += 1;

    if (emotionAnalysis?.emotional_shift?.direction === "improved") {
      progression.positive_streak += 1;
    } else {
      progression.positive_streak = 0;
    }

    if (progression.positive_streak >= 5  && progression.armor_level < 1) {
      progression.armor_level = 1;
      progression.breakthrough_milestones_earned.push("helmet");
    }
    if (progression.positive_streak >= 10 && progression.armor_level < 2) {
      progression.armor_level = 2;
      progression.breakthrough_milestones_earned.push("shield");
    }

    await chrome.storage.local.set({
      current_session: session,
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
      armor_level: 0, total_sessions: 0, positive_streak: 0,
      breakthrough_milestones_earned: []
    };
  }
};

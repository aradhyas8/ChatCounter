const getSessionData = (callback) => {
  chrome.storage.local.get('sessions', (data) => {
    callback(data.sessions || {});
  });
};

const setSessionData = (sessions) => {
  chrome.storage.local.set({ sessions });
};

const resetSessionData = (tabId) => {
  getSessionData((sessions) => {
    if (sessions[tabId]) {
      sessions[tabId].count = 0;
      sessions[tabId].startTime = Date.now();
      setSessionData(sessions);
    }
  });
};
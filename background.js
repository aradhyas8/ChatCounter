chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ sessions: {} });
});

// Unified timer function to manage the 3-hour limit
const startTimer = (tabId, callback) => {
  const maxTime = 3 * 60 * 60; // 3 hours in seconds
  let elapsedTime = 0;
  const timerId = setInterval(() => {
    elapsedTime++;
    if (elapsedTime >= maxTime) {
      clearInterval(timerId);
      resetSessionData(tabId); // Reset the session data after 3 hours
    } else {
      callback(elapsedTime);
    }
  }, 1000); // 1 second interval
  return timerId;
};

// Reset session data function
const resetSessionData = (tabId) => {
  chrome.storage.local.get({ sessions: {} }, (data) => {
    const sessions = data.sessions;
    if (sessions[tabId]) {
      sessions[tabId].count = 0;
      sessions[tabId].startTime = Date.now();
      clearInterval(sessions[tabId].timerId); // Clear the old timer
      sessions[tabId].timerId = startTimer(tabId, (elapsedTime) => {
        sessions[tabId].remainingTime = maxTime - elapsedTime;
        chrome.storage.local.set({ sessions });
      });
      chrome.storage.local.set({ sessions });
    }
  });
};

// Event listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("chatgpt-4.com")) {
    chrome.tabs.sendMessage(tabId, { action: "initSession" });

    if (changeInfo.status === "complete") {
      chrome.storage.local.get({ sessions: {} }, (data) => {
        let sessions = data.sessions;
        if (!sessions[tabId]) {
          sessions[tabId] = { count: 0, startTime: Date.now(), timerId: null };
          sessions[tabId].timerId = startTimer(tabId, (elapsedTime) => {
            sessions[tabId].remainingTime = maxTime - elapsedTime;
            chrome.storage.local.set({ sessions });
          });
        }
      });
    }
  }
});

// Listener for message count updates
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateCount") {
    const { tabId, count } = request;
    chrome.storage.local.get({ sessions: {} }, (data) => {
      let sessions = data.sessions;
      if (sessions[tabId]) {
        sessions[tabId].count = count;
        chrome.storage.local.set({ sessions });
      }
    });
  }
});

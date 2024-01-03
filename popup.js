document.addEventListener("DOMContentLoaded", () => {
  // Function to update the popup UI
  function updatePopupUI(sessions) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTabId = tabs[0].id;
      const session = sessions[currentTabId];
      if (session) {
        // Update message count
        document.getElementById("remainingMessages").textContent =
          session.count;

        // Calculate and display remaining time
        const remainingTimeMs = Math.max(
          0,
          3 * 60 * 60 * 1000 - (Date.now() - session.startTime)
        );
        const remainingTime = new Date(remainingTimeMs)
          .toISOString()
          .substr(11, 8);
        document.getElementById("remainingTime").textContent = remainingTime;
      }
    });
  }

  // Listener for changes in chrome.storage
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.sessions) {
      updatePopupUI(changes.sessions.newValue);
    }
  });

  // Initialization logic for setting up initial state of the popup UI
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTabId = tabs[0].id;
    chrome.storage.local.get({ sessions: {} }, (data) => {
      updatePopupUI(data.sessions);
    });
  });
});

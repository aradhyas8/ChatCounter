let messageCount = 0;

// Function to accurately count the number of messages
const countMessages = () => {
  // Assuming messages are contained within elements having 'chat-message' class
  const messages = document.querySelectorAll(".chat-message");
  messageCount = messages.length;
  return messageCount;
};

// MutationObserver to observe for new messages
const messageContainerSelector = ".chat-interface"; // Assuming this is the container for chat messages
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      const newCount = countMessages();
      if (newCount !== messageCount) {
        messageCount = newCount;
        chrome.runtime.sendMessage({
          action: "updateCount",
          tabId: chrome.devtools.inspectedWindow.tabId,
          count: messageCount,
        });
      }
    }
  });
});

// Start observing for message additions
const messageContainer = document.querySelector(messageContainerSelector);
if (messageContainer) {
  observer.observe(messageContainer, { childList: true, subtree: true });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "initSession") {
    // Reset the message count when initializing a new session
    messageCount = 0;

    // Re-count messages in case there are any present at the time of session initialization
    countMessages();
  }
});

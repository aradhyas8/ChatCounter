let messageCount = 0;

// Function to accurately count the number of messages
const countMessages = () => {
  // Assuming user and ChatGPT messages have 'user-message' and 'gpt-message' classes respectively
  const userMessages = document.querySelectorAll(".chat-message.user-message");
  const gptMessages = document.querySelectorAll(".chat-message.gpt-message");
  messageCount = userMessages.length + gptMessages.length;
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
    // Accurately initialize message count with the current number of messages
    messageCount = countMessages();
  }
});

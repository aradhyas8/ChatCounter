let messageCount = 0;

// Function to accurately count the number of user messages
const countMessages = () => {
  // Selecting messages sent by the user based on the data attribute
  const userMessages = document.querySelectorAll(
    'div data-message-author-role="user"'
  );
  messageCount = userMessages.length;
  return messageCount;
};

// MutationObserver to observe for new messages
const messageContainerSelector = ".react-scroll-to-bottom--css-erpbh-1n7m0yu";; // Update this if the container for chat messages is different
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
    messageCount = countMessages(); // Accurately initialize message count with the current number of messages
  }
});

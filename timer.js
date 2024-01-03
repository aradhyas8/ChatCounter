// timer.js

// Function to start a timer for a given duration, in seconds
function startTimer(duration, onTick, onTimerEnd) {
  let timeRemaining = duration;
  const timerId = setInterval(() => {
    timeRemaining--;

    // Call the onTick callback with the updated time
    if (onTick) {
      onTick(timeRemaining);
    }

    // Check if the timer has ended
    if (timeRemaining <= 0) {
      clearInterval(timerId);

      // Call the onTimerEnd callback
      if (onTimerEnd) {
        onTimerEnd();
      }
    }
  }, 1000); // Update every second

  return timerId;
}

// Function to stop a timer
function stopTimer(timerId) {
  clearInterval(timerId);
}

// Example usage
/*
let myTimer = startTimer(180, (remainingTime) => {
    console.log(`Time remaining: ${remainingTime} seconds`);
}, () => {
    console.log('Timer ended.');
});

// To stop the timer
// stopTimer(myTimer);
*/

// Export functions if you are using modules
// export { startTimer, stopTimer };

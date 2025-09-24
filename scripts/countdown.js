// /src/countdown.js

let activeTimer = null;
const CHECK_INTERVAL = 60_000;
const COUNTDOWN_DURATION = 30 * 60 * 1000;

// Cache DOM elements
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("minutes");
const secsEl = document.getElementById("seconds");
const toggleBtn = document.getElementById("toggleBtn");

// --- Utility functions ---
function getNextFridayAt8AM() {
  const now = new Date();
  const nextFriday = new Date(now);
  const daysUntilFriday = (5 - now.getDay() + 7) % 7;
  nextFriday.setDate(now.getDate() + daysUntilFriday);
  nextFriday.setHours(8, 0, 0, 0);

  if (nextFriday <= now) {
    nextFriday.setDate(nextFriday.getDate() + 7);
  }
  return nextFriday;
}

function updateDisplay(hrs, mins, secs) {
  hoursEl.textContent = String(hrs).padStart(2, "0");
  minsEl.textContent = String(mins).padStart(2, "0");
  secsEl.textContent = String(secs).padStart(2, "0");
}

function clearDisplay() {
  updateDisplay(0, 30, 0);
}

// --- Countdown logic ---
function startCountdown(durationMs) {
  if (activeTimer) clearInterval(activeTimer);

  const endTime = Date.now() + durationMs;

  activeTimer = setInterval(() => {
    const remaining = endTime - Date.now();

    if (remaining <= 0) {
      clearInterval(activeTimer);
      activeTimer = null;
      clearDisplay();
      toggleBtn.textContent = "Reset";
      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    updateDisplay(hrs, mins, secs);
  }, 1000);
}

function checkAndRunTimer() {
  if (activeTimer) return;

  const now = new Date();
  const target = getNextFridayAt8AM();
  const diff = now - target;

  if (diff >= 0 && diff < COUNTDOWN_DURATION) {
    const remaining = COUNTDOWN_DURATION - diff;
    startCountdown(remaining);
    toggleBtn.textContent = "Stop";
  } else {
    setTimeout(checkAndRunTimer, CHECK_INTERVAL);
  }
}

// --- Event listener (toggle logic) ---
toggleBtn.addEventListener("click", () => {
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
    clearDisplay();
    toggleBtn.textContent = "Reset";
  } else {
    startCountdown(COUNTDOWN_DURATION);
    toggleBtn.textContent = "Stop";
  }
});

// --- Init ---
toggleBtn.textContent = "Reset";
checkAndRunTimer();

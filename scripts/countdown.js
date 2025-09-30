let countdownInterval;
let remainingSeconds = 0;
let isRunning = false;
let totalDuration = 0;
let colorTimeouts = [];

const glassCard = document.querySelector(".glass-card");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const tabs = document.querySelectorAll(".tab");
const toggleBtn = document.getElementById("toggleBtn");
const titleEl = document.querySelector(".glass-card .large_text");

function formatTime(num) {
  return num.toString().padStart(2, "0");
}

function updateDisplay() {
  const hrs = Math.floor(remainingSeconds / 3600);
  const mins = Math.floor((remainingSeconds % 3600) / 60);
  const secs = remainingSeconds % 60;

  hoursEl.textContent = formatTime(hrs);
  minutesEl.textContent = formatTime(mins);
  secondsEl.textContent = formatTime(secs);
}

function startCountdown() {
  clearInterval(countdownInterval);
  updateDisplay();
  totalDuration = remainingSeconds;

  scheduleColorChanges(totalDuration);

  countdownInterval = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      updateDisplay();
    } else {
      clearInterval(countdownInterval);
      isRunning = false;
      toggleBtn.textContent = "Reset";
    }
  }, 1000);
}

function scheduleColorChanges(duration) {
  // Clear previous timeouts
  colorTimeouts.forEach(clearTimeout);
  colorTimeouts = [];

  // Reset immediately
  glassCard.style.background = "rgba(255, 255, 255, 0.15)";

  // Only schedule if actively running
  if (isRunning) {
    // 75% elapsed → orange
    colorTimeouts.push(
      setTimeout(() => {
        glassCard.style.background = "rgba(245, 167, 33, 0.5)";
      }, duration * 1000 * 0.75)
    );

    // 100% elapsed → red
    colorTimeouts.push(
      setTimeout(() => {
        glassCard.style.background = "rgba(246, 96, 82, 0.5)";
      }, duration * 1000)
    );
  }
}

function setDuration(seconds) {
  clearInterval(countdownInterval);
  remainingSeconds = seconds;
  updateDisplay();
  isRunning = false;
  toggleBtn.textContent = "Start";
}

// Handle tab switching
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const duration = parseInt(tab.dataset.duration, 10);
    setDuration(duration);

    const newTitle = tab.dataset.title ?? tab.textContent.trim();
    if (newTitle) titleEl.textContent = newTitle;
  });
});

// Handle button behavior
toggleBtn.addEventListener("click", () => {
  if (!isRunning && toggleBtn.textContent === "Start") {
    isRunning = true;
    toggleBtn.textContent = "Stop";
    startCountdown();
  } else if (isRunning) {
    isRunning = false;
    clearInterval(countdownInterval);
    toggleBtn.textContent = "Start";
  } else {
    const activeTab = document.querySelector(".tab.active");
    const duration = parseInt(activeTab.dataset.duration, 10);
    setDuration(duration);
  }
});

// Initialize countdown with first active tab
const initialTab = document.querySelector(".tab.active");
if (initialTab) {
  setDuration(parseInt(initialTab.dataset.duration, 10));
}

// Auto-start Fridays at 8 AM
function scheduleFridayCountdown() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 5 = Friday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  let daysUntilFriday = (5 - day + 7) % 7;
  if (
    daysUntilFriday === 0 &&
    (hours > 8 || (hours === 8 && (minutes > 0 || seconds > 0)))
  ) {
    daysUntilFriday = 7;
  }

  const nextFriday8AM = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + daysUntilFriday,
    8,
    0,
    0,
    0
  );

  const delay = nextFriday8AM - now;

  setTimeout(() => {
    const researchTab = document.querySelector('.tab[data-duration="1800"]');
    if (researchTab) researchTab.click();

    if (!isRunning) {
      isRunning = true;
      toggleBtn.textContent = "Stop";
      startCountdown();
    }

    scheduleFridayCountdown();
  }, delay);
}

scheduleFridayCountdown();

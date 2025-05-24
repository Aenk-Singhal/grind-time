const codingSites = [
  "leetcode.com",
  "geeksforgeeks.org",
  "github.com",
  "codeforces.com",
  "codechef.com",
  "hackerrank.com"
];

// Convert milliseconds to h m s string
function msToHMS(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}

// Get date string YYYY-MM-DD from Date object
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

// Get dates array going back N days from today inclusive
function getPastDates(days) {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
}

// Fetch time data for one date from storage, resolves to site-time mapping object or {}
function fetchTimeForDate(dateStr) {
  return new Promise((resolve) => {
    const storageKey = `time_${dateStr}`;
    chrome.storage.local.get([storageKey], (result) => {
      resolve(result[storageKey] || {});
    });
  });
}

// Calculate total time for given site-time object
function totalTime(siteTimeObj) {
  return Object.values(siteTimeObj).reduce((a, b) => a + b, 0);
}

// Calculate total time over multiple dates’ data objects array
function sumTimes(dataArray) {
  let sum = 0;
  for (const data of dataArray) {
    sum += totalTime(data);
  }
  return sum;
}

// Calculate daily streak: count of consecutive days from today with any tracked time
async function calculateStreak() {
  let streak = 0;
  for (let i = 0; i < 365; i++) { // check max 1 year streak to avoid infinite loop
    const date = formatDate(new Date(Date.now() - i * 24 * 60 * 60 * 1000));
    const data = await fetchTimeForDate(date);
    if (totalTime(data) > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// Update Today tab content
async function updateToday() {
  const today = formatDate(new Date());
  const data = await fetchTimeForDate(today);

  const totalMs = totalTime(data);
  document.getElementById('today-total').textContent =
    totalMs > 0 ? msToHMS(totalMs) : "No time tracked yet";

  // Display site-wise breakdown sorted descending by time
  const breakdownEl = document.getElementById('today-breakdown');
  breakdownEl.innerHTML = '';

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    breakdownEl.innerHTML = '<li>No tracked sites today</li>';
  } else {
    for (const [site, ms] of entries) {
      const li = document.createElement('li');
      li.textContent = `${site}: ${msToHMS(ms)}`;
      breakdownEl.appendChild(li);
    }
  }
}

// Update Week tab content
async function updateWeek() {
  const dates = getPastDates(7);
  const dataArr = [];
  for (const d of dates) {
    dataArr.push(await fetchTimeForDate(d));
  }
  const totalMs = sumTimes(dataArr);
  document.getElementById('week-total').textContent =
    totalMs > 0 ? msToHMS(totalMs) : "No time tracked yet";
}

// Update Month tab content
async function updateMonth() {
  const dates = getPastDates(30);
  const dataArr = [];
  for (const d of dates) {
    dataArr.push(await fetchTimeForDate(d));
  }
  const totalMs = sumTimes(dataArr);
  document.getElementById('month-total').textContent =
    totalMs > 0 ? msToHMS(totalMs) : "No time tracked yet";
}

// Update Streak tab content
async function updateStreak() {
  const streak = await calculateStreak();
  document.getElementById('streak-count').textContent =
    streak > 0 ? `${streak} day${streak > 1 ? 's' : ''}` : "No streak yet";
}

// Handle tab switching logic
function setupTabs() {
  const buttons = document.querySelectorAll('.tab-button');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show only selected tab content
      const selectedTab = btn.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = content.id === selectedTab ? 'block' : 'none';
      });

      // Update content depending on tab
      switch (selectedTab) {
        case 'today': updateToday(); break;
        case 'week': updateWeek(); break;
        case 'month': updateMonth(); break;
        case 'streak': updateStreak(); break;
      }
    });
  });
}

// Load initial view and setup events
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  updateToday(); // Default tab on load
});

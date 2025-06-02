const codingSites = [
  "leetcode.com",
  "geeksforgeeks.org",
  "github.com",
  "codeforces.com",
  "codechef.com",
  "hackerrank.com"
];

// Variables to store chart instances
let todayChart = null;
let weekChart = null;
let monthChart = null;

// Convert milliseconds to h m s string
function msToHMS(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}

// Convert milliseconds to hours (decimal)
function msToHours(ms) {
  return ms / (1000 * 60 * 60);
}

// Get date string YYYY-MM-DD from Date object
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

// Get short date string (MM/DD) for chart labels
function formatShortDate(date) {
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
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

// Get dates array going back N days with Date objects (for labels)
function getPastDatesWithObjects(days) {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d);
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

// Calculate total time over multiple dates' data objects array
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

// Function to create a pie chart
function createPieChart(data, canvasId, chartVariable) {
  console.log(`createPieChart called for ${canvasId} with data:`, data);
  
  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded!');
    document.getElementById(`${canvasId.replace('-chart', '')}-no-data`).innerHTML = '<p>Chart library not loaded</p>';
    document.getElementById(`${canvasId.replace('-chart', '')}-no-data`).style.display = 'block';
    return;
  }
  
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  
  // If there's an existing chart, destroy it first
  if (chartVariable) {
    chartVariable.destroy();
  }
  
  // Prepare data for the chart
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  console.log(`Chart entries for ${canvasId}:`, entries);
  
  if (entries.length === 0) {
    // Show no data message
    console.log(`No data to display for ${canvasId}`);
    document.getElementById(`${canvasId.replace('-chart', '')}-no-data`).style.display = 'block';
    canvas.style.display = 'none';
    return null;
  }
  
  // Hide no data message and show chart
  document.getElementById(`${canvasId.replace('-chart', '')}-no-data`).style.display = 'none';
  canvas.style.display = 'block';
  
  // Extract labels and values
  const labels = entries.map(([site, ms]) => site);
  const values = entries.map(([site, ms]) => ms);
  
  // Pretty colors for different sites
  const colors = [
    '#FF6384', // Pink-red
    '#36A2EB', // Blue
    '#FFCE56', // Yellow
    '#4BC0C0', // Teal
    '#9966FF', // Purple
    '#FF9F40'  // Orange
  ];
  
  // Create the chart
  const newChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#ffffff',
            font: {
              size: 11
            },
            generateLabels: function(chart) {
              const data = chart.data;
              const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
              
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor,
                  lineWidth: data.datasets[0].borderWidth,
                  index: i
                };
              });
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              const timeStr = msToHMS(value);
              
              return `${label}: ${timeStr} (${percentage}%)`;
            }
          }
        }
      }
    }
  });

  return newChart;
}

// Function to create a line chart for time series data
function createLineChart(datesArray, dataArray, canvasId, chartVariable, title) {
  console.log(`createLineChart called for ${canvasId} with data:`, dataArray);
  
  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded!');
    document.getElementById(`${canvasId.replace('-chart', '')}-no-data`).innerHTML = '<p>Chart library not loaded</p>';
    document.getElementById(`${canvasId.replace('-chart', '')}-no-data`).style.display = 'block';
    return;
  }
  
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  
  // If there's an existing chart, destroy it first
  if (chartVariable) {
    chartVariable.destroy();
  }
  
  // Calculate daily totals
  const dailyTotals = dataArray.map(dayData => msToHours(totalTime(dayData)));
  const labels = datesArray.map(date => formatShortDate(date));
  
  // Check if there's any data
  const hasData = dailyTotals.some(total => total > 0);
  
  if (!hasData) {
    // Show no data message
    console.log(`No data to display for ${canvasId}`);
    document.getElementById(`${canvasId.replace('-chart', '')}-no-data`).style.display = 'block';
    canvas.style.display = 'none';
    return null;
  }
  
  // Hide no data message and show chart
  document.getElementById(`${canvasId.replace('-chart', '')}-no-data`).style.display = 'none';
  canvas.style.display = 'block';
  
  // Create the chart
  const newChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Hours Coded',
        data: dailyTotals,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#36A2EB',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const hours = context.parsed.y.toFixed(2);
              const ms = context.parsed.y * 60 * 60 * 1000;
              const timeStr = msToHMS(ms);
              return `Time: ${timeStr} (${hours}h)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#ffffff',
            callback: function(value) {
              return value.toFixed(1) + 'h';
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        x: {
          ticks: {
            color: '#ffffff',
            maxTicksLimit: 7
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    }
  });

  return newChart;
}

// Update Today tab content
async function updateToday() {
  const today = formatDate(new Date());
  const data = await fetchTimeForDate(today);

  const totalMs = totalTime(data);
  document.getElementById('today-total').textContent =
    totalMs > 0 ? msToHMS(totalMs) : "No time tracked yet";

  // Create pie chart
  todayChart = createPieChart(data, 'today-chart', todayChart);
}

// Update Week tab content
async function updateWeek() {
  const dates = getPastDates(7);
  const dateObjects = getPastDatesWithObjects(7);
  const dataArr = [];
  
  for (const d of dates) {
    dataArr.push(await fetchTimeForDate(d));
  }
  
  const totalMs = sumTimes(dataArr);
  document.getElementById('week-total').textContent =
    totalMs > 0 ? msToHMS(totalMs) : "No time tracked yet";

  // Create line chart for weekly trend
  weekChart = createLineChart(dateObjects, dataArr.reverse(), 'week-chart', weekChart, 'Weekly Coding Time');
  
  // Create pie chart for weekly site breakdown
  const weekSiteData = {};
  dataArr.forEach(dayData => {
    Object.entries(dayData).forEach(([site, time]) => {
      if (!weekSiteData[site]) weekSiteData[site] = 0;
      weekSiteData[site] += time;
    });
  });
  
  createPieChart(weekSiteData, 'week-pie-chart', null);
}

// Update Month tab content
async function updateMonth() {
  const dates = getPastDates(30);
  const dateObjects = getPastDatesWithObjects(30);
  const dataArr = [];
  
  for (const d of dates) {
    dataArr.push(await fetchTimeForDate(d));
  }
  
  const totalMs = sumTimes(dataArr);
  document.getElementById('month-total').textContent =
    totalMs > 0 ? msToHMS(totalMs) : "No time tracked yet";

  // Create line chart for monthly trend
  monthChart = createLineChart(dateObjects, dataArr.reverse(), 'month-chart', monthChart, 'Monthly Coding Time');
  
  // Create pie chart for monthly site breakdown
  const monthSiteData = {};
  dataArr.forEach(dayData => {
    Object.entries(dayData).forEach(([site, time]) => {
      if (!monthSiteData[site]) monthSiteData[site] = 0;
      monthSiteData[site] += time;
    });
  });
  
  createPieChart(monthSiteData, 'month-pie-chart', null);
}

// Update Streak tab content
async function updateStreak() {
  const streak = await calculateStreak();
  document.getElementById('streak-count').textContent =
    streak > 0 ? `${streak} day${streak > 1 ? 's' : ''} 🔥` : "No streak yet";
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
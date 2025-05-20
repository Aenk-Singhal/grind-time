// List of coding sites to track
const codingSites = [
    "leetcode.com",
    "geeksforgeeks.org",
    "github.com",
    "codeforces.com",
    "codechef.com",
    "hackerrank.com"
];

// Variable to track current tracked site and start time
let currentSite = null;
let startTime = null;

// Helper: Check if URL is one of the coding sites
function isCodingSite(url) {
    try {
        const hostname = new URL(url).hostname.replace("www.", "");
        return codingSites.includes(hostname);
    } catch {
        return false;
    }
}

// Called when active tab changes or URL changes
function handleTabChange(activeTabId) {
    chrome.tabs.get(activeTabId, (tab) => {
        if (!tab || !tab.url) return;

        if (currentSite && startTime) {
            // Calculate time spent on old site
            const now = Date.now();
            const duration = now - startTime;

            // Save duration to storage, keyed by date and site
            const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
            const storageKey = `time_${today}`;

            chrome.storage.local.get([storageKey], (result) => {
                let data = result[storageKey] || {};
                if (!data[currentSite]) data[currentSite] = 0;
                data[currentSite] += duration;
                chrome.storage.local.set({ [storageKey]: data });
            });
        }

        if (isCodingSite(tab.url)) {
            currentSite = new URL(tab.url).hostname.replace("www.", "");
            startTime = Date.now();
        } else {
            currentSite = null;
            startTime = null;
        }
    });
}

// Listen for tab activation changes
chrome.tabs.onActivated.addListener((activeInfo) => {
    handleTabChange(activeInfo.tabId);
});

// Listen for tab updates (like url change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        handleTabChange(tabId);
    }
});

// When Chrome starts or extension loads, check active tab
chrome.windows.getLastFocused({ populate: true }, (window) => {
    if (!window) return;
    const activeTab = window.tabs.find((t) => t.active);
    if (activeTab) {
        handleTabChange(activeTab.id);
    }
});

// When extension is suspended (like Chrome closing), save time for current site
chrome.runtime.onSuspend.addListener(() => {
    if (currentSite && startTime) {
        const now = Date.now();
        const duration = now - startTime;

        const today = new Date().toISOString().slice(0, 10);
        const storageKey = `time_${today}`;

        chrome.storage.local.get([storageKey], (result) => {
            let data = result[storageKey] || {};
            if (!data[currentSite]) data[currentSite] = 0;
            data[currentSite] += duration;
            chrome.storage.local.set({ [storageKey]: data });
        });
    }
});

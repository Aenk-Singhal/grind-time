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

// Helper: Save time spent on current site
function saveCurrentTime(leftSite) {
    if (leftSite && startTime) {
        const now = Date.now();
        const duration = now - startTime;
        
        console.log(`Saving time for site: ${leftSite}, duration: ${duration}ms`);

        // Save duration to storage, keyed by date and site
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const storageKey = `time_${today}`;

        chrome.storage.local.get([storageKey], (result) => {
            let data = result[storageKey] || {};
            if (!data[leftSite]) data[leftSite] = 0;
            data[leftSite] += duration;
            console.log(`Updated data for ${today}:`, data);
            chrome.storage.local.set({ [storageKey]: data });
        });
    }
}

// Called when active tab changes or URL changes
function handleTabChange(activeTabId) {
    chrome.tabs.get(activeTabId, (tab) => {
        if (!tab || !tab.url) return;
        
        let leftSite = currentSite;
        console.log(`Tab changed to: ${tab.url}`);
        console.log(`Current site before change: ${leftSite}`);

        // Save time for previous site BEFORE changing currentSite
        saveCurrentTime(leftSite);

        // Now check if new tab is a coding site
        if (isCodingSite(tab.url)) {
            currentSite = new URL(tab.url).hostname.replace("www.", "");
            startTime = Date.now();
            console.log(`Started tracking: ${currentSite}`);
        } else {
            currentSite = null;
            startTime = null;
            console.log(`Stopped tracking (not a coding site)`);
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
    saveCurrentTime(currentSite);
});

// Also listen for window focus changes to handle switching between browser and other apps
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        // Browser lost focus - save current time
        saveCurrentTime(currentSite);
        // Don't reset currentSite/startTime here, just pause tracking
    } else {
        // Browser gained focus - restart tracking if on coding site
        chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
            if (tabs[0]) {
                if (isCodingSite(tabs[0].url) && currentSite) {
                    // Resume tracking - reset start time
                    startTime = Date.now();
                }
            }
        });
    }
});
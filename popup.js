function msToHMS(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}
function updateDisplay() {
    const today = new Date().toISOString().slice(0, 10);
    const storageKey = `time_${today}`;
    chrome.storage.local.get([storageKey], (result) => {
        const data = result[storageKey] || {};
        // Sum all site times
        const totalMs = Object.values(data).reduce((a, b) => a + b, 0);
        const display = totalMs > 0 ? msToHMS(totalMs) : "No time tracked yet";
        document.getElementById("total-time").textContent = display;
    });
}
document.addEventListener("DOMContentLoaded", () => {
    updateDisplay();
});
# Grind Time 🔥

A Chrome extension that automatically tracks your coding time across popular programming websites to help you stay motivated and monitor your progress.

![Grind Time Extension](https://img.shields.io/badge/Chrome-Extension-brightgreen)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## Features

- **⏱️ Automatic Time Tracking**: Seamlessly tracks time spent on coding websites
- **📊 Visual Analytics**: Beautiful charts showing your coding patterns
- **📈 Multiple Views**: Daily, weekly, and monthly statistics
- **🔥 Streak Counter**: Track your daily coding streak for motivation
- **🌐 Multi-Site Support**: Tracks time across 5+ popular coding platforms
- **🎨 Clean UI**: Dark theme with responsive design
- **📱 Lightweight**: Minimal resource usage with efficient background tracking

## Supported Websites

- **LeetCode** - Algorithm practice and interviews
- **GitHub** - Code repositories and collaboration
- **GeeksforGeeks** - Programming tutorials and practice
- **Codeforces** - Competitive programming
- **CodeChef** - Programming contests
- **HackerRank** - Coding challenges and assessments

## Screenshots

### Today's Stats
View your daily coding time with site-wise breakdown in an interactive pie chart.

### Weekly Overview
Track your progress over the last 7 days with trend analysis and site distribution.

### Monthly Analytics
Get comprehensive insights into your coding habits over the past month.

### Streak Tracking
Stay motivated with your daily coding streak counter.

## Installation

### Method 1: Manual Installation (Developer Mode)

1. **Download the Extension**
   ```bash
   git clone https://github.com/your-username/grind-time.git
   cd grind-time
   ```

2. **Enable Developer Mode**
   - Open Chrome and navigate to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the `grind-time` folder you just downloaded
   - The extension icon should appear in your toolbar

4. **Start Coding!**
   - Visit any supported coding website
   - Your time will be automatically tracked
   - Click the extension icon to view your stats

## Usage

### Getting Started
1. Install the extension using the steps above
2. Navigate to any supported coding website
3. Start coding! The extension automatically begins tracking
4. Click the Grind Time icon in your toolbar to view statistics

### Understanding Your Stats

**Today Tab**
- Shows total time coded today
- Pie chart breakdown by website
- Updates in real-time as you code

**Week Tab**
- 7-day coding time summary
- Daily trend line chart
- Site distribution pie chart

**Month Tab**
- 30-day comprehensive overview
- Monthly trend analysis
- Long-term site usage patterns

**Streak Tab**
- Current consecutive coding days
- Motivation to maintain daily practice

## Technical Details

- **Manifest Version**: 3 (Latest Chrome Extension standard)
- **Permissions**: `tabs`, `storage`, `activeTab`
- **Storage**: Chrome's local storage API
- **Charts**: Chart.js for data visualization
- **Background**: Service worker for efficient tracking

## Privacy

- **No Data Collection**: All data stays on your local machine
- **No Network Requests**: Extension works completely offline
- **No Personal Information**: Only tracks time spent on coding sites
- **Secure Storage**: Uses Chrome's secure local storage

## Contributing

We welcome contributions! Here's how you can help:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make Your Changes**
4. **Commit Your Changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Ideas for Contributions
- Add support for more coding websites
- Improve the UI/UX design
- Add export functionality for data
- Create weekly/monthly reports
- Add goal setting features
- Implement data backup/sync

## Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/grind-time.git
cd grind-time

# The extension is ready to load into Chrome
# No build process required - pure JavaScript
```

## File Structure

```
grind-time/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for time tracking
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality and charts
├── popup.css             # Styling for the popup
├── chart.min.js          # Chart.js library
└── icons/                # Extension icons
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## Troubleshooting

### Extension Not Tracking Time
- Ensure you're on a supported website
- Check that the extension has proper permissions
- Try refreshing the coding website

### Charts Not Loading
- Verify Chart.js is included in the extension folder
- Check browser console for any JavaScript errors
- Try reloading the extension

### Data Not Persisting
- Confirm Chrome storage permissions are granted
- Check if browser is in incognito mode (may affect storage)

## Roadmap

- [ ] Chrome Web Store publication
- [ ] Firefox extension port
- [ ] Data export functionality
- [ ] Goal setting and notifications
- [ ] Integration with productivity tools
- [ ] Weekly summary emails
- [ ] Custom website support

## Support

- **Issues**: Report bugs on [GitHub Issues](https://github.com/your-username/grind-time/issues)
- **Feature Requests**: Submit ideas via GitHub Issues
- **Questions**: Open a discussion on GitHub

## Acknowledgments

- Chart.js for beautiful data visualization
- Chrome Extensions team for comprehensive documentation
- The coding community for inspiration and feedback

---

**Made with ❤️ for the coding community**

*Keep grinding, keep growing!* 🚀

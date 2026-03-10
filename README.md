# Prudent MF - RM App

🚀 **Live Demo:** [https://prudent-rm-app.onrender.com](https://prudent-rm-app.onrender.com)

📱 **Download APK:** Available on the website

## Overview

Progressive Web App (PWA) for Prudent Mutual Fund Relationship Managers with Android APK download functionality.

## Features

### 📱 Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly interface
- Native app-like experience

### 🔄 PWA Capabilities
- **Installable:** Add to home screen on mobile devices
- **Offline Support:** Works without internet connection
- **Fast Loading:** Cached resources for instant access
- **Push Notifications:** Stay updated with important alerts

### 📥 APK Download
- **Download Banner:** Prominent download button at the top
- **Direct Download:** One-click APK installation
- **Auto-hide on Desktop:** Banner only shows on mobile devices

### 🎯 Core Functionality
- **Dashboard:** KPIs, quick actions, today's schedule
- **Channel Partners:** Complete CP management and tracking
- **Reports:** Role-based access to business reports
- **Tasks & Reminders:** Task management with priorities
- **Call Logging:** Track all CP interactions
- **Hierarchy View:** Organizational structure
- **Notifications:** Real-time alerts and updates

## Demo Credentials

```
Employee ID: PMF1042
Password: 1234
Role: Relationship Manager (RM)
```

## Quick Start

### Run Locally
```bash
npm install
npm start
```
Access at: `http://localhost:3000`

### Deploy to Render
1. Fork this repository
2. Connect to Render
3. Deploy automatically

### Build APK
```bash
cd cordova-app
npx cordova build android
```

## Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **PWA:** Service Worker, Web App Manifest
- **Backend:** Node.js + Express (for Render hosting)
- **Mobile:** Apache Cordova for APK generation
- **Hosting:** Render.com (free tier)

## Project Structure

```
├── index.html          # Main PWA application
├── manifest.json       # PWA manifest configuration
├── sw.js              # Service worker for offline support
├── server.js          # Express server for Render deployment
├── css/style.css      # Complete app styling + APK banner
├── js/
│   ├── app.js         # Main application logic
│   └── data.js        # Sample data and mock API
├── assets/logo.png    # App logo and branding
└── cordova-app/       # Android build directory
```

## Key Features Breakdown

### 🏠 Dashboard
- **Greeting & Location:** Personalized welcome with territory info
- **KPI Cards:** AUM, SIPs, New Folios, Pending Tasks
- **Quick Actions:** Fast access to common functions
- **Today's Schedule:** Upcoming CP meetings and calls

### 🤝 Channel Partner Management
- **CP List:** Search, filter, and sort channel partners
- **CP Details:** Complete profile with AUM, growth, schemes
- **Action Buttons:** Call, WhatsApp, SMS, Set Task
- **Call History:** Track all interactions and outcomes
- **Performance Metrics:** Growth tracking and analytics

### 📊 Reports (Role-Based Access)
- **Business Summary:** Overall performance metrics
- **SIP Report:** Active SIPs and new registrations
- **New Business:** Folio creation and lump sum investments
- **Scheme Analysis:** AUM breakdown by categories
- **Top Performers:** Best performing CPs
- **Growth Tracker:** Month-wise AUM trends

### ✅ Task Management
- **Task Creation:** Set reminders with priorities
- **CP-Specific Tasks:** Link tasks to channel partners
- **Due Date Tracking:** Never miss important follow-ups
- **Status Management:** Mark tasks as complete
- **Smart Filtering:** Filter by status, type, priority

### 📞 Call Logging
- **Quick Logging:** Fast call outcome recording
- **Detailed Notes:** Capture conversation details
- **Follow-up Scheduling:** Set next contact dates
- **Outcome Tracking:** Positive, Neutral, Negative outcomes

## Browser Support

- ✅ Chrome 80+
- ✅ Safari 13+
- ✅ Firefox 75+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **First Load:** < 2 seconds
- **Subsequent Loads:** < 0.5 seconds (cached)
- **Offline Mode:** Full functionality without internet
- **Bundle Size:** < 500KB total

## Security

- **HTTPS Only:** Secure connection required for PWA features
- **No External Dependencies:** All resources self-hosted
- **Client-Side Only:** No sensitive data transmitted
- **Demo Data:** All data is mock/sample data

## Deployment Options

### 🌐 Web Hosting
- **Render.com** (recommended, free)
- **Netlify** (free tier available)
- **Vercel** (free tier available)
- **GitHub Pages** (free)

### 📱 Mobile Distribution
- **Direct APK:** Download from website
- **Google Play Store:** Upload signed APK
- **Enterprise MDM:** Internal distribution

## Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build APK (requires Android SDK)
cd cordova-app
npx cordova build android
```

### Environment Setup
- **Node.js 14+**
- **Android Studio** (for APK builds)
- **Java JDK 11+** (for APK builds)

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

ISC License - Prudent MF Team

## Support

For issues or questions:
- Create GitHub issue
- Contact: support@prudentmf.com

---

**Built with ❤️ for Prudent MF Relationship Managers**
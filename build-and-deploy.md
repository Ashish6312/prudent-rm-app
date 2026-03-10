# Build APK and Deploy to Render

## Step 1: Build the APK

First, build your Android APK:

```powershell
# Build APK using Cordova
cd cordova-app
npx cordova build android

# Copy APK to root directory for download
copy platforms\android\app\build\outputs\apk\debug\app-debug.apk ..\prudent-rm-app.apk
cd ..
```

## Step 2: Deploy to Render

### Option A: GitHub Integration (Recommended)

1. **Create GitHub Repository:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit - Prudent MF RM PWA"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/prudent-rm-app.git
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect the `render.yaml` configuration
   - Click "Deploy"

### Option B: Direct Deploy

1. **Install Render CLI:**
   ```powershell
   npm install -g @render/cli
   ```

2. **Login and Deploy:**
   ```powershell
   render login
   render deploy
   ```

## Step 3: Access Your App

Your app will be live at: `https://prudent-rm-app.onrender.com`

## Features

✅ **PWA Functionality:**
- Installable on mobile devices
- Offline support via Service Worker
- App-like experience

✅ **APK Download:**
- Download banner at the top
- Direct APK download link
- Mobile-optimized interface

✅ **Responsive Design:**
- Works on all devices
- Mobile-first approach
- Desktop preview mode

## File Structure

```
prudent-rm-app/
├── index.html          # Main PWA file
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── server.js          # Express server for Render
├── package.json       # Node.js dependencies
├── render.yaml        # Render deployment config
├── prudent-rm-app.apk # Android APK file
├── css/
│   └── style.css      # App styles + APK banner
├── js/
│   ├── app.js         # App logic + APK banner
│   └── data.js        # Sample data
└── assets/
    └── logo.png       # App logo
```

## Environment Variables (Optional)

In Render dashboard, you can set:
- `NODE_ENV=production`
- `PORT=3000` (auto-set by Render)

## Custom Domain (Optional)

1. Go to your Render service settings
2. Add custom domain
3. Update DNS records as instructed

## Updates

To update your app:
```powershell
git add .
git commit -m "Update app"
git push origin main
```

Render will automatically redeploy.

## APK Updates

When you rebuild the APK:
1. Build new APK with Cordova
2. Replace `prudent-rm-app.apk` in root
3. Commit and push to GitHub
4. Users can download the updated APK

## Monitoring

- View logs in Render dashboard
- Monitor performance and usage
- Set up alerts for downtime

Your Prudent MF RM app is now live as both a PWA and APK download site!
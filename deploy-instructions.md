# 🚀 Deploy Prudent MF RM App to Render

## Quick Deploy (5 minutes)

### 1. Create GitHub Repository
```bash
git init
git add .
git commit -m "Prudent MF RM PWA with APK download"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/prudent-rm-app.git
git push -u origin main
```

### 2. Deploy on Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Render auto-detects settings from `render.yaml`
6. Click "Deploy"

### 3. Your App is Live! 🎉
- **URL:** `https://prudent-rm-app.onrender.com`
- **APK Download:** Available on mobile devices
- **PWA Install:** Available on all devices

## Build APK (Optional)

If you want to provide APK download:

```bash
# Build APK
cd cordova-app
npx cordova build android

# Copy to root for download
copy platforms\android\app\build\outputs\apk\debug\app-debug.apk ..\prudent-rm-app.apk
```

Then commit and push the APK file.

## Features Live on Render

✅ **PWA Functionality**
- Install on mobile home screen
- Offline support
- App-like experience

✅ **APK Download Banner**
- Shows on mobile devices only
- Direct download link
- Professional UI

✅ **Full App Features**
- Dashboard with KPIs
- Channel Partner management
- Reports and analytics
- Task management
- Call logging

## Environment

- **Node.js:** 18.x
- **Free Tier:** 750 hours/month
- **Auto-deploy:** On git push
- **HTTPS:** Automatic SSL

## Custom Domain (Optional)

1. In Render dashboard → Settings
2. Add custom domain
3. Update DNS records

Your Prudent MF RM app is now live! 🚀
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// APK download endpoint (placeholder - you'll upload the actual APK)
app.get('/download-apk', (req, res) => {
  const apkPath = path.join(__dirname, 'prudent-rm-app.apk');
  res.download(apkPath, 'PrudentRM.apk', (err) => {
    if (err) {
      res.status(404).send('APK file not found. Please build the APK first.');
    }
  });
});

// Manifest
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'manifest.json'));
});

// Service Worker
app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'sw.js'));
});

app.listen(PORT, () => {
  console.log(`✅ Prudent MF RM App running on port ${PORT}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
});

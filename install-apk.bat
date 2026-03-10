@echo off
echo ========================================
echo Install Prudent MF RM APK on Device
echo ========================================
echo.

if not exist prudent-rm-app.apk (
    echo ❌ APK file not found!
    echo Please run build-apk-complete.bat first to build the APK.
    pause
    exit /b 1
)

echo Checking for connected Android devices...
adb devices

echo.
echo Installing APK on connected device...
adb install -r prudent-rm-app.apk

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ APK installed successfully!
    echo.
    echo The Prudent MF RM app should now appear on your device.
    echo You can find it in the app drawer.
) else (
    echo.
    echo ❌ Installation failed!
    echo.
    echo Make sure:
    echo 1. USB Debugging is enabled on your device
    echo 2. Device is connected via USB
    echo 3. You've allowed USB debugging for this computer
    echo.
    echo Or transfer the APK file to your phone and install manually:
    echo 1. Copy prudent-rm-app.apk to your phone
    echo 2. Enable "Install from Unknown Sources" in Settings
    echo 3. Open the APK file and install
)

echo.
pause
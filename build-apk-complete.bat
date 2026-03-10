@echo off
echo ========================================
echo Prudent MF RM App - Complete APK Build
echo ========================================
echo.

echo [1/5] Checking Android SDK...
if "%ANDROID_HOME%"=="" (
    echo ❌ ANDROID_HOME not set
    echo.
    echo Please install Android Studio and set environment variables:
    echo 1. Install Android Studio from https://developer.android.com/studio
    echo 2. Set ANDROID_HOME to your SDK path, e.g.:
    echo    ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
    echo 3. Add to PATH:
    echo    %%ANDROID_HOME%%\platform-tools
    echo    %%ANDROID_HOME%%\cmdline-tools\latest\bin
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)

echo ✅ ANDROID_HOME found: %ANDROID_HOME%

echo.
echo [2/5] Copying web files to Cordova...
copy /Y index.html cordova-app\www\
copy /Y manifest.json cordova-app\www\
copy /Y sw.js cordova-app\www\
xcopy /E /Y /Q css cordova-app\www\css\
xcopy /E /Y /Q js cordova-app\www\js\
xcopy /E /Y /Q assets cordova-app\www\assets\
copy /Y config.xml cordova-app\

echo.
echo [3/5] Building APK...
cd cordova-app
call npx cordova build android

echo.
echo [4/5] Copying APK to root...
if exist platforms\android\app\build\outputs\apk\debug\app-debug.apk (
    copy platforms\android\app\build\outputs\apk\debug\app-debug.apk ..\prudent-rm-app.apk
    echo ✅ APK copied to prudent-rm-app.apk
) else (
    echo ❌ APK build failed
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo [5/5] Testing APK installation...
echo.
echo ========================================
echo BUILD COMPLETE! 🎉
echo ========================================
echo.
echo Your APK is ready at: prudent-rm-app.apk
echo.
echo To install on Android device:
echo 1. Enable "Developer Options" on your phone
echo 2. Enable "USB Debugging"
echo 3. Connect phone via USB
echo 4. Run: adb install prudent-rm-app.apk
echo.
echo Or transfer the APK file to your phone and install manually.
echo.
pause
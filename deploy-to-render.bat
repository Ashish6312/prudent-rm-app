@echo off
echo ========================================
echo Deploy Prudent MF RM App to Render
echo ========================================
echo.

echo [1/4] Checking if Git is initialized...
if not exist .git (
    echo Initializing Git repository...
    git init
    echo Git repository initialized.
) else (
    echo Git repository already exists.
)

echo.
echo [2/4] Adding all files to Git...
git add .
git status

echo.
echo [3/4] Committing changes...
git commit -m "Deploy Prudent MF RM App to Render"

echo.
echo [4/4] Next steps for Render deployment:
echo.
echo ========================================
echo RENDER DEPLOYMENT STEPS
echo ========================================
echo.
echo 1. CREATE GITHUB REPOSITORY:
echo    - Go to https://github.com/new
echo    - Repository name: prudent-rm-app
echo    - Make it Public
echo    - Click "Create repository"
echo.
echo 2. PUSH TO GITHUB:
echo    - Copy the commands from GitHub and run them here
echo    - Example:
echo      git branch -M main
echo      git remote add origin https://github.com/YOUR_USERNAME/prudent-rm-app.git
echo      git push -u origin main
echo.
echo 3. DEPLOY ON RENDER:
echo    - Go to https://render.com
echo    - Sign up with GitHub
echo    - Click "New +" then "Web Service"
echo    - Connect your GitHub repository
echo    - Render will auto-detect settings
echo    - Click "Deploy"
echo.
echo 4. YOUR APP WILL BE LIVE AT:
echo    https://prudent-rm-app.onrender.com
echo.
echo ========================================
echo Ready for GitHub! Run the GitHub commands now.
echo ========================================
pause
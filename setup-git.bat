@echo off
echo 🚀 SRE GPT - Git Repository Setup
echo ================================

echo.
echo 📋 This script will help you set up your Git repository
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/windows
    pause
    exit /b 1
)

echo ✅ Git is installed

REM Check if already a git repository
if exist .git (
    echo ✅ Git repository already initialized
) else (
    echo 📁 Initializing Git repository...
    git init
    echo ✅ Git repository initialized
)

REM Create .gitignore if it doesn't exist
if not exist .gitignore (
    echo 📝 Creating .gitignore file...
    echo node_modules/ > .gitignore
    echo logs/ >> .gitignore
    echo *.log >> .gitignore
    echo .env >> .gitignore
    echo .DS_Store >> .gitignore
    echo .vscode/settings.json >> .gitignore
    echo dist/ >> .gitignore
    echo build/ >> .gitignore
    echo coverage/ >> .gitignore
    echo .nyc_output/ >> .gitignore
    echo .cache/ >> .gitignore
    echo temp/ >> .gitignore
    echo tmp/ >> .gitignore
    echo ✅ .gitignore created
) else (
    echo ✅ .gitignore already exists
)

echo.
echo 📦 Adding all files to Git...
git add .

echo.
echo 💬 Creating initial commit...
git commit -m "🚀 Initial commit: Complete SRE GPT Dashboard

Features:
- AI-powered chat interface for system monitoring
- Real-time dashboard with health metrics  
- Dark/light mode toggle with smooth transitions
- Dynatrace integration for monitoring data
- WebSocket real-time updates
- Performance metrics cards
- Service status monitoring
- Problem detection and alerting
- Recent events tracking
- Responsive design for mobile/desktop
- Docker support for easy deployment
- Multiple cloud deployment options

Tech Stack:
- Backend: Node.js, Express.js, Socket.IO
- Frontend: Vanilla JavaScript, Tailwind CSS
- Monitoring: Dynatrace API integration
- AI: Natural language processing for chat
- Deployment: Docker, cloud-ready"

echo.
echo ✅ Initial commit created successfully!
echo.
echo 🌐 Next Steps:
echo 1. Create a new repository on GitHub.com
echo 2. Copy the repository URL
echo 3. Run: git remote add origin [YOUR_GITHUB_URL]
echo 4. Run: git branch -M main
echo 5. Run: git push -u origin main
echo.
echo 💡 Example:
echo    git remote add origin https://github.com/yourusername/sre-gpt-dashboard.git
echo    git branch -M main  
echo    git push -u origin main
echo.
echo 🎉 Your SRE GPT project is ready for GitHub!

pause
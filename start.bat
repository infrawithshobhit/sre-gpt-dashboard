@echo off
echo SRE GPT - Starting Application...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env exists
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo Created .env file from template
        echo.
        echo IMPORTANT: Please edit .env file with your Dynatrace credentials before continuing
        echo Press any key to open .env file for editing...
        pause >nul
        notepad .env
    ) else (
        echo Error: .env.example not found
        pause
        exit /b 1
    )
)

REM Create required directories
if not exist "logs" mkdir logs
if not exist "config" mkdir config

echo.
echo Starting SRE GPT application...
echo Dashboard will be available at: http://localhost:3000
echo Press Ctrl+C to stop the application
echo.

REM Start the application
npm run dev
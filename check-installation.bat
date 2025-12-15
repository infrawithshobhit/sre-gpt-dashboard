@echo off
echo ========================================
echo SRE GPT Installation Checker
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js is installed
    node --version
) else (
    echo [ERROR] Node.js is NOT installed
    echo Please install Node.js 18+ from https://nodejs.org/
    echo.
    goto :end
)

echo.
echo Checking npm availability...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] npm is available
    npm --version
) else (
    echo [ERROR] npm is NOT available
    goto :end
)

echo.
echo Checking required files...

set "files=package.json src\app.js src\dashboard\index.html .env.example"
set "missing=0"

for %%f in (%files%) do (
    if exist "%%f" (
        echo [OK] %%f
    ) else (
        echo [MISSING] %%f
        set /a missing+=1
    )
)

echo.
if %missing% equ 0 (
    echo [SUCCESS] All core files are present!
    echo.
    echo Ready to proceed with installation:
    echo 1. Run: start.bat
    echo 2. Or manually: npm install, then npm run dev
    echo 3. Open http://localhost:3000 in your browser
) else (
    echo [ERROR] %missing% files are missing
    echo Please ensure all SRE GPT files are present
)

:end
echo.
echo Press any key to exit...
pause >nul
@echo off
echo ========================================
echo Technology KSA - Starting System
echo ========================================
echo.

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting Publisher API on port 3001...
start "Publisher API" cmd /k "node publisher-api.js"

timeout /t 3 /nobreak >nul

echo Starting Website Server on port 8080...
start "Website Server" cmd /k "npx http-server ./dist -p 8080"

echo.
echo ========================================
echo System Started Successfully!
echo ========================================
echo.
echo Publisher API: http://localhost:3001
echo Admin Panel:    http://127.0.0.1:8080/admin/
echo Website:        http://127.0.0.1:8080/
echo.
echo IMPORTANT: Keep both windows open while working!
echo.
echo Press any key to open Admin Panel in browser...
pause >nul

start http://127.0.0.1:8080/admin/

echo.
echo To stop the system, close both command windows.
echo.

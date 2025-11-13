@echo off
echo ========================================
echo Technology KSA - Pull Updates and Start
echo ========================================
echo.

echo Pulling latest changes from Git...
git pull origin claude/fix-image-url-display-011CV5PLignHQVzQ8LAaE76G

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: Git pull failed!
    echo Continue anyway? (Press Ctrl+C to cancel)
    pause
)

echo.
echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo ========================================
echo Starting System...
echo ========================================
echo.

echo Starting Publisher API on port 3001...
start "Publisher API" cmd /k "node publisher-api.js"

timeout /t 3 /nobreak >nul

echo Starting Website Server on port 8080...
start "Website Server" cmd /k "npx http-server ./dist -p 8080"

timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo System Started Successfully!
echo ========================================
echo.
echo Publisher API: http://localhost:3001
echo Admin Panel:    http://127.0.0.1:8080/admin/
echo Website:        http://127.0.0.1:8080/
echo.
echo Testing API connection...
timeout /t 2 /nobreak >nul

curl http://localhost:3001/api/health

echo.
echo.
echo Press any key to open Admin Panel in browser...
pause >nul

start http://127.0.0.1:8080/admin/index.html

echo.
echo System is running! Keep both windows open.
echo.

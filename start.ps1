# ========================================
# Technology KSA - Start System (PowerShell)
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Technology KSA - Starting System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

Write-Host "Stopping existing processes on ports 3001 and 8080..." -ForegroundColor Yellow

# Stop processes on port 3001
$process3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($process3001) {
    $pid3001 = $process3001.OwningProcess
    Write-Host "Stopping process on port 3001 (PID: $pid3001)..." -ForegroundColor Yellow
    Stop-Process -Id $pid3001 -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# Stop processes on port 8080
$process8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($process8080) {
    $pid8080 = $process8080.OwningProcess
    Write-Host "Stopping process on port 8080 (PID: $pid8080)..." -ForegroundColor Yellow
    Stop-Process -Id $pid8080 -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Services..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Publisher API
Write-Host "Starting Publisher API on port 3001..." -ForegroundColor Yellow
Start-Process -WindowStyle Normal -FilePath "node" -ArgumentList "publisher-api.js" -WorkingDirectory $PWD

Start-Sleep -Seconds 3

# Test Publisher API
Write-Host "Testing Publisher API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Publisher API is responding" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Publisher API is not responding yet" -ForegroundColor Red
    Write-Host "  Waiting 3 more seconds..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}

Write-Host ""

# Start HTTP Server
Write-Host "Starting HTTP Server on port 8080..." -ForegroundColor Yellow
Start-Process -WindowStyle Normal -FilePath "npx" -ArgumentList "http-server", "./dist", "-p", "8080" -WorkingDirectory $PWD

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "System Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Publisher API: " -NoNewline
Write-Host "http://localhost:3001" -ForegroundColor Green
Write-Host "Admin Panel:   " -NoNewline
Write-Host "http://127.0.0.1:8080/admin/" -ForegroundColor Green
Write-Host "Website:       " -NoNewline
Write-Host "http://127.0.0.1:8080/" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Keep the opened windows running!" -ForegroundColor Yellow
Write-Host ""

# Wait a bit before opening browser
Start-Sleep -Seconds 2

# Open admin panel in browser
Write-Host "Opening Admin Panel in browser..." -ForegroundColor Yellow
Start-Process "http://127.0.0.1:8080/admin/index.html"

Write-Host ""
Write-Host "To stop the system:" -ForegroundColor Yellow
Write-Host "  1. Close the Publisher API window" -ForegroundColor Yellow
Write-Host "  2. Close the HTTP Server window" -ForegroundColor Yellow
Write-Host ""
Write-Host "Or run: .\stop.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Enter to finish..." -ForegroundColor Cyan
Read-Host

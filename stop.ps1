# ========================================
# Technology KSA - Stop System (PowerShell)
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Technology KSA - Stopping System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop processes on port 3001
Write-Host "Stopping processes on port 3001..." -ForegroundColor Yellow
$process3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($process3001) {
    $pid3001 = $process3001.OwningProcess
    Write-Host "  Stopping PID: $pid3001" -ForegroundColor Yellow
    Stop-Process -Id $pid3001 -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Stopped" -ForegroundColor Green
} else {
    Write-Host "  No process found on port 3001" -ForegroundColor Gray
}

Write-Host ""

# Stop processes on port 8080
Write-Host "Stopping processes on port 8080..." -ForegroundColor Yellow
$process8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($process8080) {
    $pid8080 = $process8080.OwningProcess
    Write-Host "  Stopping PID: $pid8080" -ForegroundColor Yellow
    Stop-Process -Id $pid8080 -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Stopped" -ForegroundColor Green
} else {
    Write-Host "  No process found on port 8080" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "System Stopped" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

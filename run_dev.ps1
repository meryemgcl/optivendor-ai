# OptiVendor.AI - All-in-One Local Development Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       OptiVendor.AI - Autonomous RFQ Engine Launcher     " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ROOT_DIR = $PSScriptRoot

# 1. Start FastAPI Backend in new window
Write-Host "[1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT_DIR'; `$env:PYTHONPATH='$ROOT_DIR'; python -m uvicorn core.main:app --host 127.0.0.1 --port 8000 --reload"

# 2. Start Next.js Frontend in current or new window
Write-Host "[2/2] Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT_DIR\web'; npm run dev"

Write-Host ""
Write-Host "Services are launching:" -ForegroundColor Cyan
Write-Host "  -> Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host "  -> Backend API: http://127.0.0.1:8000" -ForegroundColor White
Write-Host "  -> API Docs:    http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this launcher window (services keep running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

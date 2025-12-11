@echo off
echo ========================================
echo    AWS Workshop Quick Start
echo ========================================

echo.
echo [1/2] Starting Backend Server...
cd Back-End
start "Backend Server" cmd /k "java -jar target\ShopGameManagement-0.0.1-SNAPSHOT.jar"

echo.
echo [2/2] Starting Frontend Server...
cd ..\Front-End
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo    Services Started!
echo ========================================
echo Backend: http://localhost:8080/identity
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
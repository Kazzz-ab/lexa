@echo off
echo Starting Lexa API (port 4001)...
start "Lexa API" cmd /k "cd /d %~dp0backend && node src/index.js"

echo Starting Lexa UI (port 5174)...
start "Lexa UI" cmd /k "cd /d %~dp0frontend && npx vite --port 5174"

echo.
echo Lexa is launching in two windows.
echo   UI:  http://localhost:5174
echo   API: http://localhost:4001
pause

@echo off
title GlassSheet
cd /d "%~dp0"
echo Starting GlassSheet...
echo.
echo Backend: http://localhost:3001
echo Frontend (open in browser): http://localhost:5173
echo.
echo Press Ctrl+C to stop.
echo.
call npm run dev

@echo off
cd /d "%~dp0"
set "PATH=D:\node;%PATH%"

if not exist "node_modules" (
  echo Installing dependencies...
  "D:\node\npm.cmd" install
  echo.
)

echo Starting AtmosVibe Weather dev server...
echo Open in browser: http://localhost:3000/
echo.
"D:\node\npm.cmd" run dev
pause

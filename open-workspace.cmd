@echo off
cd /d "%~dp0"
where git >nul 2>nul
if errorlevel 1 (
  if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" (
    set "PATH=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd;%PATH%"
  ) else (
    echo Git is required. Install Git for Windows from https://git-scm.com/download/win
    pause
    exit /b 1
  )
)
echo Repository: %CD%
echo Preview: npm.cmd start
echo Get latest: git pull --ff-only
powershell.exe -NoLogo -NoExit

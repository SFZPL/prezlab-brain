@echo off
echo.
echo ========================================
echo    AI Design Analyzer - Python Flask
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://python.org
    pause
    exit /b 1
)

echo Python found. Checking version...
python --version

REM Check if virtual environment exists
if not exist "venv" (
    echo.
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies if requirements.txt exists
if exist "requirements.txt" (
    echo.
    echo Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo WARNING: Some dependencies may not have installed correctly
        echo You can try running: pip install -r requirements.txt manually
    )
)

REM Run the application
echo.
echo Starting AI Design Analyzer...
echo.
echo The application will be available at: http://localhost:5000
echo Press Ctrl+C to stop the application
echo.
echo ========================================

python run.py

echo.
echo Application stopped.
pause 
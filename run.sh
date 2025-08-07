#!/bin/bash

echo ""
echo "========================================"
echo "   AI Design Analyzer - Python Flask"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

echo "Python found. Checking version..."
python3 --version

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo ""
    echo "Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
echo ""
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo ""
    echo "Installing dependencies..."
    pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "WARNING: Some dependencies may not have installed correctly"
        echo "You can try running: pip install -r requirements.txt manually"
    fi
fi

# Run the application
echo ""
echo "Starting AI Design Analyzer..."
echo ""
echo "The application will be available at: http://localhost:5000"
echo "Press Ctrl+C to stop the application"
echo ""
echo "========================================"

python3 run.py

echo ""
echo "Application stopped." 
#!/usr/bin/env python3
"""
AI Design Analyzer - Startup Script
A simple script to run the Flask application with proper setup and error handling.
"""

import os
import sys
import subprocess
import importlib.util

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        sys.exit(1)
    print(f"✅ Python version: {sys.version.split()[0]}")

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = [
        'flask',
        'flask_cors', 
        'openai',
        'python-pptx',
        'mammoth',
        'PyPDF2'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            importlib.util.find_spec(package.replace('-', '_'))
            print(f"✅ {package}")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package} - Missing")
    
    if missing_packages:
        print(f"\n❌ Missing packages: {', '.join(missing_packages)}")
        print("Please install dependencies with: pip install -r requirements.txt")
        return False
    
    return True

def check_environment():
    """Check environment setup"""
    print("\n🔧 Checking environment...")
    
    # Check if uploads directory exists
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
        print("✅ Created uploads directory")
    else:
        print("✅ Uploads directory exists")
    
    # Check for .env file
    if not os.path.exists('.env'):
        print("⚠️  No .env file found")
        print("Creating .env file with template...")
        with open('.env', 'w') as f:
            f.write("# AI Design Analyzer Environment Variables\n")
            f.write("OPENAI_API_KEY=your-api-key-here\n")
            f.write("SECRET_KEY=your-secret-key-here\n")
            f.write("FLASK_ENV=development\n")
        print("✅ Created .env file template")
        print("⚠️  Please edit .env file and add your OpenAI API key")
    else:
        print("✅ .env file exists")
    
    # Check if OpenAI API key is set
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key or api_key == 'your-api-key-here':
        print("⚠️  OpenAI API key not set in .env file")
        print("   The application will work but analysis features will be limited")
    else:
        print("✅ OpenAI API key configured")

def start_application():
    """Start the Flask application"""
    print("\n🚀 Starting AI Design Analyzer...")
    print("📱 Open your browser to: http://localhost:5000")
    print("🛑 Press Ctrl+C to stop the application")
    print("-" * 50)
    
    try:
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n👋 Application stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting application: {e}")
        sys.exit(1)

def main():
    """Main startup function"""
    print("🎨 AI Design Analyzer - Python Flask Version")
    print("=" * 50)
    
    # Check Python version
    print("🐍 Checking Python version...")
    check_python_version()
    
    # Check dependencies
    print("\n📦 Checking dependencies...")
    if not check_dependencies():
        sys.exit(1)
    
    # Check environment
    check_environment()
    
    # Start application
    start_application()

if __name__ == "__main__":
    main() 
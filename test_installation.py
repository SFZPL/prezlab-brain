#!/usr/bin/env python3
"""
AI Design Analyzer - Installation Test Script
Tests all major components to ensure the application is working correctly.
"""

import os
import sys
import tempfile
import json
from pathlib import Path

def test_imports():
    """Test that all required modules can be imported"""
    print("🔍 Testing imports...")
    
    try:
        import flask
        print("✅ Flask")
    except ImportError as e:
        print(f"❌ Flask: {e}")
        return False
    
    try:
        import flask_cors
        print("✅ Flask-CORS")
    except ImportError as e:
        print(f"❌ Flask-CORS: {e}")
        return False
    
    try:
        import openai
        print("✅ OpenAI")
    except ImportError as e:
        print(f"❌ OpenAI: {e}")
        return False
    
    try:
        from pptx import Presentation
        print("✅ python-pptx")
    except ImportError as e:
        print(f"❌ python-pptx: {e}")
        return False
    
    try:
        import mammoth
        print("✅ mammoth")
    except ImportError as e:
        print(f"❌ mammoth: {e}")
        return False
    
    try:
        import PyPDF2
        print("✅ PyPDF2")
    except ImportError as e:
        print(f"❌ PyPDF2: {e}")
        return False
    
    return True

def test_file_parser():
    """Test the file parser functionality"""
    print("\n📄 Testing file parser...")
    
    try:
        from app import FileParser
        parser = FileParser()
        print("✅ FileParser initialized")
        
        # Test text file parsing
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write("Test presentation content\nThis is a sample slide\n")
            temp_file = f.name
        
        try:
            result = parser.parse_file(temp_file, 'txt')
            if result and 'text_content' in result:
                print("✅ Text file parsing works")
            else:
                print("❌ Text file parsing failed")
                return False
        finally:
            os.unlink(temp_file)
        
        return True
        
    except Exception as e:
        print(f"❌ FileParser test failed: {e}")
        return False

def test_openai_service():
    """Test OpenAI service (without making API calls)"""
    print("\n🤖 Testing OpenAI service...")
    
    try:
        from app import OpenAIService
        
        # Test with dummy API key
        service = OpenAIService("dummy-key")
        print("✅ OpenAIService initialized")
        
        # Test prompt creation
        test_content = {
            'text_content': 'Test content',
            'slide_count': 5,
            'metadata': {'colors': [], 'fonts': []}
        }
        
        prompt = service._create_design_compass_prompt(test_content, "Test context")
        if prompt and len(prompt) > 100:
            print("✅ Prompt creation works")
        else:
            print("❌ Prompt creation failed")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ OpenAIService test failed: {e}")
        return False

def test_flask_app():
    """Test Flask app initialization"""
    print("\n🌐 Testing Flask app...")
    
    try:
        from app import app
        print("✅ Flask app initialized")
        
        # Test basic routes
        with app.test_client() as client:
            # Test health endpoint
            response = client.get('/health')
            if response.status_code == 200:
                print("✅ Health endpoint works")
            else:
                print("❌ Health endpoint failed")
                return False
            
            # Test main page
            response = client.get('/')
            if response.status_code == 200:
                print("✅ Main page works")
            else:
                print("❌ Main page failed")
                return False
        
        return True
        
    except Exception as e:
        print(f"❌ Flask app test failed: {e}")
        return False

def test_environment():
    """Test environment setup"""
    print("\n🔧 Testing environment...")
    
    # Check uploads directory
    if os.path.exists('uploads'):
        print("✅ Uploads directory exists")
    else:
        print("⚠️  Uploads directory missing (will be created on startup)")
    
    # Check .env file
    if os.path.exists('.env'):
        print("✅ .env file exists")
        
        # Check if OpenAI API key is set
        from dotenv import load_dotenv
        load_dotenv()
        
        api_key = os.getenv('OPENAI_API_KEY')
        if api_key and api_key != 'your-api-key-here':
            print("✅ OpenAI API key configured")
        else:
            print("⚠️  OpenAI API key not configured (analysis features will be limited)")
    else:
        print("⚠️  .env file missing (will be created on startup)")
    
    return True

def test_file_structure():
    """Test that all required files exist"""
    print("\n📁 Testing file structure...")
    
    required_files = [
        'app.py',
        'requirements.txt',
        'README.md'
    ]
    
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - Missing")
            return False
    
    return True

def main():
    """Run all tests"""
    print("🧪 AI Design Analyzer - Installation Test")
    print("=" * 50)
    
    tests = [
        ("File Structure", test_file_structure),
        ("Imports", test_imports),
        ("Environment", test_environment),
        ("File Parser", test_file_parser),
        ("OpenAI Service", test_openai_service),
        ("Flask App", test_flask_app)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                print(f"❌ {test_name} test failed")
        except Exception as e:
            print(f"❌ {test_name} test failed with exception: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The application is ready to run.")
        print("\n🚀 To start the application, run:")
        print("   python run.py")
        print("   or")
        print("   python app.py")
    else:
        print("❌ Some tests failed. Please check the errors above.")
        print("\n💡 Common solutions:")
        print("   1. Install dependencies: pip install -r requirements.txt")
        print("   2. Check Python version (3.8+ required)")
        print("   3. Set up .env file with your OpenAI API key")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 
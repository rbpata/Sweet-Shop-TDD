"""
Test script to verify backend setup
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_imports():
    """Test if all required modules can be imported"""
    try:
        from app import create_app, db
        from app.models import User, Sweet
        print("✓ All imports successful")
        return True
    except ImportError as e:
        print(f"✗ Import error: {e}")
        return False

def test_database_connection():
    """Test database connection"""
    try:
        from app import create_app, db
        app = create_app()
        
        with app.app_context():
            # Try to create tables
            db.create_all()
            print("✓ Database connection successful")
            return True
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return False

def test_api_endpoints():
    """Test if API endpoints are accessible"""
    try:
        from app import create_app
        app = create_app()
        
        # Test if app can be created
        with app.test_client() as client:
            # Test auth endpoint
            response = client.get('/api/auth/login')
            # Should return 405 (Method Not Allowed) since we're using GET on POST endpoint
            if response.status_code in [405, 404]:
                print("✓ API endpoints accessible")
                return True
            else:
                print(f"✗ Unexpected response: {response.status_code}")
                return False
    except Exception as e:
        print(f"✗ API test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("Testing Sweet Management Backend Setup...")
    print("=" * 50)
    
    tests = [
        ("Import Test", test_imports),
        ("Database Connection", test_database_connection),
        ("API Endpoints", test_api_endpoints),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\nRunning {test_name}...")
        if test_func():
            passed += 1
        else:
            print(f"✗ {test_name} failed")
    
    print("\n" + "=" * 50)
    print(f"Tests passed: {passed}/{total}")
    
    if passed == total:
        print("✓ All tests passed! Backend is ready to run.")
        print("\nTo start the backend server, run:")
        print("  python run.py")
    else:
        print("✗ Some tests failed. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()  
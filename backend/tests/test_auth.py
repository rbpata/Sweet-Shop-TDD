import pytest
from app import create_app, db
from app.models import User

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

def test_register_success(client):
    response = client.post("/api/auth/register", json={
        "username": "testuser5",
        "password": "testpass"
    })
    assert response.status_code == 201
    assert response.get_json()["msg"] == "User registered successfully"

def test_register_duplicate(client):
    # First registration
    client.post("/api/auth/register", json={
        "username": "testuser7", 
    })
    # Second registration with SAME username (this should fail)
    response = client.post("/api/auth/register", json={
        "username": "testuser7", 
        "password": "testpass"
    })
    assert response.status_code == 400
    assert response.get_json()["msg"] == "User already exists"

def test_login_success(client):
    client.post("/api/auth/register", json={
        "username": "testuser",
        "password": "testpass"
    })
    response = client.post("/api/auth/login", json={
        "username": "testuser",
        "password": "testpass"
    })
    assert response.status_code == 200
    assert "access_token" in response.get_json()
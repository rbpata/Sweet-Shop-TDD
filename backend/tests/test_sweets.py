import pytest
from flask_jwt_extended import create_access_token
from app import create_app, db
from app.models import Sweet

@pytest.fixture
def app_with_context():
    config = {
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False
    }
    app = create_app(config)
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app_with_context):
    return app_with_context.test_client()

@pytest.fixture
def auth_headers(app_with_context):
    with app_with_context.app_context():
        # Create token with string identity and additional claims
        token = create_access_token(
            identity="admin",  # Subject must be a string
            additional_claims={"is_admin": True}
        )
        return {"Authorization": f"Bearer {token}"}

def get_sample_sweet(name="Ladoo", price=10, quantity=5, category="Indian"):
    return {"name": name, "price": price, "quantity": quantity, "category": category}

def test_add_sweet(client, auth_headers):
    response = client.post("/api/sweets", json=get_sample_sweet(), headers=auth_headers)
    print(f"Response status: {response.status_code}")
    print(f"Response data: {response.get_json()}")
    assert response.status_code == 201
    assert response.get_json()["message"] == "Sweet added successfully"

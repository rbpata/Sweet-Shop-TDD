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
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
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
            additional_claims={"is_admin": True},
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


def test_get_all_sweets(client, auth_headers):
    # First add a sweet
    client.post("/api/sweets", json=get_sample_sweet("Barfi", 15), headers=auth_headers)

    # Then get all sweets
    response = client.get("/api/sweets", headers=auth_headers)
    print(f"Get response status: {response.status_code}")
    print(f"Get response data: {response.get_json()}")
    assert response.status_code == 200
    sweets = response.get_json()
    assert isinstance(sweets, list)
    assert any(s["name"] == "Barfi" for s in sweets)


def test_search_sweet(client, auth_headers):
    # Add a sweet first
    client.post(
        "/api/sweets", json=get_sample_sweet("Kaju Katli", 25), headers=auth_headers
    )

    # Search for it
    response = client.get("/api/sweets/search?search=Kaju", headers=auth_headers)
    print(f"Search response status: {response.status_code}")
    print(f"Search response data: {response.get_json()}")
    assert response.status_code == 200
    results = response.get_json()
    assert isinstance(results, list)
    assert any("Kaju" in s["name"] for s in results)


def test_update_sweet(client, auth_headers):
    # Add a sweet first
    add_response = client.post(
        "/api/sweets", json=get_sample_sweet("Jalebi", 20), headers=auth_headers
    )
    assert add_response.status_code == 201

    # Update the sweet (assuming it gets ID 1)
    update_response = client.put(
        "/api/sweets/1", json={"price": 22}, headers=auth_headers
    )
    print(f"Update response status: {update_response.status_code}")
    print(f"Update response data: {update_response.get_json()}")
    assert update_response.status_code == 200
    assert update_response.get_json()["sweet"]["price"] == 22

def test_delete_sweet(client, auth_headers):
    # Add a sweet first
    add_response = client.post("/api/sweets", json=get_sample_sweet("Peda", 10), headers=auth_headers)
    assert add_response.status_code == 201
    
    # Delete the sweet
    delete_response = client.delete("/api/sweets/1", headers=auth_headers)
    print(f"Delete response status: {delete_response.status_code}")
    print(f"Delete response data: {delete_response.get_json()}")
    assert delete_response.status_code == 200
    assert delete_response.get_json()["message"] == "Sweet deleted successfully"
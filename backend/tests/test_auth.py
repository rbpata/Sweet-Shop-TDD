import pytest

def test_register_success(client):
    response = client.post("/api/auth/register", json={
        "username": "testuser5",
        "password": "testpass"
    })
    assert response.status_code == 201
    assert response.get_json()["msg"] == "User registered successfully"

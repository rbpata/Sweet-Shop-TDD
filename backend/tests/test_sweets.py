import pytest

def test_add_sweet(client, auth_headers):
    response = client.post("/api/sweets", json=get_sample_sweet(), headers=auth_headers)
    print(f"Response status: {response.status_code}")
    print(f"Response data: {response.get_json()}")
    assert response.status_code == 201
    assert response.get_json()["message"] == "Sweet added successfully"

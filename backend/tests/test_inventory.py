import pytest

def test_purchase_sweet(client, admin_token):
    with client.application.app_context():
        sweet = Sweet.query.first()
        initial_quantity = sweet.quantity
        
        response = client.post(
            f"/api/sweets/{sweet.id}/purchase", 
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        print(f"Purchase response status: {response.status_code}")
        print(f"Purchase response data: {response.get_json()}")
        
        assert response.status_code == 200
        assert response.get_json()["msg"] == "Purchased successfully"
        
        # Check quantity was reduced
        updated_sweet = Sweet.query.get(sweet.id)
        assert updated_sweet.quantity == initial_quantity - 1
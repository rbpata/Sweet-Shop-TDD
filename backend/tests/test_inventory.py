import pytest
from app import create_app, db
from app.models import User, Sweet
from flask_jwt_extended import create_access_token

@pytest.fixture
def app_with_context():
    test_config = {
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'JWT_SECRET_KEY': 'test-secret-key',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False
    }

    app = create_app(test_config)
    with app.app_context():
        db.create_all()
        # Create test user and sweet
        user = User(username='admin', is_admin=True)
        user.set_password('admin')
        db.session.add(user)
        
        sweet = Sweet(name='Barfi', category='Indian', price=15.0, quantity=10)
        db.session.add(sweet)
        db.session.commit()
        
        yield app
        db.drop_all()

@pytest.fixture
def client(app_with_context):
    return app_with_context.test_client()

@pytest.fixture
def admin_token(app_with_context):
    with app_with_context.app_context():
        return create_access_token(
            identity="admin",
            additional_claims={"is_admin": True}
        )

@pytest.fixture
def user_token(app_with_context):
    with app_with_context.app_context():
        return create_access_token(
            identity="user",
            additional_claims={"is_admin": False}
        )

def test_debug_routes(app_with_context):
    """Debug test to see what routes are registered"""
    with app_with_context.app_context():
        print("\n=== ALL REGISTERED ROUTES ===")
        for rule in app_with_context.url_map.iter_rules():
            print(f"Route: {rule.rule} | Methods: {rule.methods} | Endpoint: {rule.endpoint}")
        print("=== END ROUTES ===\n")
        assert True


def test_purchase_sweet(client, admin_token):
    with client.application.app_context():
        sweet = Sweet.query.first()
        initial_quantity = sweet.quantity
        
        # Using /api/inventory to match blueprint registration
        response = client.post(
            f"/api/inventory/{sweet.id}/purchase", 
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        print(f"Purchase response status: {response.status_code}")
        print(f"Purchase response data: {response.get_json()}")
        
        assert response.status_code == 200
        assert response.get_json()["msg"] == "Purchased successfully"
        
        # Check quantity was reduced
        updated_sweet = Sweet.query.get(sweet.id)
        assert updated_sweet.quantity == initial_quantity - 1

def test_purchase_out_of_stock(client, admin_token):
    with client.application.app_context():
        # Create a sweet with 0 quantity
        out_of_stock_sweet = Sweet(name='OutOfStock', category='Test', price=10.0, quantity=0)
        db.session.add(out_of_stock_sweet)
        db.session.commit()
        
        # Using /api/inventory to match blueprint registration
        response = client.post(
            f"/api/inventory/{out_of_stock_sweet.id}/purchase", 
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 400
        assert response.get_json()["msg"] == "Out of stock"

def test_restock_sweet_admin(client, admin_token):
    with client.application.app_context():
        sweet = Sweet.query.first()
        initial_quantity = sweet.quantity
        
        # Using /api/inventory to match blueprint registration
        response = client.post(
            f"/api/inventory/{sweet.id}/restock", 
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        print(f"Restock response status: {response.status_code}")
        print(f"Restock response data: {response.get_json()}")
        
        assert response.status_code == 200
        assert response.get_json()["msg"] == "Restocked successfully"
        
        # Check quantity was increased
        updated_sweet = Sweet.query.get(sweet.id)
        assert updated_sweet.quantity == initial_quantity + 1
        
def test_restock_sweet_non_admin(client, user_token):
    with client.application.app_context():
        sweet = Sweet.query.first()
        
        # Using /api/inventory to match blueprint registration
        response = client.post(
            f"/api/inventory/{sweet.id}/restock", 
            headers={"Authorization": f"Bearer {user_token}"}
        )
        
        assert response.status_code == 403
        assert response.get_json()["msg"] == "Admin only"
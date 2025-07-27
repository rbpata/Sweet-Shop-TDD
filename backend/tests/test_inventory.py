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
        # Create token with string identity and additional claims
        return create_access_token(
            identity="admin",
            additional_claims={"is_admin": True}
        )

@pytest.fixture
def user_token(app_with_context):
    with app_with_context.app_context():
        # Create token for regular user
        return create_access_token(
            identity="user",
            additional_claims={"is_admin": False}
        )

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
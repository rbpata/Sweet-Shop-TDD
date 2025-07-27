from app import create_app, db
from app.models import User, Sweet

def init_db():
    app = create_app()
    
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Check if admin user already exists
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            # Create admin user
            admin = User(username='admin', is_admin=True)
            admin.set_password('admin123')
            db.session.add(admin)
            print("Created admin user: admin/admin123")
        
        # Check if regular user exists
        regular_user = User.query.filter_by(username='user').first()
        if not regular_user:
            # Create regular user
            user = User(username='user', is_admin=False)
            user.set_password('user123')
            db.session.add(user)
            print("Created regular user: user/user123")
        
        # Add sample sweets if none exist
        if Sweet.query.count() == 0:
            sample_sweets = [
                Sweet(name="Chocolate Truffle", category="Chocolate", price=2.50, quantity=50),
                Sweet(name="Vanilla Cupcake", category="Cake", price=3.00, quantity=30),
                Sweet(name="Strawberry Cheesecake", category="Cake", price=4.50, quantity=25),
                Sweet(name="Caramel Fudge", category="Fudge", price=3.75, quantity=40),
                Sweet(name="Mint Chocolate Chip", category="Ice Cream", price=2.25, quantity=35),
                Sweet(name="Red Velvet Cake", category="Cake", price=5.00, quantity=20),
                Sweet(name="Peanut Butter Cookie", category="Cookie", price=1.75, quantity=60),
                Sweet(name="Lemon Tart", category="Tart", price=3.25, quantity=15),
            ]
            
            for sweet in sample_sweets:
                db.session.add(sweet)
            
            print("Added sample sweets to the database")
        
        # Commit all changes
        db.session.commit()
        print("Database initialization completed successfully!")

if __name__ == '__main__':
    init_db() 
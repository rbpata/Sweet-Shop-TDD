from app.models import User
from app import db
from werkzeug.security import generate_password_hash

def create_user(username, password):
    if User.query.filter_by(username=username).first():
        return None, "User already exists"
    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return user, None

def authenticate_user(username, password):
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return user
    return None
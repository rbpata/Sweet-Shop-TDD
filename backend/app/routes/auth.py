from flask import Blueprint, request, jsonify
from app import db
from app.models import User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        
        # Validate input
        if not data or 'username' not in data or 'password' not in data:
            return jsonify(msg="Username and password required"), 400
        
        username = data['username'].strip()
        password = data['password']
        
        # Check if user already exists 
        if User.query.filter_by(username=username).first():
            return jsonify(msg="User already exists"), 400
        
        # Create new user
        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        return jsonify(msg="User registered successfully"), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify(msg="Registration failed"), 500

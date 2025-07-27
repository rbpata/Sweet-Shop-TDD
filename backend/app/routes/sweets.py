from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app import db
from app.models import Sweet

sweet_bp = Blueprint("sweet", __name__)

@sweet_bp.route("", methods=["POST"])
@jwt_required()
def add_sweet():
    data = request.get_json()

    required_fields = ["name", "category", "price", "quantity"]
    for field in required_fields:
        if field not in data:
            return jsonify(msg=f"Missing field: {field}"), 400

    try:
        sweet = Sweet(
            name=data["name"],
            category=data["category"],
            price=float(data["price"]),
            quantity=int(data["quantity"])
        )
        db.session.add(sweet)
        db.session.commit()
        return jsonify(message="Sweet added successfully"), 201
    except Exception as e:
        db.session.rollback()
        return jsonify(msg="Failed to add sweet"), 500

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
            quantity=int(data["quantity"]),
        )
        db.session.add(sweet)
        db.session.commit()
        return jsonify(message="Sweet added successfully"), 201
    except Exception as e:
        db.session.rollback()
        return jsonify(msg="Failed to add sweet"), 500


@sweet_bp.route("", methods=["GET"])
@jwt_required()
def get_sweets():
    sweets = Sweet.query.all()
    return jsonify(
        [
            {
                "id": s.id,
                "name": s.name,
                "category": s.category,
                "price": s.price,
                "quantity": s.quantity,
            }
            for s in sweets
        ]
    )


@sweet_bp.route("/search", methods=["GET"])
@jwt_required()
def search_sweets():
    name = request.args.get("search") or request.args.get("name")
    category = request.args.get("category")
    price_min = request.args.get("price_min")
    price_max = request.args.get("price_max")

    query = Sweet.query
    if name:
        query = query.filter(Sweet.name.ilike(f"%{name}%"))
    if category:
        query = query.filter(Sweet.category == category)
    if price_min:
        query = query.filter(Sweet.price >= float(price_min))
    if price_max:
        query = query.filter(Sweet.price <= float(price_max))

    results = query.all()
    return jsonify(
        [
            {
                "id": s.id,
                "name": s.name,
                "category": s.category,
                "price": s.price,
                "quantity": s.quantity,
            }
            for s in results
        ]
    )


@sweet_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_sweet(id):
    sweet = Sweet.query.get_or_404(id)
    data = request.get_json()

    try:
        for key, value in data.items():
            if key in ["price"]:
                value = float(value)
            elif key in ["quantity"]:
                value = int(value)
            setattr(sweet, key, value)

        db.session.commit()
        return jsonify(
            message="Sweet updated",
            sweet={
                "id": sweet.id,
                "name": sweet.name,
                "category": sweet.category,
                "price": sweet.price,
                "quantity": sweet.quantity,
            },
        )
    except Exception as e:
        db.session.rollback()
        return jsonify(msg="Failed to update sweet"), 500


@sweet_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_sweet(id):
    # Get the current user identity (string) and additional claims
    current_user = get_jwt_identity()  # This will be "admin"
    claims = get_jwt()  # This contains additional claims

    # Check if user is admin from additional claims
    is_admin = claims.get("is_admin", False)

    if not is_admin:
        return jsonify(msg="Admin only"), 403

    sweet = Sweet.query.get_or_404(id)
    db.session.delete(sweet)
    db.session.commit()
    return jsonify(message="Sweet deleted successfully"), 200

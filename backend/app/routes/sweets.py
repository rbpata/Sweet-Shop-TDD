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

@sweet_bp.route("", methods=["GET"])
@jwt_required()
def get_sweets():
    sweets = Sweet.query.all()
    return jsonify([{
        "id": s.id, "name": s.name, "category": s.category,
        "price": s.price, "quantity": s.quantity
    } for s in sweets])
    
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
    return jsonify([{
        "id": s.id, "name": s.name, "category": s.category,
        "price": s.price, "quantity": s.quantity
    } for s in results])


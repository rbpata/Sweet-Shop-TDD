from app.models import Sweet
from app import db

def create_sweet(data):
    sweet = Sweet(**data)
    db.session.add(sweet)
    db.session.commit()
    return sweet

def get_all_sweets():
    return Sweet.query.all()

def search_sweets(name=None, category=None, price_min=None, price_max=None):
    query = Sweet.query
    if name:
        query = query.filter(Sweet.name.ilike(f"%{name}%"))
    if category:
        query = query.filter(Sweet.category == category)
    if price_min:
        query = query.filter(Sweet.price >= float(price_min))
    if price_max:
        query = query.filter(Sweet.price <= float(price_max))
    return query.all()
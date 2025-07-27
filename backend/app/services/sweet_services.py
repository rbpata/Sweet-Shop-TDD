from app.models import Sweet
from app import db

def create_sweet(data):
    sweet = Sweet(**data)
    db.session.add(sweet)
    db.session.commit()
    return sweet
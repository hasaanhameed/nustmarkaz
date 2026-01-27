from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.interaction import UserInteraction
from models.user import User
from schemas.interaction import UserInteractionCreate, UserInteractionResponse
from database import get_db
from authorization.oauth2 import get_current_user

router = APIRouter(prefix="/interactions", tags=["interactions"])

@router.post("/click", response_model=UserInteractionResponse, status_code=status.HTTP_201_CREATED)
def record_click(
    interaction: UserInteractionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_interaction = UserInteraction(
        user_id=current_user.id,
        item_id=interaction.item_id,
        item_type=interaction.item_type
    )
    
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    
    return db_interaction

@router.get("/user/recent-items", response_model=List[dict])
def get_recent_clicked_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 10
):
    from models.product import Product
    from models.trip import Trip
    from models.donation import Donation
    from models.event import Event
    from models.ride import Ride
    from models.lost_found import LostFoundItem
    
    interactions = db.query(UserInteraction).filter(
        UserInteraction.user_id == current_user.id
    ).order_by(UserInteraction.created_at.desc()).all()
    
    result = []
    seen_items = set()
    
    for interaction in interactions:
        item_key = f"{interaction.item_type}_{interaction.item_id}"
        if item_key in seen_items:
            continue
        seen_items.add(item_key)
        
        item_data = None
        
        if interaction.item_type == "product":
            item = db.query(Product).filter(Product.id == interaction.item_id).first()
            if item:
                item_data = {
                    "id": item.id,
                    "type": "product",
                    "title": item.title,
                    "price": item.price,
                    "category": item.category,
                    "image": item.images[0].image_path if item.images else None,
                    "creator": {"username": item.creator.username}
                }
        
        elif interaction.item_type == "trip":
            item = db.query(Trip).filter(Trip.id == interaction.item_id).first()
            if item:
                item_data = {
                    "id": item.id,
                    "type": "trip",
                    "title": item.title,
                    "destination": item.destination,
                    "cost_per_person": item.cost_per_person,
                    "image": item.images[0].image_path if item.images else None,
                    "creator": {"username": item.creator.username}
                }
        
        elif interaction.item_type == "donation":
            item = db.query(Donation).filter(Donation.id == interaction.item_id).first()
            if item:
                item_data = {
                    "id": item.id,
                    "type": "donation",
                    "title": item.title,
                    "beneficiary": item.beneficiary,
                    "goal_amount": item.goal_amount,
                    "creator": {"username": item.creator.username}
                }
        
        elif interaction.item_type == "event":
            item = db.query(Event).filter(Event.id == interaction.item_id).first()
            if item:
                item_data = {
                    "id": item.id,
                    "type": "event",
                    "title": item.title,
                    "society": item.society,
                    "location": item.location,
                    "image": item.images[0].image_path if item.images else None,
                    "creator": {"username": item.creator.username}
                }
        
        elif interaction.item_type == "ride":
            item = db.query(Ride).filter(Ride.id == interaction.item_id).first()
            if item:
                item_data = {
                    "id": item.id,
                    "type": "ride",
                    "from_location": item.from_location,
                    "to_location": item.to_location,
                    "price": item.price,
                    "creator": {"username": item.creator.username}
                }
        
        elif interaction.item_type == "lost_found":
            item = db.query(LostFoundItem).filter(LostFoundItem.id == interaction.item_id).first()
            if item:
                item_data = {
                    "id": item.id,
                    "type": "lost_found",
                    "title": item.title,
                    "type_": item.type,
                    "location": item.location,
                    "image": item.image_path,
                    "creator": {"username": item.creator.username}
                }
        
        if item_data:
            result.append(item_data)
    
    return result[:limit]
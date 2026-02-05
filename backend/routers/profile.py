from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.user import User
from models.product import Product
from models.trip import Trip
from models.donation import Donation
from models.event import Event
from models.lost_found import LostFoundItem
from models.ride import Ride
from schemas.profile import UserProfileResponse, ProfileStats
from authorization.oauth2 import get_current_user

router = APIRouter(prefix="/users/me/profile", tags=["profile"])

@router.get("/", response_model=UserProfileResponse)
def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get counts
    product_count = db.query(Product).filter(Product.creator_id == current_user.id).count()
    trip_count = db.query(Trip).filter(Trip.creator_id == current_user.id).count()
    ride_count = db.query(Ride).filter(Ride.driver_id == current_user.id).count()
    donation_count = db.query(Donation).filter(Donation.creator_id == current_user.id).count()
    event_count = db.query(Event).filter(Event.creator_id == current_user.id).count()
    lost_found_count = db.query(LostFoundItem).filter(LostFoundItem.creator_id == current_user.id).count()

    # Get recent items (last 5)
    recent_products = db.query(Product).filter(Product.creator_id == current_user.id).order_by(Product.created_at.desc()).limit(5).all()
    recent_trips = db.query(Trip).filter(Trip.creator_id == current_user.id).order_by(Trip.created_at.desc()).limit(5).all()
    recent_rides = db.query(Ride).filter(Ride.driver_id == current_user.id).order_by(Ride.created_at.desc()).limit(5).all()
    recent_donations = db.query(Donation).filter(Donation.creator_id == current_user.id).order_by(Donation.created_at.desc()).limit(5).all()
    recent_events = db.query(Event).filter(Event.creator_id == current_user.id).order_by(Event.created_at.desc()).limit(5).all()
    recent_lost_found = db.query(LostFoundItem).filter(LostFoundItem.creator_id == current_user.id).order_by(LostFoundItem.created_at.desc()).limit(5).all()

    return {
        "user": current_user,
        "stats": {
            "product_count": product_count,
            "trip_count": trip_count,
            "ride_count": ride_count,
            "donation_count": donation_count,
            "event_count": event_count,
            "lost_found_count": lost_found_count,
        },
        "recent_products": recent_products,
        "recent_trips": recent_trips,
        "recent_rides": recent_rides,
        "recent_donations": recent_donations,
        "recent_events": recent_events,
        "recent_lost_found": recent_lost_found,
    }

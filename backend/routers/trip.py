from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.trip import Trip, TripImage
from models.user import User
from schemas.trip import TripCreate, TripResponse
from database import get_db
from authorization.oauth2 import get_current_user

router = APIRouter(prefix="/trips", tags=["trips"])

# Create a Trip
@router.post("/", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def create_trip(
    trip: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Create the trip
    db_trip = Trip(
        title=trip.title,
        description=trip.description,
        destination=trip.destination,
        start_date=trip.start_date,
        end_date=trip.end_date,
        departure_location=trip.departure_location,
        max_participants=trip.max_participants,
        cost_per_person=trip.cost_per_person,
        contact_number=trip.contact_number,
        creator_id=current_user.id
    )
    
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    
    # Add images if provided
    if trip.image_paths:
        for image_path in trip.image_paths:
            db_image = TripImage(
                image_path=image_path,
                trip_id=db_trip.id
            )
            db.add(db_image)
        
        db.commit()
        db.refresh(db_trip)
    
    return db_trip

# Get all trips
@router.get("/", response_model=List[TripResponse])
def get_all_trips(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10
):
    trips = db.query(Trip).offset(skip).limit(limit).all()
    return trips

# Get a single trip by ID
@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip
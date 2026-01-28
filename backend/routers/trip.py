from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.trip import Trip, TripImage
from models.user import User
from schemas.trip import TripCreate, TripResponse, TripUpdate
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
    limit: int = 100
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

# Update a trip
# Update a trip
@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: int,
    trip: TripUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if not db_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Check if current user is the creator
    if db_trip.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this trip")
    
    # Update trip fields only if provided
    if trip.title is not None:
        db_trip.title = trip.title
    if trip.description is not None:
        db_trip.description = trip.description
    if trip.destination is not None:
        db_trip.destination = trip.destination
    if trip.start_date is not None:
        db_trip.start_date = trip.start_date
    if trip.end_date is not None:
        db_trip.end_date = trip.end_date
    if trip.departure_location is not None:
        db_trip.departure_location = trip.departure_location
    if trip.max_participants is not None:
        db_trip.max_participants = trip.max_participants
    if trip.cost_per_person is not None:
        db_trip.cost_per_person = trip.cost_per_person
    if trip.contact_number is not None:
        db_trip.contact_number = trip.contact_number
    
    # Update images - delete old ones and add new ones
    if trip.image_paths is not None:
        # Delete existing images
        db.query(TripImage).filter(TripImage.trip_id == trip_id).delete()
        
        # Add new images
        for image_path in trip.image_paths:
            db_image = TripImage(
                image_path=image_path,
                trip_id=db_trip.id
            )
            db.add(db_image)
    
    db.commit()
    db.refresh(db_trip)
    return db_trip
# Delete a trip
@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_trip = db.query(Trip).filter(Trip.id == trip_id).first()
    
    if not db_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Check if current user is the creator
    if db_trip.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this trip")
    
    # Delete associated images first
    db.query(TripImage).filter(TripImage.trip_id == trip_id).delete()
    
    # Delete the trip
    db.delete(db_trip)
    db.commit()
    
    return None
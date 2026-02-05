from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.ride import Ride
from models.user import User
from schemas.ride import RideCreate, RideResponse, RideUpdate
from database import get_db
from authorization.oauth2 import get_current_user

router = APIRouter(prefix="/rides", tags=["rides"])


# Create a Ride
@router.post("/", response_model=RideResponse, status_code=status.HTTP_201_CREATED)
def create_ride(
    ride: RideCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_ride = Ride(
        from_location=ride.from_location,
        to_location=ride.to_location,
        ride_date=ride.ride_date,
        ride_time=ride.ride_time,
        vehicle_type=ride.vehicle_type,
        vehicle_model=ride.vehicle_model,
        vehicle_color=ride.vehicle_color,
        price=ride.price,
        contact=ride.contact,
        driver_id=current_user.id
    )
    
    db.add(db_ride)
    db.commit()
    db.refresh(db_ride)
    
    return db_ride


# Get all rides
@router.get("/", response_model=List[RideResponse])
def get_all_rides(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    rides = db.query(Ride).offset(skip).limit(limit).all()
    return rides

# Get current user's rides
@router.get("/me", response_model=List[RideResponse])
def get_my_rides(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    rides = db.query(Ride).filter(Ride.driver_id == current_user.id).offset(skip).limit(limit).all()
    return rides


# Get a single ride by ID
@router.get("/{ride_id}", response_model=RideResponse)
def get_ride(ride_id: int, db: Session = Depends(get_db)):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    return ride


# Update a ride
# Update a ride
@router.put("/{ride_id}", response_model=RideResponse)
def update_ride(
    ride_id: int,
    ride: RideUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_ride = db.query(Ride).filter(Ride.id == ride_id).first()
    
    if not db_ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    # Check if current user is the driver
    if db_ride.driver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this ride")
    
    # Update ride fields only if provided
    if ride.from_location is not None:
        db_ride.from_location = ride.from_location
    if ride.to_location is not None:
        db_ride.to_location = ride.to_location
    if ride.ride_date is not None:
        db_ride.ride_date = ride.ride_date
    if ride.ride_time is not None:
        db_ride.ride_time = ride.ride_time
    if ride.vehicle_type is not None:
        db_ride.vehicle_type = ride.vehicle_type
    if ride.vehicle_model is not None:
        db_ride.vehicle_model = ride.vehicle_model
    if ride.vehicle_color is not None:
        db_ride.vehicle_color = ride.vehicle_color
    if ride.price is not None:
        db_ride.price = ride.price
    if ride.contact is not None:
        db_ride.contact = ride.contact
    
    db.commit()
    db.refresh(db_ride)
    return db_ride

# Delete a ride
@router.delete("/{ride_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ride(
    ride_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_ride = db.query(Ride).filter(Ride.id == ride_id).first()
    
    if not db_ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    # Check if current user is the driver
    if db_ride.driver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this ride")
    
    # Delete the ride
    db.delete(db_ride)
    db.commit()
    
    return None
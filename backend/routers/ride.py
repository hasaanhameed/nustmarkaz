from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.ride import Ride
from models.user import User
from schemas.ride import RideCreate, RideResponse
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
    limit: int = 10
):
    rides = db.query(Ride).offset(skip).limit(limit).all()
    return rides


# Get a single ride by ID
@router.get("/{ride_id}", response_model=RideResponse)
def get_ride(ride_id: int, db: Session = Depends(get_db)):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    return ride
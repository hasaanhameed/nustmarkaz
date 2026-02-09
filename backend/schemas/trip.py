from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime
from schemas.user import CreatorResponse


# Schema for trip image response
class TripImageResponse(BaseModel):
    id: int
    image_path: str
    trip_id: int

    class Config:
        from_attributes = True


# Schema to create a new trip
class TripCreate(BaseModel):
    title: str
    description: str
    destination: str
    start_date: date
    end_date: date
    departure_location: str
    max_participants: Optional[int] = None
    cost_per_person: float
    contact_number: str
    image_paths: Optional[List[str]] = []

    class Config:
        from_attributes = True


# Schema to update a trip (all fields optional)
# Schema to update a trip (all fields optional)
class TripUpdate(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    departure_location: Optional[str] = None
    cost_per_person: Optional[float] = None
    max_participants: Optional[int] = None
    contact_number: Optional[str] = None
    image_paths: Optional[List[str]] = None

    class Config:
        from_attributes = True


# Schema for trip response
class TripResponse(BaseModel):
    id: int
    title: str
    description: str
    destination: str
    start_date: date
    end_date: date
    departure_location: str
    max_participants: Optional[int] = None
    cost_per_person: float
    contact_number: str
    created_at: datetime
    updated_at: datetime
    creator_id: int
    images: List[TripImageResponse] = []
    creator: CreatorResponse  

    class Config:
        from_attributes = True
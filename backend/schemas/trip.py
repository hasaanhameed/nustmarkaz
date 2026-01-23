from pydantic import BaseModel
from typing import List, Optional
from datetime import date
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
    max_participants: int
    cost_per_person: float
    image_paths: Optional[List[str]] = []

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
    max_participants: int
    cost_per_person: float
    creator_id: int
    images: List[TripImageResponse] = []
    creator: CreatorResponse  

    class Config:
        from_attributes = True
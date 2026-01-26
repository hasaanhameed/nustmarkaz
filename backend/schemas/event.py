from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from schemas.user import CreatorResponse


# Schema for event image response
class EventImageResponse(BaseModel):
    id: int
    image_path: str
    event_id: int

    class Config:
        from_attributes = True


# Schema to create a new event
class EventCreate(BaseModel):
    title: str
    description: str
    society: str
    location: str
    event_date: datetime
    contact_number: str  # Add this line
    image_paths: Optional[List[str]] = []

    class Config:
        from_attributes = True


# Schema for event response
class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    society: str
    location: str
    event_date: datetime
    contact_number: str  
    creator_id: int
    creator: CreatorResponse
    images: List[EventImageResponse] = []

    class Config:
        from_attributes = True
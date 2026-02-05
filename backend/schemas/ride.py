from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RideCreate(BaseModel):
    from_location: str
    to_location: str
    ride_date: str
    ride_time: str
    contact: str

    class Config:
        from_attributes = True


class RideUpdate(BaseModel):
    from_location: Optional[str] = None
    to_location: Optional[str] = None
    ride_date: Optional[str] = None
    ride_time: Optional[str] = None
    contact: Optional[str] = None


class RequesterResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True


class RideResponse(RideCreate):
    id: int
    requester_id: int
    created_at: datetime
    updated_at: datetime
    requester: Optional[RequesterResponse] = None

    class Config:
        from_attributes = True
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RideCreate(BaseModel):
    from_location: str
    to_location: str
    ride_date: str
    ride_time: str
    vehicle_type: str
    vehicle_model: str
    vehicle_color: str
    price: float
    contact: str

    class Config:
        from_attributes = True


class RideUpdate(BaseModel):
    from_location: Optional[str] = None
    to_location: Optional[str] = None
    ride_date: Optional[str] = None
    ride_time: Optional[str] = None
    vehicle_type: Optional[str] = None
    vehicle_model: Optional[str] = None
    vehicle_color: Optional[str] = None
    price: Optional[float] = None
    contact: Optional[str] = None


class RideResponse(RideCreate):
    id: int
    driver_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True



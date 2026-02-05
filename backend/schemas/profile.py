from pydantic import BaseModel
from typing import List, Optional
from schemas.user import UserResponse
from schemas.product import ProductResponse
from schemas.trip import TripResponse
from schemas.donation import DonationResponse
from schemas.event import EventResponse
from schemas.lost_found import LostFoundItemResponse
from schemas.ride import RideResponse

class ProfileStats(BaseModel):
    product_count: int
    trip_count: int
    ride_count: int
    donation_count: int
    event_count: int
    lost_found_count: int

class UserProfileResponse(BaseModel):
    user: UserResponse
    stats: ProfileStats
    recent_products: List[ProductResponse]
    recent_trips: List[TripResponse]
    recent_rides: List[RideResponse]
    recent_donations: List[DonationResponse]
    recent_events: List[EventResponse]
    recent_lost_found: List[LostFoundItemResponse]

    class Config:
        from_attributes = True

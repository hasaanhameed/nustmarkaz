from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class Creator(BaseModel):
    id: int
    username: str
    email: str
    department: str

    class Config:
        from_attributes = True

class DonationImageResponse(BaseModel):
    id: int
    image_path: str
    donation_id: int

    class Config:
        from_attributes = True

class DonationCreate(BaseModel):
    title: str
    description: str
    beneficiary: str
    goal_amount: float
    end_date: date
    contact_number: Optional[str] = None
    image_paths: Optional[list[str]] = None

class DonationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    goal_amount: Optional[float] = None
    current_amount: Optional[float] = None
    end_date: Optional[str] = None
    contact_number: Optional[str] = None
    image_paths: Optional[list[str]] = None

    class Config:
        from_attributes = True

class DonationResponse(BaseModel):
    id: int
    title: str
    description: str
    beneficiary: str
    goal_amount: float
    end_date: date
    contact_number: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    creator_id: int
    creator: Creator
    images: list[DonationImageResponse] = []

    class Config:
        from_attributes = True
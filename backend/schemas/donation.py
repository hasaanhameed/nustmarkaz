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

class DonationCreate(BaseModel):
    title: str
    description: str
    beneficiary: str
    goal_amount: float
    end_date: date
    contact_number: str  # Add this line

class DonationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    beneficiary: Optional[str] = None
    goal_amount: Optional[float] = None
    end_date: Optional[date] = None
    contact_number: Optional[str] = None  # Add this line

class DonationResponse(BaseModel):
    id: int
    title: str
    description: str
    beneficiary: str
    goal_amount: float
    end_date: date
    contact_number: str  # Add this line
    created_at: datetime
    updated_at: datetime
    creator_id: int
    creator: Creator

    class Config:
        from_attributes = True
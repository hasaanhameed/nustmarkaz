from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from schemas.user import CreatorResponse


class LostFoundItemCreate(BaseModel):
    title: str
    category: str
    location: str
    date: date
    description: str
    image_path: str
    contact_method: str
    contact_info: str
    type: str

    class Config:
        from_attributes = True


class LostFoundItemResponse(BaseModel):
    id: int
    title: str
    category: str
    location: str
    date: date
    description: str
    image_path: str
    contact_method: str
    contact_info: str
    type: str
    status: str
    created_at: datetime
    updated_at: datetime
    creator_id: int
    creator: CreatorResponse

    class Config:
        from_attributes = True
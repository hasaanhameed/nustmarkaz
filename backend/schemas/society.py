from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# Schema for creator info in reviews
class ReviewCreatorResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True


# Schema to create a new society
class SocietyCreate(BaseModel):
    name: str
    instagram_url: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


# Schema to update a society (all fields optional)
class SocietyUpdate(BaseModel):
    name: Optional[str] = None
    instagram_url: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


# Schema for society review response
class SocietyReviewResponse(BaseModel):
    id: int
    rating: float
    comment: str
    user_id: int
    society_id: int
    creator: ReviewCreatorResponse

    class Config:
        from_attributes = True


# Schema for society response
class SocietyResponse(BaseModel):
    id: int
    name: str
    instagram_url: Optional[str] = None
    image_url: Optional[str] = None
    reviews: List[SocietyReviewResponse] = []

    class Config:
        from_attributes = True


# Schema to create a new society review
class SocietyReviewCreate(BaseModel):
    rating: float
    comment: str
    society_id: int

    class Config:
        from_attributes = True


# Schema to update a society review
class SocietyReviewUpdate(BaseModel):
    rating: Optional[float] = None
    comment: Optional[str] = None

    class Config:
        from_attributes = True
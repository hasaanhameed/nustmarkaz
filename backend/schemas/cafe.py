from pydantic import BaseModel, Field
from typing import Optional, List

class ReviewBase(BaseModel):
    rating: float = Field(..., ge=0, le=5, description="Rating between 0 and 5")
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewRead(ReviewBase):
    id: int
    user_id: int
    cafe_id: int

    class Config:
        from_attributes = True  # For Pydantic v2+

class CafeBase(BaseModel):
    name: str
    location: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None  # Added for storing cafe images

class CafeCreate(CafeBase):
    pass

class CafeRead(CafeBase):
    id: int

    class Config:
        from_attributes = True  # For Pydantic v2+

class CafeWithReviews(CafeRead):
    reviews: List[ReviewRead] = []

    class Config:
        from_attributes = True  
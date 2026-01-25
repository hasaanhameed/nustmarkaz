from pydantic import BaseModel
from typing import List, Optional
from schemas.user import CreatorResponse


# Schema for product image response
class ProductImageResponse(BaseModel):
    id: int
    image_path: str
    product_id: int

    class Config:
        from_attributes = True


# Schema to create a new product
class ProductCreate(BaseModel):
    title: str
    description: str
    price: float
    category: str
    pickup_location: str
    condition: str
    image_paths: Optional[List[str]] = []

    class Config:
        from_attributes = True


# Schema for product response 
class ProductResponse(BaseModel):
    id: int
    title: str
    description: str
    price: float
    category: str
    pickup_location: str
    condition: str
    user_id: int
    images: List[ProductImageResponse] = []
    creator: CreatorResponse  # Changed from 'user' to 'creator'

    class Config:
        from_attributes = True
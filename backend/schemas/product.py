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
    contact_number: str  # Add this line
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
    contact_number: str  # Add this line
    creator_id: int
    images: List[ProductImageResponse] = []
    creator: CreatorResponse

    class Config:
        from_attributes = True
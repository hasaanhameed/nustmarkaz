from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
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
    contact_number: str
    image_paths: Optional[List[str]] = []

    class Config:
        from_attributes = True


# Schema to update a product (all fields optional)
class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    pickup_location: Optional[str] = None
    condition: Optional[str] = None
    contact_number: Optional[str] = None
    image_paths: Optional[List[str]] = None

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
    contact_number: str
    created_at: datetime
    updated_at: datetime
    creator_id: int
    images: List[ProductImageResponse] = []
    creator: CreatorResponse

    class Config:
        from_attributes = True
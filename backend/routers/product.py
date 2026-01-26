from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.product import Product, ProductImage
from models.user import User
from schemas.product import ProductCreate, ProductResponse
from database import get_db
from authorization.oauth2 import get_current_user

router = APIRouter(prefix="/products", tags=["products"])

# Create a Product
@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Create the product
    db_product = Product(
        title=product.title,
        description=product.description,
        price=product.price,
        category=product.category,
        pickup_location=product.pickup_location,
        condition=product.condition,
        contact_number=product.contact_number,
        creator_id=current_user.id
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Add images if provided
    if product.image_paths:
        for image_path in product.image_paths:
            db_image = ProductImage(
                image_path=image_path,
                product_id=db_product.id
            )
            db.add(db_image)
        
        db.commit()
        db.refresh(db_product)
    
    return db_product

# Get all products
@router.get("/", response_model=List[ProductResponse])
def get_all_products(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10
):
    products = db.query(Product).offset(skip).limit(limit).all()
    return products

# Get a single product by ID
@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
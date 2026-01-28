from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.product import Product, ProductImage
from models.user import User
from schemas.product import ProductCreate, ProductResponse, ProductUpdate
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
    limit: int = 100
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

# Update a product
# Update a product
@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if current user is the creator
    if db_product.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this product")
    
    # Update only provided fields
    if product.title is not None:
        db_product.title = product.title
    if product.description is not None:
        db_product.description = product.description
    if product.price is not None:
        db_product.price = product.price
    if product.category is not None:
        db_product.category = product.category
    if product.pickup_location is not None:
        db_product.pickup_location = product.pickup_location
    if product.condition is not None:
        db_product.condition = product.condition
    if product.contact_number is not None:
        db_product.contact_number = product.contact_number
    
    # Update images - delete old ones and add new ones
    if product.image_paths is not None:
        # Delete existing images
        db.query(ProductImage).filter(ProductImage.product_id == product_id).delete()
        
        # Add new images
        for image_path in product.image_paths:
            db_image = ProductImage(
                image_path=image_path,
                product_id=db_product.id
            )
            db.add(db_image)
    
    db.commit()
    db.refresh(db_product)
    return db_product

# Delete a product
@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if current user is the creator
    if db_product.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this product")
    
    # Delete associated images first
    db.query(ProductImage).filter(ProductImage.product_id == product_id).delete()
    
    # Delete the product
    db.delete(db_product)
    db.commit()
    
    return None
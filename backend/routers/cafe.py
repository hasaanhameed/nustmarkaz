from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from models.cafe import Cafe, Review
from schemas.cafe import CafeCreate, CafeRead, CafeWithReviews, ReviewCreate, ReviewRead
from database import get_db
from authorization.oauth2 import get_current_user  

router = APIRouter(prefix="/cafes", tags=["cafes"])

@router.get("/", response_model=List[CafeRead])
def list_cafes(db: Session = Depends(get_db)):
    """List all cafes"""
    return db.query(Cafe).all()

@router.get("/{cafe_id}", response_model=CafeWithReviews)
def get_cafe(cafe_id: int, db: Session = Depends(get_db)):
    """Get a specific cafe with all its reviews"""
    cafe = db.query(Cafe).filter(Cafe.id == cafe_id).first()
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    return cafe

@router.post("/", response_model=CafeRead, status_code=status.HTTP_201_CREATED)
def create_cafe(cafe: CafeCreate, db: Session = Depends(get_db)):
    """Create a new cafe"""
    db_cafe = Cafe(**cafe.dict())
    db.add(db_cafe)
    db.commit()
    db.refresh(db_cafe)
    return db_cafe

@router.post("/{cafe_id}/reviews", response_model=ReviewRead, status_code=status.HTTP_201_CREATED)
def create_review(
    cafe_id: int,
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Create a review for a cafe"""
    cafe = db.query(Cafe).filter(Cafe.id == cafe_id).first()
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    
    db_review = Review(**review.dict(), user_id=current_user.id, cafe_id=cafe_id)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Delete a review (only by the user who created it)"""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")
    
    db.delete(review)
    db.commit()
    return

@router.get("/{cafe_id}/average-rating")
def get_average_rating(cafe_id: int, db: Session = Depends(get_db)):
    """Get the average rating for a cafe"""
    cafe = db.query(Cafe).filter(Cafe.id == cafe_id).first()
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    
    avg_rating = db.query(func.avg(Review.rating)).filter(Review.cafe_id == cafe_id).scalar()
    review_count = db.query(func.count(Review.id)).filter(Review.cafe_id == cafe_id).scalar()
    
    return {
        "cafe_id": cafe_id,
        "average_rating": round(avg_rating, 2) if avg_rating else 0,
        "review_count": review_count
    }
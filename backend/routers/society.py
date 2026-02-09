from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import func
from models.society import Society, SocietyReview
from models.user import User
from schemas.society import (
    SocietyCreate, 
    SocietyResponse, 
    SocietyUpdate, 
    SocietyReviewCreate, 
    SocietyReviewResponse
)
from database import get_db
from authorization.oauth2 import get_current_user

router = APIRouter(prefix="/societies", tags=["societies"])

# --- Society Endpoints ---

@router.post("/", response_model=SocietyResponse, status_code=status.HTTP_201_CREATED)
def create_society(society: SocietyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_society = Society(
        name=society.name,
        instagram_url=society.instagram_url,
        image_url=society.image_url
    )
    db.add(db_society)
    db.commit()
    db.refresh(db_society)
    return db_society

@router.get("/", response_model=List[SocietyResponse])
def get_societies(db: Session = Depends(get_db)):
    return db.query(Society).all()

# OPTIMIZED: Get societies with ratings using only 2 queries
@router.get("/with-reviews", response_model=List[dict])
def get_societies_with_reviews(db: Session = Depends(get_db)):
    """Get all societies with reviews and average ratings - OPTIMIZED VERSION"""
    
    # Query 1: Get all societies
    societies = db.query(Society).all()
    
    # Query 2: Get all ratings aggregated by society_id in a single query
    ratings_query = (
        db.query(
            SocietyReview.society_id,
            func.avg(SocietyReview.rating).label('avg_rating'),
            func.count(SocietyReview.id).label('review_count')
        )
        .group_by(SocietyReview.society_id)
        .all()
    )
    
    # Create a lookup dictionary for O(1) access
    ratings_dict = {
        rating.society_id: {
            'average_rating': round(float(rating.avg_rating), 2),
            'review_count': rating.review_count
        }
        for rating in ratings_query
    }
    
    # Build the result with ratings
    result = []
    for society in societies:
        ratings_data = ratings_dict.get(society.id, {'average_rating': 0.0, 'review_count': 0})
        
        result.append({
            "id": society.id,
            "name": society.name,
            "instagram_url": society.instagram_url,
            "image_url": society.image_url,
            "average_rating": ratings_data['average_rating'],
            "review_count": ratings_data['review_count']
        })
    
    return result


# ALTERNATIVE: Even more optimized with a single query using LEFT JOIN
@router.get("/with-reviews-single-query", response_model=List[dict])
def get_societies_with_reviews_single_query(db: Session = Depends(get_db)):
    """Get all societies with ratings using a single optimized query"""
    
    # Single query with LEFT JOIN and aggregation
    query = (
        db.query(
            Society.id,
            Society.name,
            Society.instagram_url,
            Society.image_url,
            func.coalesce(func.avg(SocietyReview.rating), 0).label('avg_rating'),
            func.count(SocietyReview.id).label('review_count')
        )
        .outerjoin(SocietyReview, Society.id == SocietyReview.society_id)
        .group_by(Society.id, Society.name, Society.instagram_url, Society.image_url)
        .all()
    )
    
    result = [
        {
            "id": row.id,
            "name": row.name,
            "instagram_url": row.instagram_url,
            "image_url": row.image_url,
            "average_rating": round(float(row.avg_rating), 2),
            "review_count": row.review_count
        }
        for row in query
    ]
    
    return result


# Generic routes AFTER specific routes
@router.get("/{id}", response_model=SocietyResponse)
def get_society(id: int, db: Session = Depends(get_db)):
    society = db.query(Society).filter(Society.id == id).first()
    if not society:
        raise HTTPException(status_code=404, detail="Society not found")
    return society

@router.put("/{id}", response_model=SocietyResponse)
def update_society(id: int, society_update: SocietyUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_society = db.query(Society).filter(Society.id == id).first()
    if not db_society:
        raise HTTPException(status_code=404, detail="Society not found")
    
    if society_update.name is not None:
        db_society.name = society_update.name
    if society_update.instagram_url is not None:
        db_society.instagram_url = society_update.instagram_url
    if society_update.image_url is not None:
        db_society.image_url = society_update.image_url
        
    db.commit()
    db.refresh(db_society)
    return db_society

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_society(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_society = db.query(Society).filter(Society.id == id).first()
    if not db_society:
        raise HTTPException(status_code=404, detail="Society not found")
    
    db.delete(db_society)
    db.commit()
    return None

# --- Review Endpoints ---

@router.post("/reviews", response_model=SocietyReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    review: SocietyReviewCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Check if society exists
    society = db.query(Society).filter(Society.id == review.society_id).first()
    if not society:
        raise HTTPException(status_code=404, detail="Society not found")

    db_review = SocietyReview(
        rating=review.rating,
        comment=review.comment,
        user_id=current_user.id,
        society_id=review.society_id
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.get("/reviews/{society_id}", response_model=List[SocietyReviewResponse])
def get_society_reviews(society_id: int, db: Session = Depends(get_db)):
    return db.query(SocietyReview).filter(SocietyReview.society_id == society_id).all()

@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_society_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a review (only by the user who created it)"""
    review = db.query(SocietyReview).filter(SocietyReview.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")
    
    db.delete(review)
    db.commit()
    return
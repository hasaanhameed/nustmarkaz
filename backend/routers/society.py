from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
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
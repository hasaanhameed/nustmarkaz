from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models.donation import Donation
from models.user import User
from schemas.donation import (
    DonationCreate,
    DonationResponse,
    DonationUpdate,
)
from authorization.oauth2 import get_current_user

router = APIRouter(prefix="/donations", tags=["donations"])

# Get all donations
@router.get("/", response_model=list[DonationResponse])
def get_all_donations(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    donations = db.query(Donation).offset(skip).limit(limit).all()
    return donations

# Get a specific donation by ID
@router.get("/{donation_id}", response_model=DonationResponse)
def get_donation(donation_id: int, db: Session = Depends(get_db)):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation drive not found"
        )
    return donation

# Create a new donation drive (requires authentication)
@router.post("/", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
def create_donation(
    donation_data: DonationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    donation = Donation(
        title=donation_data.title,
        description=donation_data.description,
        beneficiary=donation_data.beneficiary,
        goal_amount=donation_data.goal_amount,
        end_date=donation_data.end_date,
        creator_id=current_user.id
    )
    db.add(donation)
    db.commit()
    db.refresh(donation)
    return donation

# Update a donation drive (only creator can update)
@router.put("/{donation_id}", response_model=DonationResponse)
def update_donation(
    donation_id: int,
    donation_data: DonationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation drive not found"
        )
    
    if donation.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own donation drives"
        )
    
    update_data = donation_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(donation, field, value)
    donation.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(donation)
    return donation

# Delete a donation drive (only creator can delete)
@router.delete("/{donation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_donation(
    donation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation drive not found"
        )
    
    if donation.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own donation drives"
        )
    
    db.delete(donation)
    db.commit()
    return None
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.donation import Donation
from models.user import User
from schemas.donation import DonationCreate, DonationUpdate, DonationResponse
from database import get_db
from authorization.oauth2 import get_current_user

router = APIRouter(prefix="/donations", tags=["donations"])

# Create a Donation
@router.post("/", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
def create_donation(
    donation: DonationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_donation = Donation(
        title=donation.title,
        description=donation.description,
        beneficiary=donation.beneficiary,
        goal_amount=donation.goal_amount,
        end_date=donation.end_date,
        contact_number=donation.contact_number,
        creator_id=current_user.id
    )
    
    db.add(db_donation)
    db.commit()
    db.refresh(db_donation)
    
    return db_donation

# Get all donations
@router.get("/", response_model=List[DonationResponse])
def get_all_donations(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10
):
    donations = db.query(Donation).offset(skip).limit(limit).all()
    return donations

# Get a single donation by ID
@router.get("/{donation_id}", response_model=DonationResponse)
def get_donation(donation_id: int, db: Session = Depends(get_db)):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    return donation

# Update a donation
@router.put("/{donation_id}", response_model=DonationResponse)
def update_donation(
    donation_id: int,
    donation_update: DonationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    
    if donation.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this donation")
    
    # Update fields if provided
    if donation_update.title is not None:
        donation.title = donation_update.title
    if donation_update.description is not None:
        donation.description = donation_update.description
    if donation_update.beneficiary is not None:
        donation.beneficiary = donation_update.beneficiary
    if donation_update.goal_amount is not None:
        donation.goal_amount = donation_update.goal_amount
    if donation_update.end_date is not None:
        donation.end_date = donation_update.end_date
    if donation_update.contact_number is not None:
        donation.contact_number = donation_update.contact_number
    
    db.commit()
    db.refresh(donation)
    
    return donation

# Delete a donation
@router.delete("/{donation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    
    if donation.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this donation")
    
    db.delete(donation)
    db.commit()
    
    return None
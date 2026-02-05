from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.lost_found import LostFoundItem, ItemStatus
from models.user import User
from schemas.lost_found import LostFoundItemCreate, LostFoundItemResponse
from database import get_db
from authorization.oauth2 import get_current_user

router = APIRouter(prefix="/lost-found", tags=["lost-found"])


@router.post("/", response_model=LostFoundItemResponse, status_code=status.HTTP_201_CREATED)
def create_lost_found_item(
    item: LostFoundItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    status_value = ItemStatus.LOST if item.type == "lost" else ItemStatus.FOUND
    
    db_item = LostFoundItem(
        title=item.title,
        category=item.category,
        location=item.location,
        date=item.date,
        description=item.description,
        image_path=item.image_path,
        contact_method=item.contact_method,
        contact_info=item.contact_info,
        type=item.type,
        status=status_value,
        creator_id=current_user.id
    )
    
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    return db_item


@router.get("/", response_model=List[LostFoundItemResponse])
def get_all_items(db: Session = Depends(get_db)):
    items = db.query(LostFoundItem).all()
    return items

# Get current user's lost and found items
@router.get("/me", response_model=List[LostFoundItemResponse])
def get_my_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    items = db.query(LostFoundItem).filter(LostFoundItem.creator_id == current_user.id).offset(skip).limit(limit).all()
    return items


@router.get("/{item_id}", response_model=LostFoundItemResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(LostFoundItem).filter(LostFoundItem.id == item_id).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return item


@router.patch("/{item_id}/claim", response_model=LostFoundItemResponse)
def claim_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(LostFoundItem).filter(LostFoundItem.id == item_id).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item.status = ItemStatus.CLAIMED
    db.commit()
    db.refresh(item)
    
    return item
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.event import Event, EventImage
from models.user import User
from schemas.event import EventCreate, EventResponse
from database import get_db
from authorization.oauth2 import get_current_user

router = APIRouter(prefix="/events", tags=["events"])


@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new event"""
    
    # Create the event
    db_event = Event(
        title=event.title,
        description=event.description,
        society=event.society,
        location=event.location,
        event_date=event.event_date,
        creator_id=current_user.id
    )
    
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    # Add images if provided
    if event.image_paths:
        for image_path in event.image_paths:
            db_image = EventImage(
                image_path=image_path,
                event_id=db_event.id
            )
            db.add(db_image)
        
        db.commit()
        db.refresh(db_event)
    
    return db_event


@router.get("/", response_model=List[EventResponse])
def get_all_events(db: Session = Depends(get_db)):
    """Get all events"""
    events = db.query(Event).all()
    return events


@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get a single event by ID"""
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    return event
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.event import Event, EventImage
from models.user import User
from schemas.event import EventCreate, EventResponse, EventUpdate
from database import get_db
from authorization.oauth2 import get_current_user

router = APIRouter(prefix="/events", tags=["events"])

# Create an Event
@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Create the event
    db_event = Event(
        title=event.title,
        description=event.description,
        society=event.society,
        location=event.location,
        event_date=event.event_date,
        contact_number=event.contact_number,
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

# Get all events
@router.get("/", response_model=List[EventResponse])
def get_all_events(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    events = db.query(Event).offset(skip).limit(limit).all()
    return events

# Get a single event by ID
@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

# Update an event
from schemas.event import EventCreate, EventResponse, EventUpdate
# ...existing code...

@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    event: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    if db_event.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this event")

    # Only update fields that are provided
    if event.title is not None:
        db_event.title = event.title
    if event.description is not None:
        db_event.description = event.description
    if event.event_date is not None:
        db_event.event_date = event.event_date
    if event.location is not None:
        db_event.location = event.location
    if event.max_attendees is not None:
        db_event.max_attendees = event.max_attendees

    db.commit()
    db.refresh(db_event)
    return db_event
# Delete an event
@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if current user is the creator
    if db_event.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this event")
    
    # Delete associated images first
    db.query(EventImage).filter(EventImage.event_id == event_id).delete()
    
    # Delete the event
    db.delete(db_event)
    db.commit()
    
    return None
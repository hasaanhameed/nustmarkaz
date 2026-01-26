from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    society = Column(String, nullable=False)
    location = Column(String, nullable=False)
    event_date = Column(DateTime, nullable=False)
    contact_number = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign key to the event creator
    creator_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    
    # Relationships
    creator = relationship("User", back_populates="created_events")
    images = relationship("EventImage", back_populates="event", cascade="all, delete-orphan")


class EventImage(Base):
    __tablename__ = 'event_images'

    id = Column(Integer, primary_key=True, index=True)
    image_path = Column(String, nullable=False)
    event_id = Column(Integer, ForeignKey('events.id', ondelete='CASCADE'))
    
    event = relationship("Event", back_populates="images")
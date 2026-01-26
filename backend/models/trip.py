from sqlalchemy import Column, Integer, String, Text, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Trip(Base):
    __tablename__ = 'trips'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    destination = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    departure_location = Column(String, nullable=False)
    max_participants = Column(Integer, nullable=False)
    cost_per_person = Column(Float, nullable=False)
    contact_number = Column(String, nullable=False)  # Add this line
    
    # Foreign key to the trip creator
    creator_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    
    # Relationships
    creator = relationship("User", back_populates="created_trips")
    images = relationship("TripImage", back_populates="trip", cascade="all, delete-orphan")


class TripImage(Base):
    __tablename__ = 'trip_images'

    id = Column(Integer, primary_key=True, index=True)
    image_path = Column(String, nullable=False)
    trip_id = Column(Integer, ForeignKey('trips.id', ondelete='CASCADE'))
    
    trip = relationship("Trip", back_populates="images")
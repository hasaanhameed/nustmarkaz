from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    department = Column(String, nullable=False)
    password = Column(String, nullable=False)

    # Product relationships
    products = relationship("Product", back_populates="creator")
    
    # Trip relationships
    created_trips = relationship("Trip", back_populates="creator")
    
    # Event relationships
    created_events = relationship("Event", back_populates="creator")

    # Donation relationships
    created_donations = relationship("Donation", back_populates="creator")

    # Lost/Found relationships
    lost_found_items = relationship("LostFoundItem", back_populates="creator")
    
    # Ride relationships
    created_rides = relationship("Ride", back_populates="creator")

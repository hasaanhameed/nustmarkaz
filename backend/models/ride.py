from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Time
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Ride(Base):
    __tablename__ = 'rides'

    id = Column(Integer, primary_key=True, index=True)
    
    from_location = Column(String, nullable=False, index=True)
    to_location = Column(String, nullable=False, index=True)
    ride_date = Column(String, nullable=False, index=True)  
    ride_time = Column(String, nullable=False)  
    vehicle_type = Column(String, nullable=False)  
    vehicle_model = Column(String, nullable=False)
    vehicle_color = Column(String, nullable=False)
    
    price = Column(Float, nullable=False)
    contact = Column(String, nullable=False)
    
    driver_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    creator = relationship("User", back_populates="created_rides")
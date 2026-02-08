from sqlalchemy import Column, Integer, String, Text, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Donation(Base):
    __tablename__ = 'donations'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    beneficiary = Column(String, nullable=False)  
    goal_amount = Column(Float, nullable=False) 
    end_date = Column(Date, nullable=False)
    contact_number = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    creator_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    
    creator = relationship("User", back_populates="created_donations")
    images = relationship("DonationImage", back_populates="donation", cascade="all, delete-orphan")

class DonationImage(Base):
    __tablename__ = 'donation_images'

    id = Column(Integer, primary_key=True, index=True)
    image_path = Column(String, nullable=False)
    donation_id = Column(Integer, ForeignKey('donations.id', ondelete='CASCADE'))
    
    donation = relationship("Donation", back_populates="images")
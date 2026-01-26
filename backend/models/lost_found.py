from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum


class ItemType(str, enum.Enum):
    lost = "lost"
    found = "found"


class ItemStatus(str, enum.Enum):
    LOST = "LOST"
    FOUND = "FOUND"
    CLAIMED = "CLAIMED"


class ContactMethod(str, enum.Enum):
    phone = "phone"
    email = "email"
    whatsapp = "whatsapp"


class LostFoundItem(Base):
    __tablename__ = 'lost_found_items'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    location = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    description = Column(Text, nullable=False)
    image_path = Column(String, nullable=True)
    contact_method = Column(Enum(ContactMethod), nullable=False)
    contact_info = Column(String, nullable=False)
    type = Column(Enum(ItemType), nullable=False)
    status = Column(Enum(ItemStatus), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    creator_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    
    creator = relationship("User", back_populates="lost_found_items")
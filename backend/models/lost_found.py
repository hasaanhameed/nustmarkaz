from sqlalchemy import Column, Integer, String, Text, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
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
    category = Column(String, nullable=False)  # Books, Electronics, ID Cards, Clothing, Other
    location = Column(String, nullable=False)  # Campus location
    date = Column(Date, nullable=False)  # Date lost/found
    description = Column(Text, nullable=False)
    image_path = Column(String, nullable=True)  # Optional image
    contact_method = Column(Enum(ContactMethod), nullable=False)
    contact_info = Column(String, nullable=False)  # Phone/email
    type = Column(Enum(ItemType), nullable=False)  # lost or found
    status = Column(Enum(ItemStatus), nullable=False)  # LOST, FOUND, CLAIMED
    
    creator_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    
    creator = relationship("User", back_populates="lost_found_items")
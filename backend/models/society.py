from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Society(Base):
    __tablename__ = 'societies'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    instagram_url = Column(String, nullable=True)
    image_url = Column(String, nullable=True)

    reviews = relationship("SocietyReview", back_populates="society", cascade="all, delete-orphan")


class SocietyReview(Base):
    __tablename__ = 'society_reviews'

    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=False)

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    society_id = Column(Integer, ForeignKey('societies.id', ondelete='CASCADE'))

    creator = relationship("User", back_populates="society_reviews")
    society = relationship("Society", back_populates="reviews")
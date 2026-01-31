from sqlalchemy import Column, Integer, String, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from database import Base

class Cafe(Base):
    __tablename__ = "cafes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    description = Column(Text)
    image_url = Column(String, nullable=True)  # Added for storing cafe images

    # Relationship to reviews
    reviews = relationship("Review", back_populates="cafe", cascade="all, delete-orphan")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cafe_id = Column(Integer, ForeignKey("cafes.id"), nullable=False)

    # Relationships
    user = relationship("User")
    cafe = relationship("Cafe", back_populates="reviews")
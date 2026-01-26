from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Product(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    pickup_location = Column(String, nullable=False)
    condition = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)  # Add this line
    
    creator_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))

    creator = relationship("User", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")

class ProductImage(Base):
    __tablename__ = 'product_images'

    id = Column(Integer, primary_key=True, index=True)
    image_path = Column(String, nullable=False)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'))

    product = relationship("Product", back_populates="images")
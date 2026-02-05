from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate, UserResponse, UserUpdate
from database import get_db
from hashing import Hash
from authorization.oauth2 import get_current_user
from authorization.auth_token import create_access_token
from datetime import timedelta

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = Hash.bcrypt(user.password)
    
    db_user = User(
        username=user.username,
        email=user.email,
        department=user.department,
        password=hashed_password  
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Generate JWT token
    access_token = create_access_token(data={"sub": db_user.email})
    
    return {
        "id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "department": db_user.department,
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user"""
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current authenticated user's profile"""
    current_user.username = user_update.username
    current_user.department = user_update.department
    
    db.commit()
    db.refresh(current_user)
    return current_user
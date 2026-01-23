from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate, UserResponse
from database import get_db
from hashing import Hash
from authorization.oauth2 import get_current_user

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
    return db_user


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user"""
    return current_user
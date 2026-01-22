from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate
from database import get_db
from hashing import Hash  

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

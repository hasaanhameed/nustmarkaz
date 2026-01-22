from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate
from database import get_db


router = APIRouter(prefix="/users", tags=["users"])


@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    password = user.password
    db_user = User(
        username=user.username,
        email=user.email,
        department=user.department,
        password=user.password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

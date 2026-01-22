from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.user import UserLogin
from schemas.token import Token
from authorization.auth_token import create_access_token
from database import get_db
from models.user import User

router = APIRouter(tags=["authentication"])

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Query the user from the database
    db_user = db.query(User).filter(User.email == user.email).first()

    # Verify the user exists and the password matches
    if db_user is None or db_user.password != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create the JWT token for the user
    access_token = create_access_token(data={"sub": db_user.email})

    return {"access_token": access_token, "token_type": "bearer"}

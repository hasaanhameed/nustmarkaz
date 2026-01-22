from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, database
from authorization.auth_token import verify_token  # Correct import for auth_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(database.get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Verify token and retrieve token data
    token_data = verify_token(token, credentials_exception)

    # Fetch the user from the database
    user = db.query(models.User).filter(models.User.email == token_data.email).first()

    if user is None:
        raise credentials_exception

    return user

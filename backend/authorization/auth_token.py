from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from schemas.token import TokenData
from dotenv import load_dotenv
import os
import random
import string

# Load environment variables from .env file
load_dotenv()

# Load constants from .env
SECRET_KEY = os.getenv("SECRET_KEY") or ''.join(random.choices(string.ascii_letters + string.digits, k=32))  # Generate if not set
ALGORITHM = os.getenv("ALGORITHM", "HS256")  # Default to HS256 if not set
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))  # Default 7 days

# Save the SECRET_KEY if it's generated to .env (optional)
if not os.getenv("SECRET_KEY"):
    with open(".env", "a") as f:
        f.write(f"\nSECRET_KEY={SECRET_KEY}")

# Function to create an access token
def create_access_token(data: dict):
    to_encode = data.copy()
    
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Function to verify a token
def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
        return token_data
    except JWTError as e:
        print(f"DEBUG: JWTError occurred: {str(e)}")
        raise credentials_exception
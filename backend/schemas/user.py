from pydantic import BaseModel

# Schema to create a new user
class UserCreate(BaseModel):
    username: str
    email: str
    department: str
    password: str

    class Config:
        orm_mode = True 


class UserLogin(BaseModel):
    email: str
    password: str


# Schema for user response (without password)
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    department: str

    class Config:
        orm_mode = True
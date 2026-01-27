from pydantic import BaseModel
from datetime import datetime

class UserInteractionCreate(BaseModel):
    item_id: int
    item_type: str  

    class Config:
        from_attributes = True

class UserInteractionResponse(BaseModel):
    id: int
    user_id: int
    item_id: int
    item_type: str
    created_at: datetime

    class Config:
        from_attributes = True
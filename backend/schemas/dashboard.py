from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DashboardCard(BaseModel):
    id: int
    type: str                
    title: str
    subtitle: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    creator_username: str
    created_at: datetime

    class Config:
        from_attributes = True

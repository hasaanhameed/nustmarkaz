from pydantic import BaseModel

class SocialLoginRequest(BaseModel):
    email: str

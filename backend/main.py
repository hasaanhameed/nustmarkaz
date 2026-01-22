from fastapi import FastAPI
from routers import user, authentication
from database import engine, Base

# Create all tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include the user router
app.include_router(user.router)
app.include_router(authentication.router)


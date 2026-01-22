from fastapi import FastAPI
from routers import user, authentication
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
# Create all tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )

# Include the user router
app.include_router(user.router)
app.include_router(authentication.router)


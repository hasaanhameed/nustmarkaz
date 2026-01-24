from fastapi import FastAPI
from routers import user, authentication, donation, product, trip
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

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
app.include_router(donation.router)
app.include_router(product.router)
app.include_router(trip.router)


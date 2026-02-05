from fastapi import FastAPI
from routers import user, authentication, donation, product, trip, event, lost_found, ride, dashboard, cafe, society, profile
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
app.include_router(event.router)
app.include_router(lost_found.router) 
app.include_router(ride.router)  
app.include_router(dashboard.router)
app.include_router(cafe.router) 
app.include_router(society.router)
app.include_router(profile.router)
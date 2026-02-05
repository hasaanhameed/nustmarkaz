from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas.dashboard import DashboardCard

from models.product import Product
from models.trip import Trip
from models.event import Event
from models.ride import Ride
from models.donation import Donation
from models.lost_found import LostFoundItem

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# Mapper functions for different models (Converting to DashboardCard)
def product_to_card(p: Product) -> DashboardCard:
    return DashboardCard(
        id=p.id,
        type="product",
        title=p.title,
        subtitle=p.category,
        price=p.price,
        image=p.images[0].image_path if p.images else None,
        creator_username=p.creator.username,
        created_at=p.created_at
    )

def trip_to_card(t: Trip) -> DashboardCard:
    return DashboardCard(
        id=t.id,
        type="trip",
        title=t.title,
        subtitle=t.destination,
        price=t.cost_per_person,
        image=t.images[0].image_path if t.images else None,
        creator_username=t.creator.username,
        created_at=t.created_at
    )

def event_to_card(e: Event) -> DashboardCard:
    return DashboardCard(
        id=e.id,
        type="event",
        title=e.title,
        subtitle=e.location,
        price=None,
        image=e.images[0].image_path if e.images else None,
        creator_username=e.creator.username,
        created_at=e.created_at
    )

def ride_to_card(r: Ride) -> DashboardCard:
    return DashboardCard(
        id=r.id,
        type="ride",
        title=f"{r.from_location} to {r.to_location}",
        subtitle=f"{r.ride_date} at {r.ride_time}",
        price=None,
        image=None,
        creator_username=r.requester.username,
        created_at=r.created_at
    )

def donation_to_card(d: Donation) -> DashboardCard:
    return DashboardCard(
        id=d.id,
        type="donation",
        title=d.title,
        subtitle=d.beneficiary,
        price=d.goal_amount,
        image=None,
        creator_username=d.creator.username,
        created_at=d.created_at
    )

def lost_found_to_card(l: LostFoundItem) -> DashboardCard:
    return DashboardCard(
        id=l.id,
        type="lost_found",
        title=l.title,
        subtitle=l.location,
        price=None,
        image=l.image_path,
        creator_username=l.creator.username,
        created_at=l.created_at
    )

# Main endpoint to fetch the latest posts
@router.get("/latest", response_model=List[DashboardCard])
def get_latest_posts(
    db: Session = Depends(get_db),
    limit: int = 20
):
    cards = []

    # Query the latest posts from each model
    cards += [
        product_to_card(p)
        for p in db.query(Product)
        .order_by(Product.created_at.desc())
        .limit(limit)
        .all()
    ]

    cards += [
        trip_to_card(t)
        for t in db.query(Trip)
        .order_by(Trip.created_at.desc())
        .limit(limit)
        .all()
    ]

    cards += [
        event_to_card(e)
        for e in db.query(Event)
        .order_by(Event.created_at.desc())
        .limit(limit)
        .all()
    ]

    cards += [
        ride_to_card(r)
        for r in db.query(Ride)
        .order_by(Ride.created_at.desc())
        .limit(limit)
        .all()
    ]

    cards += [
        donation_to_card(d)
        for d in db.query(Donation)
        .order_by(Donation.created_at.desc())
        .limit(limit)
        .all()
    ]

    cards += [
        lost_found_to_card(l)
        for l in db.query(LostFoundItem)
        .order_by(LostFoundItem.created_at.desc())
        .limit(limit)
        .all()
    ]

    cards.sort(key=lambda x: x.created_at, reverse=True)

    return cards[:limit]

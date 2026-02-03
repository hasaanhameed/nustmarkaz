from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool  # Required for Supabase Session/Transaction Pooler
from pathlib import Path
from dotenv import load_dotenv
import os

ENV_PATH = Path(__file__).resolve().parent / ".env"
if ENV_PATH.exists():
    load_dotenv(ENV_PATH)

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

if not all([USER, PASSWORD, HOST, PORT, DBNAME]):
    missing = [k for k, v in {
        "user": USER, 
        "password": PASSWORD, 
        "host": HOST, 
        "port": PORT, 
        "dbname": DBNAME
    }.items() if not v]
    raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

# NullPool disables SQLAlchemy's client-side connection pooling
engine = create_engine(DATABASE_URL, poolclass=NullPool)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
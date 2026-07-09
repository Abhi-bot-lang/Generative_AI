from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os
import logging

load_dotenv()

# Support multiple env var names so .env entries like 'Database=' still work
DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("Database") or os.getenv("DATABASE")

if not DATABASE_URL:
    logging.error("DATABASE_URL environment variable is not set. Please add DATABASE_URL to your .env.")
    raise RuntimeError("DATABASE_URL environment variable is not set. Please add DATABASE_URL to your .env.")

# If connecting to Supabase/Postgres over TLS, ensure sslmode is required for psycopg2
connect_args = {}
if DATABASE_URL.startswith("postgres") and "supabase.co" in DATABASE_URL:
    connect_args = {"sslmode": "require"}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()




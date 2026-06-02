"""SQLAlchemy engine, session factory and declarative base."""
import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import settings

# If a CA certificate is configured (e.g. Aiven), enable SSL/TLS.
# The path may be absolute or relative to the backend folder.
connect_args = {}
if settings.DB_SSL_CA:
    ca_path = settings.DB_SSL_CA
    if not os.path.isabs(ca_path):
        ca_path = str(Path(__file__).resolve().parents[1] / ca_path)
    connect_args["ssl"] = {"ca": ca_path}

engine = create_engine(
    settings.sqlalchemy_url,
    pool_pre_ping=True,
    pool_recycle=280,
    future=True,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

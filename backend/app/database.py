"""SQLAlchemy engine, session factory and declarative base."""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import settings

engine = create_engine(
    settings.sqlalchemy_url,
    pool_pre_ping=True,   # reconnect dropped connections (common on free hosts)
    pool_recycle=280,     # recycle before typical idle timeouts
    future=True,
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

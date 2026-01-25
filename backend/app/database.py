"""
Database Configuration

SQLite database setup using SQLAlchemy.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


# SQLite database URL - file-based for simplicity
DATABASE_URL = "sqlite:///./tasks.db"


# Create engine with SQLite-specific settings
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite specific
)


# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency that provides a database session.
    Ensures proper cleanup after request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

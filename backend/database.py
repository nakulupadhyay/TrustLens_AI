from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL
import logging

logger = logging.getLogger(__name__)

# Handle database-specific connect args
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# For PostgreSQL (Supabase, Neon, etc.), add pool settings for reliability
pool_kwargs = {}
if DATABASE_URL.startswith("postgresql"):
    pool_kwargs = {
        "pool_pre_ping": True,          # Reconnect on stale connections
        "pool_size": 5,
        "max_overflow": 10,
        "pool_recycle": 300,            # Recycle connections every 5 min
    }

try:
    engine = create_engine(DATABASE_URL, connect_args=connect_args, **pool_kwargs)
    logger.info(f"Database engine created: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")
except Exception as e:
    logger.error(f"Failed to create database engine: {e}")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

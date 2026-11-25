from sqlalchemy import Column, Integer, Float, String, Text, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # --- Core pricing ---
    base_price = Column(Float, nullable=False)
    severity = Column(Integer, nullable=False, default=0)
    recommended_price = Column(Float, nullable=False)   # kept for backward compat
    explanation = Column(Text, nullable=False)
    image_urls = Column(JSON, default=[])
    detections = Column(JSON, default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # --- Phone identity ---
    brand = Column(String(100), nullable=True)
    model_name = Column(String(150), nullable=True)
    storage_capacity = Column(String(50), nullable=True)   # e.g. "128GB"

    # --- Assessment inputs ---
    purchase_date = Column(String(20), nullable=True)    # "YYYY-MM-DD"
    phone_age_years = Column(Float, nullable=True)
    battery_health = Column(Integer, nullable=True)      # 0-100
    functional_issues = Column(JSON, default={})         # {key: bool}

    # --- Deduction percentages applied ---
    age_deduction_pct = Column(Float, default=0.0)
    damage_deduction_pct = Column(Float, default=0.0)
    battery_deduction_pct = Column(Float, default=0.0)
    functional_deduction_pct = Column(Float, default=0.0)
    market_adjustment_pct = Column(Float, default=0.0)

    # --- Step-by-step prices ---
    age_adjusted_price = Column(Float, nullable=True)
    damage_adjusted_price = Column(Float, nullable=True)
    battery_adjusted_price = Column(Float, nullable=True)
    functional_adjusted_price = Column(Float, nullable=True)
    final_price = Column(Float, nullable=True)

    # --- Full price breakdown (JSON) ---
    price_breakdown = Column(JSON, default={})

    images = relationship("Image", back_populates="report", cascade="all, delete-orphan")

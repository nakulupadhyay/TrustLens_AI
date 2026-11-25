from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime


class DetectionItem(BaseModel):
    label: str
    confidence: float
    bbox: List[float]


class AnalyzeRequest(BaseModel):
    model_config = {"protected_namespaces": ()}

    image_urls: List[str]
    base_price: float = Field(..., gt=0, description="Original purchase price in INR")

    # Phone identity (all optional for backward compat)
    brand: Optional[str] = None
    model_name: Optional[str] = None
    storage_capacity: Optional[str] = None

    # Assessment inputs
    purchase_date: Optional[str] = None          # "YYYY-MM-DD"
    battery_health: Optional[int] = Field(None, ge=0, le=100)
    functional_issues: Optional[Dict[str, bool]] = None


class PriceBreakdownStep(BaseModel):
    label: str
    deduction_pct: float
    price_after: float
    note: str


class PriceBreakdown(BaseModel):
    base_price: float
    steps: List[PriceBreakdownStep]
    final_price: float
    functional_issue_breakdown: Optional[Dict[str, float]] = None


class AnalyzeResponse(BaseModel):
    id: int
    image_urls: List[Any]
    detections: List[Any]
    severity: int
    recommended_price: float          # legacy field — equals final_price
    explanation: str
    created_at: Optional[datetime] = None

    # New multi-factor fields
    brand: Optional[str] = None
    model_name: Optional[str] = None
    storage_capacity: Optional[str] = None
    purchase_date: Optional[str] = None
    phone_age_years: Optional[float] = None
    battery_health: Optional[int] = None
    functional_issues: Optional[Dict[str, bool]] = None

    age_deduction_pct: Optional[float] = None
    damage_deduction_pct: Optional[float] = None
    battery_deduction_pct: Optional[float] = None
    functional_deduction_pct: Optional[float] = None
    market_adjustment_pct: Optional[float] = None

    age_adjusted_price: Optional[float] = None
    damage_adjusted_price: Optional[float] = None
    battery_adjusted_price: Optional[float] = None
    functional_adjusted_price: Optional[float] = None
    final_price: Optional[float] = None
    price_breakdown: Optional[Dict[str, Any]] = None


class ReportResponse(BaseModel):
    id: int
    user_id: int
    base_price: float
    severity: int
    recommended_price: float
    explanation: str
    image_urls: List[Any]
    detections: List[Any]
    created_at: Optional[datetime] = None

    # New fields
    brand: Optional[str] = None
    model_name: Optional[str] = None
    storage_capacity: Optional[str] = None
    purchase_date: Optional[str] = None
    phone_age_years: Optional[float] = None
    battery_health: Optional[int] = None
    functional_issues: Optional[Dict[str, bool]] = None
    final_price: Optional[float] = None
    price_breakdown: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

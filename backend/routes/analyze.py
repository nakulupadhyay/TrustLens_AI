from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.report import Report
from models.image import Image as ImageModel
from schemas.report import AnalyzeRequest, AnalyzeResponse
from services.auth import get_current_user
from services.yolo import run_yolo
from services.severity import calculate_severity
from services.valuation import calculate_full_valuation
from services.llm import generate_full_explanation
from services.storage import url_to_local_path

router = APIRouter(tags=["Analysis"])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_images(
    request: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Full multi-factor analysis pipeline:
    1. Resolve image URLs → local paths
    2. YOLO damage detection (real detections only)
    3. Severity scoring
    4. Multi-factor valuation (Age → Damage → Battery → Functional → Market)
    5. Rule-based explanation generation
    6. Save complete report to DB
    7. Return full response
    """
    if not request.image_urls:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one image URL is required",
        )

    if request.base_price <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Base price must be a positive number",
        )

    # --- Step 1 + 2: YOLO inference ---
    all_detections = []
    for url in request.image_urls:
        local_path = url_to_local_path(url)
        detections = run_yolo(local_path)
        all_detections.extend(detections)

    # --- Step 3: Severity ---
    severity = calculate_severity(all_detections)

    # --- Step 4: Multi-factor valuation ---
    valuation = calculate_full_valuation(
        base_price=request.base_price,
        severity=severity,
        purchase_date=request.purchase_date,
        battery_health=request.battery_health,
        functional_issues=request.functional_issues,
        brand=request.brand,
    )

    # --- Step 5: Explanation ---
    explanation = generate_full_explanation(
        valuation=valuation,
        detections=all_detections,
        severity=severity,
        brand=request.brand,
        model_name=request.model_name,
        storage_capacity=request.storage_capacity,
        battery_health=request.battery_health,
        functional_issues=request.functional_issues,
    )

    final_price = valuation["final_price"]

    # --- Step 6: Save to DB ---
    report = Report(
        user_id=current_user.id,
        base_price=request.base_price,
        severity=severity,
        recommended_price=final_price,  # legacy field mirrors final_price
        explanation=explanation,
        image_urls=request.image_urls,
        detections=all_detections,
        # Phone identity
        brand=request.brand,
        model_name=request.model_name,
        storage_capacity=request.storage_capacity,
        # Assessment inputs
        purchase_date=request.purchase_date,
        phone_age_years=valuation.get("age_years"),
        battery_health=request.battery_health,
        functional_issues=request.functional_issues or {},
        # Deduction percentages
        age_deduction_pct=valuation["age_deduction_pct"],
        damage_deduction_pct=valuation["damage_deduction_pct"],
        battery_deduction_pct=valuation["battery_deduction_pct"],
        functional_deduction_pct=valuation["functional_deduction_pct"],
        market_adjustment_pct=valuation["market_adjustment_pct"],
        # Step prices
        age_adjusted_price=valuation["age_adjusted_price"],
        damage_adjusted_price=valuation["damage_adjusted_price"],
        battery_adjusted_price=valuation["battery_adjusted_price"],
        functional_adjusted_price=valuation["functional_adjusted_price"],
        final_price=final_price,
        price_breakdown=valuation["price_breakdown"],
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    # Save image records
    for url in request.image_urls:
        img = ImageModel(report_id=report.id, url=url)
        db.add(img)
    db.commit()

    # --- Step 7: Return ---
    return AnalyzeResponse(
        id=report.id,
        image_urls=request.image_urls,
        detections=all_detections,
        severity=severity,
        recommended_price=final_price,
        explanation=explanation,
        created_at=report.created_at,
        # Phone identity
        brand=request.brand,
        model_name=request.model_name,
        storage_capacity=request.storage_capacity,
        purchase_date=request.purchase_date,
        phone_age_years=valuation.get("age_years"),
        battery_health=request.battery_health,
        functional_issues=request.functional_issues,
        # Deduction percentages
        age_deduction_pct=valuation["age_deduction_pct"],
        damage_deduction_pct=valuation["damage_deduction_pct"],
        battery_deduction_pct=valuation["battery_deduction_pct"],
        functional_deduction_pct=valuation["functional_deduction_pct"],
        market_adjustment_pct=valuation["market_adjustment_pct"],
        # Step prices
        age_adjusted_price=valuation["age_adjusted_price"],
        damage_adjusted_price=valuation["damage_adjusted_price"],
        battery_adjusted_price=valuation["battery_adjusted_price"],
        functional_adjusted_price=valuation["functional_adjusted_price"],
        final_price=final_price,
        price_breakdown=valuation["price_breakdown"],
    )

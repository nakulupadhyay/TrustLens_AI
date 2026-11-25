"""
Multi-factor smartphone resale valuation engine.

Calculation order (sequential, each step uses the price from the previous):
  1. Age Depreciation      (applied to base_price)
  2. Physical Damage       (applied to age-adjusted price)
  3. Battery Health        (applied to damage-adjusted price)
  4. Functional Condition  (applied to battery-adjusted price)
  5. Market / Brand Factor (applied to functional-adjusted price)

All percentages are configurable via PRICING_CONFIG.
No random values. No fabricated market data.
"""

from datetime import date, datetime
from typing import Dict, List, Optional

# ---------------------------------------------------------------------------
# CENTRAL CONFIGURATION — edit these values to change the valuation rules
# ---------------------------------------------------------------------------
PRICING_CONFIG: Dict = {
    # Phone age → depreciation fraction (0.0 = no deduction, 0.5 = 50%)
    # Key = minimum age in years for this tier to apply
    "age_depreciation": {
        0: 0.00,   # < 1 year
        1: 0.10,   # 1–<2 years
        2: 0.20,   # 2–<3 years
        3: 0.30,   # 3–<4 years
        4: 0.40,   # 4–<5 years
        5: 0.50,   # 5+ years
    },

    # YOLO severity score (0–10) → damage deduction fraction
    # Bands match the existing severity.py thresholds
    "damage_deductions": {
        0: 0.00,   # No damage
        1: 0.10,   # Minor (1–2)
        3: 0.25,   # Moderate (3–4)
        5: 0.40,   # Severe (5–7)
        8: 0.55,   # Critical (8–10)
    },

    # Battery health % → deduction fraction
    # Key = minimum battery % for this tier (highest key that applies wins)
    "battery_deductions": {
        90: 0.00,  # 90–100%
        80: 0.05,  # 80–89%
        70: 0.10,  # 70–79%
        60: 0.15,  # 60–69%
        0:  0.20,  # < 60%
    },

    # Functional issues → individual deduction fractions
    # These are ADDITIVE but capped at max_functional_deduction
    "functional_deductions": {
        "touchscreen":    0.05,
        "display":        0.05,
        "front_camera":   0.03,
        "rear_camera":    0.03,
        "speaker":        0.03,
        "microphone":     0.03,
        "charging_port":  0.04,
        "buttons":        0.02,
        "wifi_network":   0.03,
        "biometrics":     0.02,
    },

    # Maximum total functional deduction (prevents excessive stacking)
    "max_functional_deduction": 0.25,

    # Brand demand multiplier (> 1.0 = premium, < 1.0 = discounted)
    # Applied as: price × (1 + factor) where factor can be negative
    "brand_demand_factors": {
        "apple":    0.05,    # +5%  premium resale
        "samsung":  0.00,    # neutral
        "oneplus":  -0.03,   # -3%
        "xiaomi":   -0.05,   # -5%
        "vivo":     -0.05,
        "oppo":     -0.05,
        "realme":   -0.07,
        "motorola": -0.05,
        "nokia":    -0.05,
        "other":    0.00,
    },

    # Absolute floor: price will never drop below this fraction of base_price
    "min_price_fraction": 0.10,

    # Issues that overlap with physical damage — if severity > threshold,
    # the functional issue deduction is SKIPPED to avoid double-charging
    "overlap_rules": {
        # functional_key: (severity_threshold, overlap_condition)
        # If severity >= threshold → skip this functional deduction
        "display":    5,   # severe+ physical damage already charges for broken display
        "touchscreen": 5,
    },
}


# ---------------------------------------------------------------------------
# HELPER FUNCTIONS
# ---------------------------------------------------------------------------

def _age_in_years(purchase_date_str: Optional[str]) -> Optional[float]:
    """Return phone age in years from ISO date string, or None if unavailable."""
    if not purchase_date_str:
        return None
    try:
        purchase = datetime.strptime(purchase_date_str[:10], "%Y-%m-%d").date()
        delta = date.today() - purchase
        return round(delta.days / 365.25, 2)
    except Exception:
        return None


def _get_age_deduction(age_years: Optional[float]) -> float:
    """Look up age depreciation fraction from config."""
    if age_years is None:
        return 0.0
    tiers = sorted(PRICING_CONFIG["age_depreciation"].keys(), reverse=True)
    for tier in tiers:
        if age_years >= tier:
            return PRICING_CONFIG["age_depreciation"][tier]
    return 0.0


def _get_damage_deduction(severity: int) -> float:
    """Look up damage deduction fraction from severity score."""
    tiers = sorted(PRICING_CONFIG["damage_deductions"].keys(), reverse=True)
    for tier in tiers:
        if severity >= tier:
            return PRICING_CONFIG["damage_deductions"][tier]
    return 0.0


def _get_battery_deduction(battery_health: Optional[int]) -> float:
    """Look up battery health deduction fraction."""
    if battery_health is None:
        return 0.0
    tiers = sorted(PRICING_CONFIG["battery_deductions"].keys(), reverse=True)
    for tier in tiers:
        if battery_health >= tier:
            return PRICING_CONFIG["battery_deductions"][tier]
    return 0.0


def _get_functional_deduction(
    functional_issues: Optional[Dict[str, bool]],
    severity: int,
) -> tuple[float, Dict[str, float]]:
    """
    Calculate total functional deduction, respecting:
    - overlap_rules (skip if physical damage already covers it)
    - max_functional_deduction cap

    Returns (total_fraction, {issue_key: fraction_applied})
    """
    if not functional_issues:
        return 0.0, {}

    deduction_map = PRICING_CONFIG["functional_deductions"]
    overlap_rules = PRICING_CONFIG["overlap_rules"]
    cap = PRICING_CONFIG["max_functional_deduction"]

    applied: Dict[str, float] = {}
    total = 0.0

    for key, is_broken in functional_issues.items():
        if not is_broken:
            continue
        # Check overlap rule
        overlap_threshold = overlap_rules.get(key)
        if overlap_threshold is not None and severity >= overlap_threshold:
            applied[key] = 0.0  # skipped — physical damage already charged
            continue
        rate = deduction_map.get(key, 0.0)
        if total + rate > cap:
            rate = max(cap - total, 0.0)
        applied[key] = rate
        total += rate
        if total >= cap:
            break

    return round(total, 4), applied


def _get_market_factor(brand: Optional[str]) -> float:
    """Return brand demand adjustment factor (can be positive or negative)."""
    if not brand:
        return 0.0
    key = brand.strip().lower()
    return PRICING_CONFIG["brand_demand_factors"].get(key, 0.0)


# ---------------------------------------------------------------------------
# MAIN VALUATION FUNCTION
# ---------------------------------------------------------------------------

def calculate_full_valuation(
    base_price: float,
    severity: int,
    purchase_date: Optional[str] = None,
    battery_health: Optional[int] = None,
    functional_issues: Optional[Dict[str, bool]] = None,
    brand: Optional[str] = None,
) -> Dict:
    """
    Run the full sequential valuation pipeline and return a detailed result dict.

    Returns a dict with all intermediate prices, deduction percentages,
    and a price_breakdown summary suitable for storage and display.
    """
    min_price = base_price * PRICING_CONFIG["min_price_fraction"]

    # --- Step 1: Age Depreciation ---
    age_years = _age_in_years(purchase_date)
    age_deduction_pct = _get_age_deduction(age_years)
    age_adjusted_price = base_price * (1.0 - age_deduction_pct)

    # --- Step 2: Physical Damage ---
    damage_deduction_pct = _get_damage_deduction(severity)
    damage_adjusted_price = age_adjusted_price * (1.0 - damage_deduction_pct)

    # --- Step 3: Battery Health ---
    battery_deduction_pct = _get_battery_deduction(battery_health)
    battery_adjusted_price = damage_adjusted_price * (1.0 - battery_deduction_pct)

    # --- Step 4: Functional Condition ---
    functional_deduction_pct, functional_breakdown = _get_functional_deduction(
        functional_issues, severity
    )
    functional_adjusted_price = battery_adjusted_price * (1.0 - functional_deduction_pct)

    # --- Step 5: Market / Brand Adjustment ---
    market_factor = _get_market_factor(brand)
    market_adjusted_price = functional_adjusted_price * (1.0 + market_factor)

    # --- Apply floor ---
    final_price = max(market_adjusted_price, min_price)
    final_price = round(final_price, 2)

    # --- Round intermediate values ---
    age_adjusted_price = round(age_adjusted_price, 2)
    damage_adjusted_price = round(damage_adjusted_price, 2)
    battery_adjusted_price = round(battery_adjusted_price, 2)
    functional_adjusted_price = round(functional_adjusted_price, 2)

    # Effective market_adjustment_pct (signed)
    market_adjustment_pct = round(market_factor, 4)

    price_breakdown = {
        "base_price": base_price,
        "steps": [
            {
                "label": "Age Depreciation",
                "deduction_pct": round(age_deduction_pct * 100, 1),
                "price_after": age_adjusted_price,
                "note": f"{round(age_years, 1)} years old" if age_years is not None else "Purchase date not provided",
            },
            {
                "label": "Physical Damage",
                "deduction_pct": round(damage_deduction_pct * 100, 1),
                "price_after": damage_adjusted_price,
                "note": f"Severity score {severity}/10",
            },
            {
                "label": "Battery Health",
                "deduction_pct": round(battery_deduction_pct * 100, 1),
                "price_after": battery_adjusted_price,
                "note": f"{battery_health}% battery health" if battery_health is not None else "Battery health not provided",
            },
            {
                "label": "Functional Condition",
                "deduction_pct": round(functional_deduction_pct * 100, 1),
                "price_after": functional_adjusted_price,
                "note": _functional_note(functional_issues, functional_breakdown),
            },
            {
                "label": "Market / Brand Factor",
                "deduction_pct": round(-market_factor * 100, 1),  # negative = bonus
                "price_after": round(max(market_adjusted_price, min_price), 2),
                "note": f"{brand or 'Unknown brand'} resale demand factor ({market_factor:+.0%})",
            },
        ],
        "final_price": final_price,
        "functional_issue_breakdown": functional_breakdown,
    }

    return {
        "age_years": age_years,
        "age_deduction_pct": age_deduction_pct,
        "damage_deduction_pct": damage_deduction_pct,
        "battery_deduction_pct": battery_deduction_pct,
        "functional_deduction_pct": functional_deduction_pct,
        "market_adjustment_pct": market_adjustment_pct,
        "age_adjusted_price": age_adjusted_price,
        "damage_adjusted_price": damage_adjusted_price,
        "battery_adjusted_price": battery_adjusted_price,
        "functional_adjusted_price": functional_adjusted_price,
        "final_price": final_price,
        "price_breakdown": price_breakdown,
    }


def _functional_note(
    functional_issues: Optional[Dict[str, bool]],
    breakdown: Dict[str, float],
) -> str:
    if not functional_issues:
        return "No functional issues reported"
    broken = [k for k, v in functional_issues.items() if v]
    skipped = [k for k, pct in breakdown.items() if pct == 0.0 and functional_issues.get(k)]
    if not broken:
        return "All functions working"
    note = f"{len(broken)} issue(s) reported"
    if skipped:
        note += f" ({len(skipped)} already covered by physical damage deduction)"
    return note

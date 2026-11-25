"""
Rule-based explanation generator for TrustLens AI.

Generates human-readable valuation explanations from ACTUAL calculation results.
No LLM or random text — every sentence is derived from real numbers.
"""

from typing import Dict, List, Any, Optional
from services.severity import get_condition_label


def generate_explanation(detections: list, severity: int) -> str:
    """
    Legacy single-factor explanation (kept for backward compatibility).
    Use generate_full_explanation() for the full multi-factor report.
    """
    condition = get_condition_label(severity)
    if severity == 0:
        return (
            "The smartphone shows no visible physical damage. "
            "It is in excellent condition and can be priced at or near its original market value."
        )

    detection_summary = _summarize_detections(detections)
    return (
        f"Physical condition assessment: {condition} (severity {severity}/10). "
        f"{detection_summary} "
        f"The recommended resale price reflects this physical condition."
    )


def generate_full_explanation(
    valuation: Dict,
    detections: List[Any],
    severity: int,
    brand: Optional[str] = None,
    model_name: Optional[str] = None,
    storage_capacity: Optional[str] = None,
    battery_health: Optional[int] = None,
    functional_issues: Optional[Dict[str, bool]] = None,
) -> str:
    """
    Generate a detailed, transparent valuation explanation from actual numbers.
    Every claim is backed by the valuation dict values — no fabrication.
    """
    lines: List[str] = []

    # --- Phone Identity ---
    phone_desc = _phone_description(brand, model_name, storage_capacity)
    lines.append(f"## TrustLens AI — Resale Valuation Report")
    lines.append(f"\n**Phone:** {phone_desc}")
    lines.append(f"**Original Price:** ₹{valuation['price_breakdown']['base_price']:,.0f}")
    lines.append(f"**Estimated Resale Price:** ₹{valuation['final_price']:,.0f}\n")

    lines.append("---\n")
    lines.append("### How the Price Was Calculated\n")

    # --- Step 1: Age ---
    age_pct = valuation["age_deduction_pct"] * 100
    age_years = valuation.get("age_years")
    if age_years is not None:
        age_str = f"{age_years:.1f} years"
        lines.append(
            f"**1. Age Depreciation ({age_pct:.0f}% deduction):** "
            f"The phone is approximately {age_str} old. "
            + _age_comment(age_years, age_pct)
        )
    else:
        lines.append(
            "**1. Age Depreciation:** Purchase date not provided; no age depreciation applied."
        )

    # --- Step 2: Physical Damage ---
    dmg_pct = valuation["damage_deduction_pct"] * 100
    condition = get_condition_label(severity)
    detection_summary = _summarize_detections(detections)
    lines.append(
        f"\n**2. Physical Damage ({dmg_pct:.0f}% deduction):** "
        f"YOLO analysis scored this phone {severity}/10 — {condition}. "
        f"{detection_summary}"
    )

    # --- Step 3: Battery ---
    bat_pct = valuation["battery_deduction_pct"] * 100
    if battery_health is not None:
        lines.append(
            f"\n**3. Battery Health ({bat_pct:.0f}% deduction):** "
            f"User-reported battery health is {battery_health}%. "
            + _battery_comment(battery_health, bat_pct)
        )
    else:
        lines.append(
            "\n**3. Battery Health:** Not provided; no battery deduction applied."
        )

    # --- Step 4: Functional ---
    func_pct = valuation["functional_deduction_pct"] * 100
    func_breakdown = valuation["price_breakdown"].get("functional_issue_breakdown", {})
    lines.append(
        f"\n**4. Functional Condition ({func_pct:.0f}% deduction):**"
    )
    if functional_issues:
        broken = [k for k, v in functional_issues.items() if v]
        working = [k for k, v in functional_issues.items() if not v]
        skipped = [k for k, pct in func_breakdown.items() if pct == 0.0 and functional_issues.get(k)]

        if broken:
            human_broken = ", ".join(_human_label(k) for k in broken)
            lines.append(f"Issues reported: {human_broken}.")
        else:
            lines.append("No functional issues reported — all systems working.")

        if skipped:
            human_skipped = ", ".join(_human_label(k) for k in skipped)
            lines.append(
                f"Note: {human_skipped} deduction was not applied separately "
                f"as it is already accounted for in the physical damage assessment."
            )
    else:
        lines.append("No functional assessment provided.")

    # --- Step 5: Market ---
    mkt_pct = valuation["market_adjustment_pct"] * 100
    brand_name = brand or "Unknown"
    if mkt_pct > 0:
        lines.append(
            f"\n**5. Brand Demand (+{mkt_pct:.0f}% premium):** "
            f"{brand_name} devices typically command a higher resale value in the secondary market."
        )
    elif mkt_pct < 0:
        lines.append(
            f"\n**5. Brand Demand ({mkt_pct:.0f}% adjustment):** "
            f"{brand_name} devices are factored at a slight discount relative to market leaders."
        )
    else:
        lines.append(
            f"\n**5. Brand Demand (neutral):** "
            f"{brand_name} carries a neutral market demand factor."
        )

    # --- Summary ---
    lines.append("\n---\n")
    lines.append("### Price Breakdown Summary\n")
    bp = valuation["price_breakdown"]
    lines.append(f"| Step | Deduction | Price After |")
    lines.append(f"|------|-----------|-------------|")
    lines.append(f"| Original Price | — | ₹{bp['base_price']:,.0f} |")
    for step in bp["steps"]:
        sign = "−" if step["deduction_pct"] > 0 else ("+" if step["deduction_pct"] < 0 else "")
        pct_str = f"{sign}{abs(step['deduction_pct']):.1f}%" if step["deduction_pct"] != 0 else "0%"
        lines.append(f"| {step['label']} | {pct_str} | ₹{step['price_after']:,.0f} |")
    lines.append(f"| **Final Resale Price** | | **₹{bp['final_price']:,.0f}** |")

    lines.append(
        "\n*Disclaimer: This estimate is based on user-provided inputs and AI analysis. "
        "Actual resale prices may vary based on local market conditions.*"
    )

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------

def _phone_description(brand, model_name, storage_capacity) -> str:
    parts = [p for p in [brand, model_name, storage_capacity] if p]
    return " ".join(parts) if parts else "Smartphone (details not provided)"


def _summarize_detections(detections: list) -> str:
    if not detections:
        return "No physical damage was detected in the uploaded images."
    counts: Dict[str, int] = {}
    for d in detections:
        label = d.get("label", "unknown")
        counts[label] = counts.get(label, 0) + 1
    parts = [f"{v} {k}(s)" for k, v in counts.items()]
    return f"Detected: {', '.join(parts)}."


def _age_comment(age_years: float, pct: float) -> str:
    if age_years < 1:
        return "Minimal depreciation for a nearly-new device."
    elif age_years < 2:
        return "Moderate depreciation for a 1-year-old device."
    elif age_years < 3:
        return "Standard depreciation band for a 2-year-old device."
    elif age_years < 5:
        return "Significant age-related depreciation applied."
    else:
        return "High depreciation applied for a device that is 5+ years old."


def _battery_comment(health: int, pct: float) -> str:
    if health >= 90:
        return "Excellent battery condition; no deduction applied."
    elif health >= 80:
        return "Good battery condition; minor deduction applied."
    elif health >= 70:
        return "Average battery health; moderate deduction applied."
    elif health >= 60:
        return "Below-average battery health; notable deduction applied."
    else:
        return "Poor battery health; significant deduction applied. Battery replacement recommended."


def _human_label(key: str) -> str:
    labels = {
        "touchscreen": "Touchscreen",
        "display": "Display",
        "front_camera": "Front Camera",
        "rear_camera": "Rear Camera",
        "speaker": "Speaker",
        "microphone": "Microphone",
        "charging_port": "Charging Port",
        "buttons": "Physical Buttons",
        "wifi_network": "Wi-Fi / Network",
        "biometrics": "Face ID / Fingerprint",
    }
    return labels.get(key, key.replace("_", " ").title())

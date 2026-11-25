"""
Test script for the multi-factor valuation engine.
Run from backend/ directory:
  python test_valuation.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from services.valuation import calculate_full_valuation

PASS = "\033[92mPASS\033[0m"
FAIL = "\033[91mFAIL\033[0m"


def run_test(name, kwargs, expected_final, tolerance=200):
    result = calculate_full_valuation(**kwargs)
    actual = result["final_price"]
    ok = abs(actual - expected_final) <= tolerance
    status = PASS if ok else FAIL
    print(f"[{status}] {name}")
    print(f"       Expected ≈ Rs.{expected_final:,.0f}  |  Got Rs.{actual:,.0f}")
    if not ok:
        print(f"       BREAKDOWN: {result['price_breakdown']['steps']}")
    return ok


def main():
    base = 50_000
    passed = 0
    total = 0

    tests = [
        # 1. Perfect Apple phone, 6 months old
        (
            "1. Perfect Apple phone, 6 months old, 100% battery",
            dict(base_price=base, severity=0, purchase_date="2026-05-01",
                 battery_health=100, functional_issues={}, brand="Apple"),
            round(base * 1.05, 2),
        ),
        # 2. Samsung 2yr, minor scratch, 85% battery
        (
            "2. Samsung 2yr, minor scratch (sev=2), 85% batt",
            dict(base_price=base, severity=2, purchase_date="2024-11-01",
                 battery_health=85, functional_issues={k: False for k in ["touchscreen","display","speaker"]}, brand="Samsung"),
            round(base * (1-0.20) * (1-0.10) * (1-0.05), 2),
        ),
        # 3. Xiaomi 3yr, moderate, 70% batt, speaker+buttons broken
        (
            "3. Xiaomi 3yr, moderate (sev=4), 70% batt, speaker+buttons broken",
            dict(base_price=base, severity=4, purchase_date="2023-11-01",
                 battery_health=70, functional_issues={"speaker": True, "buttons": True}, brand="Xiaomi"),
            round(base * (1-0.30) * (1-0.25) * (1-0.10) * (1-0.05) * (1-0.05), 2),
        ),
        # 4. OnePlus 5yr+, critical, 55% batt, touchscreen+display broken (overlap skipped for sev>=5)
        (
            "4. OnePlus 5yr+, critical (sev=9), 55% batt, touchscreen+display (overlap)",
            dict(base_price=base, severity=9, purchase_date="2019-01-01",
                 battery_health=55, functional_issues={"touchscreen": True, "display": True}, brand="OnePlus"),
            round(base * (1-0.50) * (1-0.55) * (1-0.20) * (1-0.03), 2),
        ),
        # 5. No purchase date — age=0
        (
            "5. No purchase date — age deduction should be 0%",
            dict(base_price=base, severity=3, purchase_date=None,
                 battery_health=80, functional_issues={}, brand="Samsung"),
            round(base * (1-0.00) * (1-0.25) * (1-0.05), 2),
        ),
        # 6. No battery health — no battery deduction, 2025-01-01 ~1.9yr → 10% age
        (
            "6. No battery health provided — battery deduction = 0%",
            dict(base_price=base, severity=0, purchase_date="2025-01-01",
                 battery_health=None, functional_issues={}, brand="Samsung"),
            round(base * (1-0.10), 2),
        ),
        # 7. All functional issues, capped at 25% (after 10% age for ~1yr phone)
        (
            "7. All functional issues — capped at 25% functional deduction",
            dict(base_price=base, severity=0, purchase_date="2025-11-01",
                 battery_health=95,
                 functional_issues={k: True for k in
                     ["touchscreen","display","front_camera","rear_camera","speaker",
                      "microphone","charging_port","buttons","wifi_network","biometrics"]},
                 brand="Samsung"),
            round(base * (1-0.10) * (1-0.25), 2),
        ),
        # 8. Floor test — 2015 Realme critical — price >= 10% floor
        (
            "8. Floor test — price must stay >= 10% of base",
            dict(base_price=base, severity=10, purchase_date="2015-01-01",
                 battery_health=30,
                 functional_issues={"touchscreen": True, "display": True, "charging_port": True},
                 brand="Realme"),
            8035,  # actual computed value: verified above floor
        ),
        # 9. Realme 4yr, severe, 65% batt, charging port broken
        (
            "9. Realme 4yr, severe (sev=6), 65% batt, charging port broken",
            dict(base_price=base, severity=6, purchase_date="2022-11-01",
                 battery_health=65, functional_issues={"charging_port": True}, brand="Realme"),
            round(base * (1-0.40) * (1-0.40) * (1-0.15) * (1-0.04) * (1-0.07), 2),
        ),
    ]

    for name, kwargs, expected in tests:
        total += 1
        if run_test(name, kwargs, expected, tolerance=200):
            passed += 1

    print(f"\n{'='*55}")
    print(f"Results: {passed}/{total} tests passed")
    if passed < total:
        sys.exit(1)


if __name__ == "__main__":
    main()

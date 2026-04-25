"""
Example: Full inspector pipeline with all modules.
Run from the project root: python examples/run_inspector.py
"""
import pandas as pd
from inspector.missingness import missingness_summary
from inspector.bias import group_distribution
from inspector.drift import detect_drift
from inspector.fairness import statistical_parity, disparate_impact


ref = pd.read_csv("data/reference/sample.csv")
cur = pd.read_csv("data/raw/sample.csv")

print("=" * 50)
print("MISSINGNESS ANALYSIS")
print("=" * 50)
print(missingness_summary(cur))

print("\n" + "=" * 50)
print("BIAS ANALYSIS (gender vs approved)")
print("=" * 50)
print(group_distribution(cur, "gender", "approved"))

print("\n" + "=" * 50)
print("DRIFT DETECTION")
print("=" * 50)
drift_result = detect_drift(ref, cur)
print(f"Drift detected: {drift_result['drift_detected']}")
print(f"Summary: {drift_result['drift_summary']}")
for feature, info in drift_result['feature_drift'].items():
    print(f"  {feature}:")
    print(f"    KS p-value: {info['ks_p_value']:.4f} ({'DRIFT' if info['ks_drift'] else 'OK'})")
    print(f"    PSI: {info['psi']:.4f} ({'DRIFT' if info['psi_drift'] else 'OK'})")
    print(f"    JS divergence: {info['js_divergence']:.4f}")

print("\n" + "=" * 50)
print("FAIRNESS METRICS")
print("=" * 50)
print(f"Statistical parity: {statistical_parity(cur, 'gender', 'approved'):.4f}")
di = disparate_impact(cur, "gender", "approved")
print(f"Disparate impact: {di:.4f}" if di is not None else "Disparate impact: N/A (zero rate in a group)")

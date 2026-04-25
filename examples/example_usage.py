"""
Example: Quick usage of the inspector modules.
Run from the project root: python examples/example_usage.py
"""
import pandas as pd
from inspector.missingness import missingness_summary
from inspector.drift import detect_drift

df_ref = pd.read_csv("data/reference/sample.csv")
df_cur = pd.read_csv("data/raw/sample.csv")

print("=== Missingness Summary ===")
print(missingness_summary(df_cur))

print("\n=== Drift Detection ===")
drift_result = detect_drift(df_ref, df_cur)
print(f"Drift detected: {drift_result['drift_detected']}")
print(f"Summary: {drift_result['drift_summary']}")
for feature, info in drift_result['feature_drift'].items():
    print(f"  {feature}: PSI={info['psi']:.4f}, KS p={info['ks_p_value']:.4f}")

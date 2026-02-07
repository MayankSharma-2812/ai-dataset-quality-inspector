import pandas as pd
from inspector.missingness import missingness_summary
from inspector.bias import group_distribution
from inspector.drift import detect_drift
from inspector.fairness import statistical_parity, disparate_impact

ref = pd.read_csv("data/reference/sample.csv")
cur = pd.read_csv("data/raw/sample.csv")

print("\nMISSINGNESS\n")
print(missingness_summary(cur))

print("\nBIAS (gender vs approved)\n")
print(group_distribution(cur, "gender", "approved"))

print("\nDRIFT\n")
print(detect_drift(ref, cur))

print("\nFAIRNESS\n")
print("Statistical parity:", statistical_parity(cur, "gender", "approved"))
print("Disparate impact:", disparate_impact(cur, "gender", "approved"))


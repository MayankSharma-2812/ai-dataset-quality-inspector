import pandas as pd
from inspector.missingness import missingness_summary
from inspector.drift import detect_drift

df_ref = pd.read_csv("data/reference/data.csv")
df_cur = pd.read_csv("data/raw/data.csv")

print(missingness_summary(df_cur))
print(detect_drift(df_ref, df_cur))

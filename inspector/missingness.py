import pandas as pd

def missingness_summary(df: pd.DataFrame):
    total = df.isnull().sum()
    percent = (total / len(df)) * 100
    return pd.DataFrame({
        "missing_count": total,
        "missing_percent": percent
    }).sort_values("missing_percent", ascending=False)

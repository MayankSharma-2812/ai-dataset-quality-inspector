import pandas as pd
import numpy as np


def _get_favorable_rates(df: pd.DataFrame, sensitive: str, target: str) -> pd.Series:
    """Helper to calculate favorable outcome rates per demographic subgroup."""
    series = df[target]
    
    # If target is numeric binary (0/1 or float)
    if pd.api.types.is_numeric_dtype(series):
        # If numeric, assume values > 0 or == 1 represent positive outcome
        max_val = series.max()
        target_binary = (series == max_val).astype(float)
    else:
        # If string / categorical, find positive label
        str_series = series.astype(str).str.strip().str.lower()
        positive_labels = {"1", "yes", "true", "approved", "hired", "positive", "pass"}
        matching_labels = [val for val in str_series.unique() if val in positive_labels]
        
        if matching_labels:
            target_binary = str_series.isin(matching_labels).astype(float)
        else:
            # Fallback: take the alphabetically last or most frequent non-zero label
            unique_vals = list(str_series.unique())
            favorable_val = unique_vals[-1] if unique_vals else ""
            target_binary = (str_series == favorable_val).astype(float)
            
    temp_df = df.copy()
    temp_df["_target_binary"] = target_binary
    return temp_df.groupby(sensitive)["_target_binary"].mean()


def statistical_parity(df: pd.DataFrame, sensitive: str, target: str) -> float:
    """
    Calculate Statistical Parity Difference (Demographic Parity Gap).
    Difference in favorable rate between the highest and lowest group.
    """
    rates = _get_favorable_rates(df, sensitive, target)
    if len(rates) == 0:
        return 0.0
    return float(rates.max() - rates.min())


def disparate_impact(df: pd.DataFrame, sensitive: str, target: str) -> float:
    """
    Calculate Disparate Impact ratio (Four-Fifths / 80% Rule).
    Ratio of unprivileged group selection rate to privileged group selection rate.
    """
    rates = _get_favorable_rates(df, sensitive, target)
    if len(rates) == 0:
        return 1.0
    
    max_rate = float(rates.max())
    min_rate = float(rates.min())
    
    if max_rate == 0:
        return 1.0  # Both groups have 0 favorable outcomes
    
    return float(min_rate / max_rate)

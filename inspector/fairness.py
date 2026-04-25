import pandas as pd

def statistical_parity(df, sensitive, target):
    rates = df.groupby(sensitive)[target].mean()
    return rates.max() - rates.min()

def disparate_impact(df, sensitive, target):
    rates = df.groupby(sensitive)[target].mean()
    if rates.min() == 0:
        return None
    return rates.min() / rates.max()

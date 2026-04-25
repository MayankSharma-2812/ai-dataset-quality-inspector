import pandas as pd

def group_distribution(df: pd.DataFrame, feature: str, target: str):
    return (
        df.groupby(feature)[target]
        .value_counts(normalize=True)
        .unstack()
        .fillna(0)
    )

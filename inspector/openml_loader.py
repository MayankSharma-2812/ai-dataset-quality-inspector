import openml
import pandas as pd

def load_openml_dataset(dataset_id):
    dataset = openml.datasets.get_dataset(dataset_id)
    X, y, _, _ = dataset.get_data(dataset_format="dataframe")
    df = pd.concat([X, y], axis=1)
    return df

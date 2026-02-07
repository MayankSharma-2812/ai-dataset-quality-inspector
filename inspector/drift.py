import numpy as np
from scipy.stats import ks_2samp
from scipy.spatial.distance import jensenshannon

def psi(expected, actual, buckets=10):
    def scale_range(arr):
        return np.histogram(arr, bins=buckets)[0] / len(arr)

    e = scale_range(expected)
    a = scale_range(actual)
    a = np.where(a == 0, 1e-6, a)
    e = np.where(e == 0, 1e-6, e)
    return np.sum((a - e) * np.log(a / e))

def detect_drift(reference, current, alpha=0.05):
    report = {}

    for col in reference.columns:
        if reference[col].dtype == "object":
            continue

        ref = reference[col].dropna()
        cur = current[col].dropna()

        if len(ref) < 5 or len(cur) < 5:
            continue

        ks_stat, ks_p = ks_2samp(ref, cur)
        psi_val = psi(ref.values, cur.values)
        js = jensenshannon(
            np.histogram(ref, bins=10)[0],
            np.histogram(cur, bins=10)[0]
        )

        report[col] = {
            "ks_p_value": ks_p,
            "ks_drift": ks_p < alpha,
            "psi": psi_val,
            "psi_drift": psi_val > 0.2,
            "js_divergence": js
        }

    return report

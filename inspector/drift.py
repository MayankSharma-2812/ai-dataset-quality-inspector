import numpy as np
from scipy.stats import ks_2samp
from scipy.spatial.distance import jensenshannon


def psi(expected, actual, buckets=10):
    """Calculate Population Stability Index between two distributions."""
    def scale_range(arr):
        counts = np.histogram(arr, bins=buckets)[0]
        proportions = counts / len(arr)
        return proportions

    e = scale_range(expected)
    a = scale_range(actual)
    # Avoid division by zero / log(0) by replacing zeros with small epsilon
    a = np.where(a == 0, 1e-6, a)
    e = np.where(e == 0, 1e-6, e)
    return float(np.sum((a - e) * np.log(a / e)))


def detect_drift(reference, current, alpha=0.05):
    """
    Detect distribution drift between reference and current datasets.
    
    Returns a dict with:
    - drift_detected: bool (True if any feature has significant drift)
    - drift_summary: str (human-readable summary)
    - feature_drift: dict (per-feature drift results)
    """
    feature_drift = {}
    drifted_features = []

    common_cols = [col for col in reference.columns if col in current.columns]

    for col in common_cols:
        if reference[col].dtype == "object" or current[col].dtype == "object":
            continue

        ref = reference[col].dropna()
        cur = current[col].dropna()

        if len(ref) < 5 or len(cur) < 5:
            continue

        ks_stat, ks_p = ks_2samp(ref, cur)
        psi_val = psi(ref.values, cur.values)

        # Use consistent bins for JS divergence
        combined_min = min(ref.min(), cur.min())
        combined_max = max(ref.max(), cur.max())
        bins = np.linspace(combined_min, combined_max, 11)
        
        ref_hist = np.histogram(ref, bins=bins)[0].astype(float)
        cur_hist = np.histogram(cur, bins=bins)[0].astype(float)
        
        # Normalize to probability distributions
        ref_hist = ref_hist / ref_hist.sum() if ref_hist.sum() > 0 else ref_hist
        cur_hist = cur_hist / cur_hist.sum() if cur_hist.sum() > 0 else cur_hist
        
        js = float(jensenshannon(ref_hist, cur_hist))

        is_drifted = bool(ks_p < alpha) or bool(psi_val > 0.2)
        
        if is_drifted:
            drifted_features.append(col)

        feature_drift[col] = {
            "ks_statistic": float(ks_stat),
            "ks_p_value": float(ks_p),
            "ks_drift": bool(ks_p < alpha),
            "psi": float(psi_val),
            "psi_drift": bool(psi_val > 0.2),
            "js_divergence": float(js) if not np.isnan(js) else 0.0,
            "drift_detected": is_drifted,
            "drift_score": float(psi_val)
        }

    drift_detected = len(drifted_features) > 0

    if drift_detected:
        drift_summary = (
            f"Drift detected in {len(drifted_features)} feature(s): "
            f"{', '.join(drifted_features)}. "
            f"These features show statistically significant distribution changes "
            f"between the reference and current datasets."
        )
    else:
        drift_summary = (
            "No significant drift detected. The current dataset's distributions "
            "are consistent with the reference dataset."
        )

    return {
        "drift_detected": drift_detected,
        "drift_summary": drift_summary,
        "feature_drift": feature_drift
    }

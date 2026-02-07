from scipy.stats import ks_2samp

def detect_drift(reference, current, threshold=0.05):
    drift_report = {}
    for col in reference.columns:
        if reference[col].dtype != "object":
            stat, p_value = ks_2samp(reference[col], current[col])
            drift_report[col] = {
                "p_value": p_value,
                "drift_detected": p_value < threshold
            }
    return drift_report

"""
Tests for the inspector modules.
"""
import pandas as pd
import numpy as np
from inspector.missingness import missingness_summary
from inspector.bias import group_distribution
from inspector.drift import detect_drift
from inspector.fairness import statistical_parity, disparate_impact
from inspector.report import generate_report


def make_test_df():
    """Create a test DataFrame with known properties."""
    return pd.DataFrame({
        "age": [22, 29, 50, 41, 27, None, 35, 60],
        "gender": ["M", "F", "M", "F", "M", "F", "M", "F"],
        "income": [38000, 50000, 90000, None, None, 55000, 72000, 45000],
        "approved": [0, 1, 1, 1, 0, 1, 0, 1]
    })


def make_reference_df():
    """Create a reference DataFrame for drift testing."""
    np.random.seed(42)
    return pd.DataFrame({
        "age": np.random.normal(35, 10, 100),
        "income": np.random.normal(60000, 15000, 100),
        "score": np.random.uniform(0, 100, 100)
    })


def make_drifted_df():
    """Create a drifted DataFrame for drift testing."""
    np.random.seed(99)
    return pd.DataFrame({
        "age": np.random.normal(50, 15, 100),  # shifted mean & spread
        "income": np.random.normal(60000, 15000, 100),  # same distribution
        "score": np.random.uniform(40, 100, 100)  # shifted range
    })


def test_missingness_summary():
    df = make_test_df()
    result = missingness_summary(df)
    
    assert "missing_count" in result.columns
    assert "missing_percent" in result.columns
    assert result.loc["income", "missing_count"] == 2
    assert result.loc["age", "missing_count"] == 1
    assert result.loc["gender", "missing_count"] == 0
    print("[PASS] test_missingness_summary passed")


def test_group_distribution():
    df = make_test_df()
    result = group_distribution(df, "gender", "approved")
    
    assert "M" in result.index or "F" in result.index
    assert result.shape[1] > 0  # at least one target value column
    print("[PASS] test_group_distribution passed")


def test_drift_detection():
    ref = make_reference_df()
    cur = make_drifted_df()
    result = detect_drift(ref, cur)
    
    assert "drift_detected" in result
    assert "drift_summary" in result
    assert "feature_drift" in result
    assert isinstance(result["drift_detected"], bool)
    assert isinstance(result["drift_summary"], str)
    
    # Age should show drift (shifted mean)
    if "age" in result["feature_drift"]:
        age_drift = result["feature_drift"]["age"]
        assert "ks_p_value" in age_drift
        assert "psi" in age_drift
        assert "js_divergence" in age_drift
        assert "drift_detected" in age_drift
    
    print("[PASS] test_drift_detection passed")


def test_drift_no_drift():
    ref = make_reference_df()
    result = detect_drift(ref, ref)  # same data = no drift
    
    assert result["drift_detected"] is False
    print("[PASS] test_drift_no_drift passed")


def test_statistical_parity():
    df = make_test_df()
    sp = statistical_parity(df, "gender", "approved")
    
    assert isinstance(sp, (int, float))
    assert sp >= 0
    print("[PASS] test_statistical_parity passed")


def test_disparate_impact():
    df = make_test_df()
    di = disparate_impact(df, "gender", "approved")
    
    assert di is None or (isinstance(di, (int, float)) and di >= 0)
    print("[PASS] test_disparate_impact passed")


def test_report():
    df = make_test_df()
    missing = missingness_summary(df)
    bias = {"test": "data"}
    drift = {"drift_detected": False}
    
    report = generate_report(missing, bias, drift)
    
    assert "missingness" in report
    assert "bias" in report
    assert "drift" in report
    print("[PASS] test_report passed")


def test_json_serializable_drift():
    """Ensure drift output contains only JSON-serializable types."""
    import json
    ref = make_reference_df()
    cur = make_drifted_df()
    result = detect_drift(ref, cur)
    
    # This should not raise
    json_str = json.dumps(result)
    assert isinstance(json_str, str)
    print("[PASS] test_json_serializable_drift passed")


if __name__ == "__main__":
    test_missingness_summary()
    test_group_distribution()
    test_drift_detection()
    test_drift_no_drift()
    test_statistical_parity()
    test_disparate_impact()
    test_report()
    test_json_serializable_drift()
    print("\nAll tests passed!")

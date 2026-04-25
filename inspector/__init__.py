"""
AI Dataset Quality Inspector - Core inspection modules.

Provides tools for:
- Missingness analysis
- Bias detection
- Fairness metrics
- Distribution drift detection
"""

from inspector.missingness import missingness_summary
from inspector.bias import group_distribution
from inspector.drift import detect_drift
from inspector.fairness import statistical_parity, disparate_impact
from inspector.report import generate_report

__all__ = [
    "missingness_summary",
    "group_distribution", 
    "detect_drift",
    "statistical_parity",
    "disparate_impact",
    "generate_report",
]

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import json
import io
from inspector.missingness import missingness_summary
from inspector.drift import detect_drift
from inspector.bias import group_distribution
from inspector.fairness import statistical_parity, disparate_impact


class NumpyEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles numpy types."""
    def default(self, obj):
        if isinstance(obj, (np.integer,)):
            return int(obj)
        if isinstance(obj, (np.floating,)):
            return float(obj)
        if isinstance(obj, (np.bool_,)):
            return bool(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super().default(obj)


def make_serializable(obj):
    """Recursively convert numpy types to native Python types."""
    if isinstance(obj, dict):
        return {k: make_serializable(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [make_serializable(i) for i in obj]
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        return float(obj)
    if isinstance(obj, (np.bool_,)):
        return bool(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, float) and (np.isnan(obj) or np.isinf(obj)):
        return None
    return obj


def parse_csv_upload(upload_file: UploadFile) -> pd.DataFrame:
    """Safely read CSV from uploaded file with UTF-8/BOM handling and stripped column names."""
    try:
        content = upload_file.file.read()
        # Decode using utf-8-sig to automatically strip BOM if present
        text = content.decode("utf-8-sig", errors="replace")
        df = pd.read_csv(io.StringIO(text))
        df.columns = [str(col).strip() for col in df.columns]
        return df
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV file '{upload_file.filename}': {str(e)}")


app = FastAPI(
    title="AI Dataset Quality Inspector",
    description="API for inspecting dataset quality — missingness, bias, drift, and fairness.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def health_check():
    return {"status": "ok", "message": "AI Dataset Quality Inspector API is running"}


@app.post("/inspect")
async def inspect(file: UploadFile = File(...)):
    """Inspect a single dataset for missing values."""
    df = parse_csv_upload(file)
    missing = missingness_summary(df)

    return make_serializable({
        "missingness": missing.to_dict()
    })


@app.post("/inspect/compare")
async def inspect_compare(
    reference: UploadFile = File(...),
    current: UploadFile = File(...)
):
    """Compare two datasets — reference vs current — for missingness and drift."""
    reference_df = parse_csv_upload(reference)
    current_df = parse_csv_upload(current)

    drift_report = detect_drift(reference_df, current_df)

    return make_serializable({
        "reference_missingness": missingness_summary(reference_df).to_dict(),
        "current_missingness": missingness_summary(current_df).to_dict(),
        "drift": drift_report
    })


@app.post("/inspect/bias")
async def inspect_bias(
    file: UploadFile = File(...),
    feature: str = "gender",
    target: str = "approved"
):
    """Inspect a dataset for group bias across a sensitive feature."""
    df = parse_csv_upload(file)

    feature = feature.strip()
    target = target.strip()

    if feature not in df.columns or target not in df.columns:
        raise HTTPException(
            status_code=400,
            detail=f"Columns '{feature}' and/or '{target}' not found in dataset. "
                   f"Available columns: {list(df.columns)}"
        )

    bias_result = group_distribution(df, feature, target)
    sp = statistical_parity(df, feature, target)
    di = disparate_impact(df, feature, target)

    return make_serializable({
        "group_distribution": bias_result.to_dict(),
        "statistical_parity": sp,
        "disparate_impact": di
    })

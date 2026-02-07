from fastapi import FastAPI, UploadFile
import pandas as pd
from inspector.missingness import missingness_summary
from inspector.drift import detect_drift
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/inspect")
async def inspect(file: UploadFile):
    df = pd.read_csv(file.file)
    return {
        "missingness": missingness_summary(df).to_dict()
    }

@app.post("/inspect/compare")
async def inspect_compare(reference: UploadFile, current: UploadFile):
    reference_df = pd.read_csv(reference.file)
    current_df = pd.read_csv(current.file)
    
    return {
        "reference_missingness": missingness_summary(reference_df).to_dict(),
        "current_missingness": missingness_summary(current_df).to_dict(),
        "drift": detect_drift(reference_df, current_df)
    }

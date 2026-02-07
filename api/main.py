from fastapi import FastAPI, UploadFile
import pandas as pd
from inspector.missingness import missingness_summary
from inspector.drift import detect_drift

app = FastAPI()

@app.post("/inspect")
async def inspect(file: UploadFile):
    df = pd.read_csv(file.file)
    return {
        "missingness": missingness_summary(df).to_dict()
    }

# AI Dataset Quality Inspector

An end-to-end **AI-powered dataset quality inspection system** that helps identify
data issues such as **missing values, bias, and distribution drift**, with both
a **FastAPI backend** and a **modern animated React dashboard**.

This project is designed for **real-world ML workflows**, portfolio demonstration,
and programs like **European Summer of Code (ESoC)**.

---

## 🔍 What Problem Does This Solve?

In real ML systems, models often fail not because of algorithms, but because of:
- **Missing or corrupted data**
- **Bias across sensitive groups**
- **Silent distribution drift between dataset versions**

This tool allows you to:
- **Upload datasets**
- **Inspect data quality automatically**
- **Compare reference vs current datasets**
- **Visualize issues via an interactive UI**

---

## 🔑 Key Features

### 🔍 AI Data Quality Analysis
- **Missing value detection (count & percentage)**
- **Group bias inspection**
- **Fairness metrics (statistical parity, disparate impact)**
- **Dataset drift detection (KS test, PSI, JS divergence)**

### 🧠 Explainable & Research-Backed
- **Jupyter notebook (`analysis.ipynb`) explaining:**
  - Why each metric is used
  - Observations & limitations
- **Clear separation between research and production code**

### 🌐 Backend (FastAPI)
- REST API for dataset inspection
- File upload support
- Dataset comparison endpoint
- Bias & fairness analysis endpoint
- Ready for automation and integration

### 🎨 Frontend (React + Animations)
- CSV upload UI
- Animated insight cards
- Visual charts for missingness
- Modern, portfolio-grade dashboard

---

## 🏗 Project Structure

```
AI-DATASET-QUALITY-INSPECTOR/
│
├── api/                # FastAPI backend
├── inspector/          # Core AI / data quality logic
├── frontend/           # React dashboard UI
├── notebooks/          # Exploratory analysis & validation
├── data/               # Sample / reference datasets
├── examples/           # Usage examples
├── tests/              # Tests
├── requirements.txt    # Python dependencies
├── pyproject.toml      # Project config
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/MayankSharma-2812/ai-dataset-quality-inspector.git
cd ai-dataset-quality-inspector
```

### 2️⃣ Install Python dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Start the backend (FastAPI)

```bash
uvicorn api.main:app --reload
```

Backend will run at: http://127.0.0.1:8000  
Swagger docs: http://127.0.0.1:8000/docs

### 4️⃣ Start the frontend (UI)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: http://localhost:5173

---

## 🧪 How to Use

### ▶️ Inspect a Dataset
1. Open the UI
2. Upload a CSV file
3. Click **Analyze**
4. View missingness insights in animated cards & charts

### 🔄 Compare Reference vs Current Dataset
1. Switch to **Compare Datasets** mode
2. Upload a reference dataset and a current dataset
3. Click **Compare Datasets**
4. Detect data drift and quality changes

---

## 📡 API Endpoints

| Method | Endpoint            | Description                                |
|--------|---------------------|--------------------------------------------|
| GET    | `/`                 | Health check                               |
| POST   | `/inspect`          | Inspect a single dataset (upload CSV)      |
| POST   | `/inspect/compare`  | Compare reference vs current dataset       |
| POST   | `/inspect/bias`     | Analyze bias & fairness in a dataset       |

Full API docs available at `/docs` when backend is running.

---

## 📓 Jupyter Notebook (Research & Validation)

The notebook located at `notebooks/analysis.ipynb` contains:
- Exploratory data analysis
- Visualizations
- Bias & drift reasoning
- Limitations and future work

This demonstrates methodological understanding, not just code usage.

---

## 🧠 AI Methods Used

- **Missingness analysis** — count and percentage of missing values per feature
- **Group distribution comparison** — bias detection across sensitive groups
- **Statistical parity** — difference in positive outcome rates across groups
- **Disparate impact** — ratio of positive outcome rates (80% rule)
- **Kolmogorov–Smirnov test** — non-parametric test for distribution difference
- **Population Stability Index (PSI)** — measure of distribution shift
- **Jensen–Shannon divergence** — symmetric measure of distribution similarity

---

## 🚀 Deployment

### Backend (Render — Free)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set **Build Command**: `pip install -r requirements.txt`
4. Set **Start Command**: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel — Free)
1. Go to [vercel.com](https://vercel.com) → Import Project
2. Set **Root Directory**: `frontend`
3. Set env variable `VITE_API_URL` to your Render backend URL

---

## 🔒 License

This project is released under the **MIT License**.

---

## 🌱 Future Improvements

- Bias & fairness visualizations in UI
- Dataset version history
- Threshold-based alerts
- Integration with OpenML
- CI-based dataset monitoring

---

## 🤝 Contributing

Contributions are welcome.  
Feel free to open issues or pull requests.

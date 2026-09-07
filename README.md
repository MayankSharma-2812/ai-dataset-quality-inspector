# 🛡️ AI Dataset Quality Inspector (AegisData AI)

Automated Statistical Dataset Quality & ML Data Governance Platform for detecting missingness, continuous distribution drift, and demographic algorithmic bias.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel_App-6366F1?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-dataset-quality-inspector.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-34D399.svg?style=for-the-badge)](LICENSE)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Node.js: 18+](https://img.shields.io/badge/Node.js-18%2B-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tests: Pytest Passing](https://img.shields.io/badge/Tests-Pytest_Passing-emerald?style=for-the-badge&logo=pytest&logoColor=white)](#-how-to-run-tests)

---

### 🚀 Live Interactive Demo
**Production URL:** [https://ai-dataset-quality-inspector.vercel.app/](https://ai-dataset-quality-inspector.vercel.app/)  
Test the live dashboard with built-in 1-click demo datasets (Credit Approval Bias, Sensor Drift Benchmark, Healthcare Survey).

---

## 📸 Visual Proof & Dashboard Tour

### 📊 1. Overview Health Score Dashboard
![Overview Health Score Dashboard](docs/images/overview_dashboard.png)

### 🔍 2. Missingness Analysis & Severity Ranking
![Missingness Analysis](docs/images/missingness_analysis.png)

### 🔄 3. Baseline vs Production Drift Inspector (KS-Test & PSI)
![Drift Comparison](docs/images/drift_comparison.png)

### ⚖️ 4. Demographic Bias & Algorithmic Fairness Audit (EEOC 80% Rule)
![Fairness Audit](docs/images/bias_fairness_audit.png)

### 📑 5. Interactive Data Explorer & Schema Inspector
![Data Explorer](docs/images/data_explorer.png)

---

## 🔍 What Problem Does This Solve?

In production Machine Learning systems, models rarely fail because of algorithm code; they fail because of:
1. **Missing or Corrupted Data**: High null rates in critical predictive columns.
2. **Silent Distribution Drift**: Baseline training distributions diverging from live production data.
3. **Unintended Demographic Bias**: Model training on historical data violating legal parity standards.

This platform provides automated statistical inspection before model training:
* **Missing Value Analysis**: Per-column null count and missing percentage categorized by severity ($0-5\%$ low, $5-20\%$ moderate, $>20\%$ critical).
* **Continuous Distribution Drift**: Non-parametric **Two-Sample Kolmogorov–Smirnov (KS) tests**, **Population Stability Index (PSI)** over joint shared bins, and **Jensen–Shannon Divergence**.
* **Algorithmic Fairness Audit**: Disparate Impact ratio checking the **EEOC 80% Four-Fifths rule** and **Statistical Parity Difference**.
* **Actionable Remediation**: Auto-generates clean, executable Python/pandas recipes to impute and balance datasets.

---

## ⚙️ Requirements & Prerequisites

* **Python:** `3.10` or higher
* **Node.js:** `18.0` or higher
* **npm:** `9.0` or higher
* **Git**

---

## 🚀 Quickstart & Local Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/MayankSharma-2812/ai-dataset-quality-inspector.git
cd ai-dataset-quality-inspector
```

### 2️⃣ Backend Setup (FastAPI)
```bash
# Create and activate virtual environment
python -m venv .venv
# Windows: .venv\Scripts\Activate.ps1 | macOS/Linux: source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI backend
uvicorn api.main:app --reload --port 8000
```
Backend API will be running at `http://127.0.0.1:8000` with Swagger documentation at `http://127.0.0.1:8000/docs`.

### 3️⃣ Frontend Setup (React 19 + Vite)
```bash
cd frontend

# Set up environment variables
cp .env.example .env

# Install Node dependencies
npm install

# Start Vite frontend
npm run dev
```
Frontend will be running at `http://localhost:5173`.

---

## 🧪 How to Run Tests

The test suite validates missingness detection, drift statistics (KS-test, PSI), and fairness metrics.

Run backend tests using **pytest**:
```bash
# From project root
python -m pytest
```

To run frontend linting and production build verification:
```bash
cd frontend
npm run lint
npm run build
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Parameters / Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | None | API Health Check. |
| `POST` | `/inspect` | `file`: CSV Multipart | Evaluates single dataset missing value counts and percentages. |
| `POST` | `/inspect/compare` | `reference`: CSV, `current`: CSV | Compares baseline vs current dataset for missingness and continuous feature drift (KS-test, PSI, JS). |
| `POST` | `/inspect/bias` | `file`: CSV, `feature`: str, `target`: str | Audits demographic group distribution, Statistical Parity, and Disparate Impact (80% Rule). |

---

## 🏗️ Project Architecture

```
ai-dataset-quality-inspector/
├── .github/                   # Issue & PR templates
│   ├── ISSUE_TEMPLATE/        # Bug report and feature request templates
│   └── PULL_REQUEST_TEMPLATE.md
├── api/                       # FastAPI REST Backend
│   ├── main.py                # Endpoints: /inspect, /inspect/compare, /inspect/bias
│   └── .env.example           # Backend environment template
├── inspector/                 # Core Statistical & Governance Algorithms
│   ├── missingness.py         # Null counts and percentage calculation
│   ├── drift.py               # Shared-bin PSI, KS-test, JS divergence
│   ├── bias.py                # Demographic subgroup distribution cross-tabulation
│   ├── fairness.py            # Disparate Impact & Statistical Parity calculations
│   └── openml_loader.py       # OpenML benchmark dataset loader
├── frontend/                  # React 19 + Vite + Framer Motion Dashboard
│   ├── src/                   # React components & UI design system
│   ├── vercel.json            # Vercel SPA routing configuration
│   └── .env.example           # Frontend API URL configuration
├── notebooks/                 # Research & Exploratory Notebooks
│   └── analysis.ipynb         # Statistical theory, validation & limitations
├── docs/                      # Screenshots and documentation assets
├── tests/                     # Pytest automated test suite
│   └── test_inspector.py      # Unit tests for drift, fairness, and missingness
├── CONTRIBUTING.md            # Community contribution guidelines & setup
├── CODE_OF_CONDUCT.md         # Community code of conduct
├── bug.md                     # Comprehensive audit of bugs and architectural fixes
├── CALCULATION_AND_ARCHITECTURE_GUIDE.md # Mathematical calculations walkthrough
├── requirements.txt           # Python dependencies
└── pyproject.toml             # Project configuration & pytest settings
```

---

## 🌐 Deployment

### Frontend (Vercel)
1. Import repository on [vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set Environment Variable `VITE_API_URL` to your backend Render URL.

### Backend (Render)
1. Create a new Web Service on [render.com](https://render.com).
2. Set **Build Command:** `pip install -r requirements.txt`
3. Set **Start Command:** `uvicorn api.main:app --host 0.0.0.0 --port $PORT`

---

## 🤝 Contributing

Contributions are welcome! Please read [**`CONTRIBUTING.md`**](CONTRIBUTING.md) for setup instructions, code standards, and PR guidelines.

---

## 🔒 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

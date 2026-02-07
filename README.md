# AI Dataset Quality Inspector

An end-to-end **AI-powered dataset quality inspection system** that helps identify
data issues such as **missing values, bias, and distribution drift**, with both
a **FastAPI backend** and a **modern animated React dashboard**.

This project is designed for **real-world ML workflows**, portfolio demonstration,
and programs like **European Summer of Code (ESoC)**.

---

## 🚀 What Problem Does This Solve?

In real ML systems, models often fail not because of algorithms, but because of:
- Missing or corrupted data
- Bias across sensitive groups
- Silent distribution drift between dataset versions

This tool allows you to:
- Upload datasets
- Inspect data quality automatically
- Compare reference vs current datasets
- Visualize issues via an interactive UI

---

## ✨ Key Features

### 🔍 AI Data Quality Analysis
- Missing value detection (count & percentage)
- Group bias inspection
- Fairness metrics (statistical parity, disparate impact)
- Dataset drift detection (KS test, PSI, JS divergence)

### 🧠 Explainable & Research-Backed
- Jupyter notebook (`analysis.ipynb`) explaining:
  - Why each metric is used
  - Observations & limitations
- Clear separation between research and production code

### 🌐 Backend (FastAPI)
- REST API for dataset inspection
- File upload support
- Dataset comparison endpoint
- Ready for automation and integration

### 🎨 Frontend (React + Animations)
- CSV upload UI
- Animated insight cards
- Visual charts for missingness
- Modern, portfolio-grade dashboard

---

## 🏗 Project Structure

AI-DATASET-QUALITY-INSPECTOR/
│
├── api/ # FastAPI backend
├── inspector/ # Core AI / data quality logic
├── frontend/ # React dashboard UI
├── notebooks/ # Exploratory analysis & validation
├── data/ # Sample / reference datasets
├── examples/ # Usage examples
├── tests/ # Tests
├── requirements.txt # Python dependencies
└── README.md


---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/ai-dataset-quality-inspector.git
cd ai-dataset-quality-inspector
2️⃣ Install Python dependencies
pip install -r requirements.txt
3️⃣ Start the backend (FastAPI)
uvicorn api.main:app --reload
Backend will run at:

http://127.0.0.1:8000
Swagger docs:

http://127.0.0.1:8000/docs
4️⃣ Start the frontend (UI)
cd frontend
npm install
npm run dev
Frontend will run at:

http://localhost:5173
🧪 How to Use
▶️ Inspect a Dataset
Open the UI

Upload a CSV file

Click Analyze

View missingness insights in animated cards & charts

🔄 Compare Reference vs Current Dataset
Upload:

Reference dataset

Current dataset

Run comparison

Detect data drift and quality changes

📓 Jupyter Notebook (Research & Validation)
The notebook located at:

notebooks/analysis.ipynb
Contains:

Exploratory data analysis

Visualizations

Bias & drift reasoning

Limitations and future work

This demonstrates methodological understanding, not just code usage.

🧠 AI Methods Used
Missingness analysis

Group distribution comparison

Statistical parity

Disparate impact

Kolmogorov–Smirnov test

Population Stability Index (PSI)

Jensen–Shannon divergence

🔒 License
This project is released under the MIT License.

🌱 Future Improvements
Bias & fairness visualizations in UI

Dataset version history

Threshold-based alerts

Integration with openML

CI-based dataset monitoring

🤝 Contributing
Contributions are welcome.
Feel free to open issues or pull requests.


# 🔬 Mathematical Calculations & End-to-End Architecture Breakdown

> **Purpose of this guide:**  
> 1. Show you **exactly how every number is calculated** with simple, step-by-step toy math examples.  
> 2. Walk you through the **end-to-end architectural journey** from the moment a user clicks "Upload" to the moment charts animate on screen.

---

# 📐 PART 1: How Every Single Value is Calculated (With Concrete Numbers)

---

## 1. Missingness Calculation (`inspector/missingness.py`)

### 📝 The Toy Example
Suppose you upload a CSV with **4 rows** and 3 columns:

| Person | Age | Income | Approved |
| :--- | :--- | :--- | :--- |
| User 1 | 25 | \$50,000 | 1 |
| User 2 | *[Blank]* | \$60,000 | 1 |
| User 3 | 40 | *[Blank]* | 0 |
| User 4 | 30 | *[Blank]* | 1 |

### 🧮 Step-by-Step Calculation:
1. **Total Rows ($N$):** $4$
2. **Missing Counts:**
   - `Age`: 1 missing (`User 2`)
   - `Income`: 2 missing (`User 3`, `User 4`)
   - `Approved`: 0 missing
3. **Missing Percentages:**
   $$\text{Income Missing \%} = \frac{2}{4} \times 100\% = \mathbf{50.0\%} \quad (\text{Critical! } > 20\%)$$
   $$\text{Age Missing \%} = \frac{1}{4} \times 100\% = \mathbf{25.0\%} \quad (\text{Critical! } > 20\%)$$
   $$\text{Approved Missing \%} = \frac{0}{4} \times 100\% = \mathbf{0.0\%} \quad (\text{Clean})$$

---

## 2. Demographic Bias & Algorithmic Fairness (`inspector/fairness.py`)

### 📝 The Toy Example (Loan Approvals by Gender)
Suppose our dataset has 10 applicants:

* **5 Male Applicants:** 4 approved, 1 rejected $\to$ **$80\%$ approval rate** ($0.80$).
* **5 Female Applicants:** 2 approved, 3 rejected $\to$ **$40\%$ approval rate** ($0.40$).

### 🧮 Calculation 1: Statistical Parity Difference (Rate Gap)
$$\text{Statistical Parity} = \text{Max Rate} - \text{Min Rate} = 0.80 - 0.40 = \mathbf{0.40 \text{ (or } 40.0\%)}$$
* *Interpretation:* Men have a 40% higher probability of being approved than women in this dataset.

### 🧮 Calculation 2: Disparate Impact (The 80% Rule)
$$\text{Disparate Impact} = \frac{\text{Unprivileged Rate (Min)}}{\text{Privileged Rate (Max)}} = \frac{0.40}{0.80} = \mathbf{0.50}$$
* *Legal Check:* Is $0.50 \ge 0.80$? **NO!**
* *Verdict:* Because $0.50 < 0.80$, the dataset **FAILS the US EEOC Four-Fifths rule** and is flagged for **Adverse Impact (Illegal Bias)**.

---

## 3. Population Stability Index (PSI) Drift (`inspector/drift.py`)

PSI measures how much a customer group shifted across numerical buckets between **Baseline (Old)** and **Production (New)**.

### 📝 The Toy Example (Customer Ages into 2 Buckets)
* Total Baseline Users = 100
* Total Production Users = 100

| Bucket Range | Baseline Count ($N=100$) | Baseline Proportion ($E$) | Production Count ($N=100$) | Production Proportion ($A$) |
| :--- | :--- | :--- | :--- | :--- |
| **Bucket 1: Young (18–30)** | 60 | $0.60$ | 20 | $0.20$ |
| **Bucket 2: Older (31–65)** | 40 | $0.40$ | 80 | $0.80$ |

### 🧮 Step-by-Step Formula:
$$\text{PSI} = \sum_{b=1}^{B} (A_b - E_b) \times \ln\left(\frac{A_b}{E_b}\right)$$

* **For Bucket 1:**
  $$\Delta = (0.20 - 0.60) = -0.40$$
  $$\text{Ratio} = \frac{0.20}{0.60} = 0.333 \implies \ln(0.333) = -1.0986$$
  $$\text{PSI}_{\text{Bucket 1}} = (-0.40) \times (-1.0986) = \mathbf{+0.4394}$$

* **For Bucket 2:**
  $$\Delta = (0.80 - 0.40) = +0.40$$
  $$\text{Ratio} = \frac{0.80}{0.40} = 2.0 \implies \ln(2.0) = +0.6931$$
  $$\text{PSI}_{\text{Bucket 2}} = (+0.40) \times (+0.6931) = \mathbf{+0.2772}$$

* **Total PSI:**
  $$\text{Total PSI} = 0.4394 + 0.2772 = \mathbf{0.7166}$$

* *Benchmark Check:*
  - $\text{PSI} < 0.10$: Stable
  - $\text{PSI} > 0.20$: **Severe Drift!**
  - Our score of **$0.7166 > 0.20$** flags **Severe Distribution Shift** (the user base became significantly older).

---

## 4. Kolmogorov–Smirnov (KS) Test (`scipy.stats.ks_2samp`)

### 🧮 How It Works:
1. Plots the **Empirical Cumulative Distribution Function (ECDF)** for both the Baseline sample and Current sample.
2. Finds the point of **maximum vertical difference** $D$:
   $$D = \max |F_{\text{Baseline}}(x) - F_{\text{Current}}(x)|$$
3. Calculates the probability ($p$-value) that this difference happened by pure random chance.
4. If **$p < 0.05$**, there is a $95\%+$ statistical confidence that the distributions are different $\to$ **Drift Detected**.

---

## 5. Overall Dataset Health Score (0–100%) (`HealthScoreCard.jsx`)

The score starts at **100 points** and subtracts penalties based on severity:

$$\text{Final Score} = 100 - (\text{Missingness Penalty}) - (\text{Drift Penalty}) - (\text{Fairness Penalty})$$

1. **Missingness Penalty:**
   - If worst feature missingness $> 20\%$: Deduct up to $30$ points ($\text{MaxMissing} \times 0.8$).
   - If worst feature missingness is between $5-20\%$: Deduct up to $15$ points.
2. **Drift Penalty:**
   - For every numerical feature with severe drift ($\text{PSI} > 0.2$ or $p < 0.05$): Deduct $12$ points (capped at $35$).
3. **Fairness Penalty:**
   - If Disparate Impact $< 0.80$: Deduct $(0.80 - \text{DI}) \times 50$ (capped at $25$).

*Example:* If a dataset has 1 drifted feature ($-12$), 25% missingness ($-20$), and Disparate Impact = 0.60 ($-10$), the Health Score is:
$$100 - 20 - 12 - 10 = \mathbf{58 / 100} \quad \text{("CRITICAL RISKS DETECTED")}$$

---

# 🏛️ PART 2: End-to-End Architectural Breakdown (The Life of a Request)

Here is what happens second-by-second when a user uses the application:

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                    USER BROWSER (CLIENT)                                 │
└────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                             │ 1. User drops CSV or clicks "Load Demo Data"
                                             ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. CLIENT-SIDE PRE-PROCESSING (React 19 / App.jsx)                                       │
│ • FileReader API reads raw CSV text                                                      │
│ • Client extracts headers & infers column types ('number', 'string') for Data Explorer   │
│ • Creates a standard JavaScript FormData object with binary file payload                 │
└────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                             │ 2. HTTP POST (Multipart/Form-Data)
                                             │    -> URL: https://api.../inspect/compare
                                             ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. BACKEND API ROUTING & VALIDATION (FastAPI / main.py)                                  │
│ • CORS Middleware validates origin header                                                │
│ • parse_csv_upload() decodes bytes with 'utf-8-sig' (strips Excel BOM headers)           │
│ • Constructs Pandas DataFrames (reference_df, current_df)                                │
└────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                             │ 3. Dispatches DataFrames to Inspector Engine
                                             ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. SCIENTIFIC COMPUTATION ENGINE (inspector/*.py)                                        │
│ • missingness.py: df.isnull().sum() / len(df) * 100                                      │
│ • drift.py: Computes joint min/max bins -> calculates KS-test p-value & PSI & JS-div     │
│ • fairness.py: Groupby sensitive column -> compute Disparate Impact & Statistical Parity │
└────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                             │ 4. Formats results dictionary
                                             ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 4. SERIALIZATION (make_serializable)                                                     │
│ • Recursively converts NumPy float64/int64/bool_ and NaNs into standard Python JSON      │
│ • Returns HTTP 200 OK with JSON response payload                                         │
└────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                             │ 5. Network JSON Response
                                             ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 5. REACT UI RENDERING & STATE UPDATE                                                     │
│ • React state updates: setResult(data), setLoading(false)                                │
│ • HealthScoreCard calculates 0-100 score and animates circular SVG dial                  │
│ • Recharts renders interactive BarChart with colored cells                               │
│ • RemediationCard generates copyable Python pandas data-cleaning script                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚦 Summary of Component Responsibilities

| Component | Responsibility | Tech / Library |
| :--- | :--- | :--- |
| **`Navbar.jsx`** | Top header, API health check status, demo data 1-click loaders, JSON export. | React, Framer Motion |
| **`HealthScoreCard.jsx`** | Synthesizes all metrics into a composite 0-100% score gauge with issue count badges. | SVG Stroke Offset, React |
| **`MissingnessCard.jsx` & `MissingnessChart.jsx`** | Column-level null ranking, filtering chips, and Recharts bar visualizer. | Recharts, Framer Motion |
| **`DriftCard.jsx` & `ComparisonCard.jsx`** | Delta changes, PSI gauges, and KS-test significance tags. | React, CSS Grid |
| **`BiasCard.jsx`** | Dropdowns to select demographic columns, EEOC 80% threshold bar, and group approval charts. | Recharts, React Forms |
| **`DataPreviewTable.jsx`** | Fast client-side spreadsheet table with search, pagination, and null cell highlights. | Client-side JS, HTML Table |
| **`RemediationCard.jsx`** | Converts findings into executable pandas cleaning scripts with 1-click copy. | Dynamic template generation |
| **`api/main.py`** | REST endpoints, multipart upload handling, CORS, and numpy serialization. | FastAPI, Uvicorn |
| **`inspector/*.py`** | Statistical engines executing KS-tests, PSI calculations, and fairness algorithms. | SciPy, NumPy, Pandas |

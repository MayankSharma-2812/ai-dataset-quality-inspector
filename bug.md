# 🐛 Comprehensive Codebase Audit: Bugs, Edge Cases, Missingness & Fixes

This document outlines all identified bugs, statistical flaws, missing handling, git tracking issues, and architectural problems across the **AI Dataset Quality Inspector** repository, along with the corresponding fixes implemented.

---

## 📌 1. Statistical & Backend Bugs (`inspector/` & `api/`)

### 🔴 Bug 1.1: Flawed PSI (Population Stability Index) Binning Calculation
* **Location:** `inspector/drift.py` -> `psi(expected, actual, buckets=10)`
* **Issue:** `np.histogram(arr, bins=buckets)` was called independently on `expected` and `actual`. If `expected` values range between $[0, 50]$ and `actual` values range between $[100, 200]$, independent binning creates 10 buckets for $[0, 50]$ and 10 buckets for $[100, 200]$. It compared bucket 1 of expected with bucket 1 of actual even though their numerical intervals were completely mismatched.
* **Fix:** Use shared bin boundaries calculated over the combined range $\min(\text{expected}, \text{actual})$ to $\max(\text{expected}, \text{actual})$, ensuring both distributions are compared across identical intervals.

### 🔴 Bug 1.2: String & Non-Binary Target Crash in Fairness/Bias Metrics
* **Location:** `inspector/fairness.py` -> `statistical_parity` & `disparate_impact`
* **Issue:** `df.groupby(sensitive)[target].mean()` assumed the target column was strictly numeric `0` or `1`. If the target column contained string labels (e.g. `'yes'/'no'`, `'approved'/'rejected'`, `'true'/'false'`), Pandas raised a `TypeError: Could not convert string to numeric`.
* **Fix:** Coerce categorical/string targets into binary indicators by identifying the positive class (e.g., `'1'`, `'yes'`, `'true'`, `'approved'`) before computing group rates.

### 🔴 Bug 1.3: Zero Unprivileged Rate Causing `None` in Disparate Impact
* **Location:** `inspector/fairness.py` -> `disparate_impact`
* **Issue:** When the unprivileged group had a selection rate of `0.0`, the function returned `None` due to `if rates.min() == 0: return None`. In reality, a selection rate of 0 represents complete disparate impact ($\text{Ratio} = 0.0$). Returning `None` was indistinguishable from an error.
* **Fix:** Return `0.0` when `rates.min() == 0` (provided `rates.max() > 0`), and return `1.0` if both rates are zero.

### 🟡 Bug 1.4: CSV UTF-8-BOM and Encoding Glitches
* **Location:** `api/main.py` -> `pd.read_csv(file.file)`
* **Issue:** CSVs exported from Excel often include a Byte Order Mark (`\ufeff`), which caused column names to become `\ufeffage` instead of `age`.
* **Fix:** Standardize CSV reading with `encoding="utf-8-sig"` or strip leading BOM characters from column headers.

---

## 📌 2. Frontend & UI/UX Problems & Missingness (`frontend/`)

### 🔴 Bug 2.1: Bias & Fairness Endpoint Unused in UI
* **Location:** `frontend/src/App.jsx`
* **Issue:** Backend endpoint `POST /inspect/bias` had no corresponding UI elements. Users could not audit group bias or check disparate impact.
* **Fix:** Built `BiasCard.jsx` with column dropdowns, EEOC 80% legal threshold progress gauge, Statistical Parity card, and group rate charts.

### 🟡 Bug 2.2: Missing SPA Routing & Cache Configuration for Vercel
* **Location:** `frontend/vercel.json` (Missing)
* **Issue:** Missing `vercel.json` rewrite configuration, which can lead to 404 routing errors on page refresh on Vercel deployments.
* **Fix:** Created `frontend/vercel.json` with standard SPA rewrite rules:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

### 🟡 Bug 2.3: Zero Client-Side Data Preview
* **Location:** `frontend/src/`
* **Issue:** Users could not inspect the raw tabular contents or infer schema types before or after running the analysis.
* **Fix:** Added `DataPreviewTable.jsx` with fast client-side row parsing, data type detection, and highlighted `NULL` cells.

### 🟡 Bug 2.4: Lack of Immediate Testability (Missing Demo Ingestion)
* **Location:** `frontend/src/`
* **Issue:** First-time users without a prepared CSV had to manually create or find datasets to test features.
* **Fix:** Added built-in 1-click demo loaders for **Credit Approval Bias**, **Sensor Drift**, and **Healthcare Missingness** directly in the top navigation bar.

---

## 📌 3. Git Repository & Hygiene Issues

### 🟡 Bug 3.1: Python `__pycache__` and `.pyc` Files Tracked in Git
* **Location:** `api/__pycache__/`, `inspector/__pycache__/`
* **Issue:** Compiled bytecode files were committed to the repository history, causing diff noise and platform-specific Python bytecode conflicts.
* **Fix:** Removed cached bytecode files from git index (`git rm -r --cached`) and configured root `.gitignore` to ignore all `__pycache__/`, `*.pyc`, `.pytest_cache/`, and `.env` files.

### 🟡 Bug 3.2: Leftover Untracked Directory
* **Location:** `uiux ref/`
* **Issue:** Untracked reference assets in root directory.
* **Fix:** Cleaned up and added to `.gitignore` / repository structure.

---

## 📌 4. Action Summary & Verification

| Area | Status | Verification Method |
| :--- | :--- | :--- |
| **Statistical Drift (PSI & KS)** | ✅ Fixed | Unit tested via `tests/test_inspector.py` |
| **Fairness & Disparate Impact** | ✅ Fixed | Tested with string labels & zero rates |
| **FastAPI Backend Endpoints** | ✅ Verified | Pytest 8/8 tests passing (`pytest`) |
| **React 19 Frontend Dashboard** | ✅ Upgraded | Built with Vite (`npm run build` passed) |
| **Vercel SPA Deployment Config** | ✅ Added | Added `frontend/vercel.json` |
| **Git Hygiene & Pycache Removal** | ✅ Cleaned | Updated `.gitignore` |

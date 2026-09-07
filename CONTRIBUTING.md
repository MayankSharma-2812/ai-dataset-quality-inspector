# 🤝 Contributing to AI Dataset Quality Inspector

Thank you for your interest in contributing to **AI Dataset Quality Inspector (AegisData AI)**! We welcome contributions from the community, whether it's fixing bugs, enhancing documentation, adding new statistical tests, or improving UI/UX.

---

## 🛠️ Development Setup

### Prerequisites
- **Python:** 3.10 or higher
- **Node.js:** 18.0 or higher
- **npm:** 9.0 or higher
- **Git**

### 1. Fork & Clone the Repository
```bash
git clone https://github.com/MayankSharma-2812/ai-dataset-quality-inspector-.git
cd ai-dataset-quality-inspector-
```

### 2. Backend Setup
```bash
# Create and activate virtual environment
python -m venv .venv

# On Linux/macOS:
source .venv/bin/activate
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt

# Start backend development server
uvicorn api.main:app --reload --port 8000
```
Backend API will be live at `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend

# Copy environment template
cp .env.example .env

# Install Node dependencies
npm install

# Start Vite frontend dev server
npm run dev
```
Frontend will be running at `http://localhost:5173`.

---

## 🧪 Testing & Code Quality

### Running Backend Tests
Ensure all unit tests pass before opening a pull request:
```bash
pytest
```

### Running Frontend Linter & Build Check
```bash
cd frontend
npm run lint
npm run build
```

---

## 🌿 Contribution Workflow

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
2. **Commit your changes**:
   Write clear, concise commit messages following Conventional Commits (e.g. `feat: add Wasserstein drift metric`, `fix: handle NaN in PSI calculation`).
3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
4. **Open a Pull Request**:
   Fill in the PR template with description of changes and verification steps.

---

## 📋 Pull Request Checklist
- [ ] Code follows existing project style and patterns.
- [ ] Unit tests are written or updated for any new backend logic.
- [ ] `pytest` passes with 100% success rate.
- [ ] `npm run build` succeeds without compilation errors.
- [ ] Documentation / README updated if new features or endpoints were added.
- [ ] No temporary files (`__pycache__`, `.ipynb_checkpoints`, `.env`) committed.

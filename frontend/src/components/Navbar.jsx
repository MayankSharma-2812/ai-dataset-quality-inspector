import { motion } from "framer-motion";

export default function Navbar({ onLoadDemo, onExportReport, isApiOnline }) {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logo">
          <span className="navbar__logo-icon">🛡️</span>
          <div className="navbar__logo-text">
            <span className="navbar__logo-title">AegisData AI</span>
            <span className="navbar__logo-sub">Dataset Quality & Governance</span>
          </div>
        </div>
        <div className={`navbar__status-pill ${isApiOnline ? "navbar__status-pill--online" : "navbar__status-pill--offline"}`}>
          <span className="navbar__status-dot" />
          {isApiOnline ? "API Online" : "Connecting..."}
        </div>
      </div>

      <div className="navbar__actions">
        <div className="dropdown">
          <button className="nav-btn nav-btn--ghost" id="demo-dropdown-btn">
            <span>🧪 Load Demo Data</span>
            <span className="nav-btn__arrow">▼</span>
          </button>
          <div className="dropdown-menu">
            <button
              className="dropdown-item"
              onClick={() => onLoadDemo("credit_bias")}
            >
              <span className="dropdown-item__title">Loan & Credit Approvals</span>
              <span className="dropdown-item__desc">Tests Gender & Income Bias / Disparate Impact</span>
            </button>
            <button
              className="dropdown-item"
              onClick={() => onLoadDemo("drift_benchmark")}
            >
              <span className="dropdown-item__title">Baseline vs Production Drift</span>
              <span className="dropdown-item__desc">Tests KS-Test, PSI Shift & JS Divergence</span>
            </button>
            <button
              className="dropdown-item"
              onClick={() => onLoadDemo("missingness_heavy")}
            >
              <span className="dropdown-item__title">Healthcare Patient Survey</span>
              <span className="dropdown-item__desc">Tests Heavy Missingness & Null Imputation</span>
            </button>
          </div>
        </div>

        <button
          className="nav-btn nav-btn--secondary"
          onClick={onExportReport}
          title="Export Audit Report"
        >
          <span>📥 Export Report</span>
        </button>

        <a
          href="https://github.com/MayankSharma-2812/ai-dataset-quality-inspector"
          target="_blank"
          rel="noreferrer"
          className="nav-btn nav-btn--icon"
          title="View GitHub Repository"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </header>
  );
}

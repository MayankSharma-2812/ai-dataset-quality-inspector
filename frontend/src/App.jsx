import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Subcomponents
import Navbar from "./components/Navbar";
import HealthScoreCard from "./components/HealthScoreCard";
import MissingnessCard from "./components/MissingnessCard";
import MissingnessChart from "./components/MissingnessChart";
import DriftCard from "./components/DriftCard";
import ComparisonCard from "./components/ComparisonCard";
import BiasCard from "./components/BiasCard";
import DataPreviewTable from "./components/DataPreviewTable";
import RemediationCard from "./components/RemediationCard";

import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/* Reusable Upload Zone */
function UploadZone({ label, file, onFileSelect, id }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      onFileSelect(droppedFile);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const zoneClass = [
    "upload-zone",
    file && "upload-zone--active",
    dragOver && "upload-zone--dragover"
  ].filter(Boolean).join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {label && (
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>
          {label}
        </div>
      )}
      <div
        className={zoneClass}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        id={id}
      >
        <span className="upload-zone__icon">{file ? "📊" : "📁"}</span>
        <div className="upload-zone__label">
          {file ? (
            <>File loaded & ready for inspection</>
          ) : (
            <>Drag & drop CSV file here, or <strong>browse file</strong></>
          )}
        </div>
        <div className="upload-zone__hint">Supports .csv tabular datasets</div>
        {file && (
          <motion.div
            className="upload-zone__file-name"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </motion.div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={(e) => {
            if (e.target.files[0]) onFileSelect(e.target.files[0]);
          }}
        />
      </div>
    </motion.div>
  );
}

export default function App() {
  const [referenceFile, setReferenceFile] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [rawCsvText, setRawCsvText] = useState("");
  const [columns, setColumns] = useState([]);

  const [result, setResult] = useState(null);
  const [biasResult, setBiasResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [biasLoading, setBiasLoading] = useState(false);
  const [error, setError] = useState(null);

  const [comparisonMode, setComparisonMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview, missingness, drift, bias, preview, remediation
  const [isApiOnline, setIsApiOnline] = useState(false);

  // Check API Health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await axios.get(`${API_BASE}/`);
        setIsApiOnline(true);
      } catch {
        setIsApiOnline(false);
      }
    };
    checkHealth();
  }, []);

  // Read raw text when currentFile changes
  const handleCurrentFileSelect = (file) => {
    setCurrentFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setRawCsvText(text);
        const firstLine = text.trim().split("\n")[0];
        if (firstLine) {
          const cols = firstLine.split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
          setColumns(cols);
        }
      };
      reader.readAsText(file);
    } else {
      setRawCsvText("");
      setColumns([]);
    }
  };

  // Load Built-in Demo Datasets
  const loadDemoDataset = (type) => {
    let csvData = "";
    let refCsvData = "";
    let filename = "sample.csv";

    if (type === "credit_bias") {
      filename = "loan_approvals_credit.csv";
      csvData = `age,gender,income,credit_score,loan_amount,approved
23,Female,45000,680,15000,0
28,Male,62000,710,22000,1
34,Female,58000,,18000,0
45,Male,95000,760,35000,1
52,Female,82000,740,30000,1
22,Male,32000,610,,0
31,Female,49000,650,12000,0
40,Male,88000,730,28000,1
29,Female,51000,,16000,0
58,Male,110000,790,40000,1
36,Female,64000,690,20000,0
48,Male,99000,750,32000,1
25,Female,42000,640,14000,0
38,Male,84000,720,26000,1
27,Female,47000,,15000,0`;
    } else if (type === "drift_benchmark") {
      filename = "production_drift_batch.csv";
      setComparisonMode(true);
      refCsvData = `age,sensor_temp,sensor_pressure,vibration,status
25,45.2,101.3,0.12,1
30,46.1,101.5,0.14,1
35,44.8,101.2,0.11,1
40,47.0,101.8,0.15,1
45,45.9,101.4,0.13,1
50,46.5,101.6,0.14,1
55,45.0,101.1,0.12,1
60,47.3,101.9,0.16,1`;

      csvData = `age,sensor_temp,sensor_pressure,vibration,status
26,68.4,115.8,0.45,0
31,71.2,118.2,0.52,0
36,69.5,116.1,0.48,0
41,73.0,119.5,0.55,0
46,70.8,117.0,0.50,0
51,72.4,118.9,0.53,0
56,69.1,115.4,0.46,0
61,74.2,120.3,0.58,0`;

      const refBlob = new Blob([refCsvData], { type: "text/csv" });
      const refFileObj = new File([refBlob], "baseline_reference.csv", { type: "text/csv" });
      setReferenceFile(refFileObj);
    } else {
      filename = "patient_health_survey.csv";
      csvData = `patient_id,age,blood_pressure,cholesterol,bmi,smoker,outcome
101,45,120,,24.5,0,0
102,52,,240,28.2,1,1
103,39,118,195,,0,0
104,61,,,31.4,1,1
105,29,115,180,22.1,0,0
106,58,,260,,1,1
107,43,122,210,25.8,0,0
108,67,,,33.2,1,1`;
    }

    const curBlob = new Blob([csvData], { type: "text/csv" });
    const curFileObj = new File([curBlob], filename, { type: "text/csv" });
    handleCurrentFileSelect(curFileObj);
  };

  const canAnalyze = currentFile && (!comparisonMode || referenceFile) && !loading;

  // Main Inspect / Compare analysis
  const analyze = async () => {
    if (!canAnalyze) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setBiasResult(null);

    try {
      const formData = new FormData();

      if (comparisonMode) {
        formData.append("reference", referenceFile);
        formData.append("current", currentFile);
        const res = await axios.post(`${API_BASE}/inspect/compare`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setResult(res.data);
      } else {
        formData.append("file", currentFile);
        const res = await axios.post(`${API_BASE}/inspect`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setResult(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || "Failed to analyze dataset");
    } finally {
      setLoading(false);
    }
  };

  // Bias & Fairness analysis
  const runBiasAudit = async (feature, target) => {
    if (!currentFile) return;
    setBiasLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", currentFile);
      const res = await axios.post(
        `${API_BASE}/inspect/bias?feature=${encodeURIComponent(feature)}&target=${encodeURIComponent(target)}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setBiasResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || "Failed to perform bias audit");
    } finally {
      setBiasLoading(false);
    }
  };

  // Export report
  const exportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      dataset: currentFile?.name || "unnamed.csv",
      mode: comparisonMode ? "Dataset Drift Comparison" : "Single Dataset Inspection",
      inspection: result,
      bias_audit: biasResult
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dataset_quality_audit_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const switchMode = (mode) => {
    setComparisonMode(mode);
    setResult(null);
    setBiasResult(null);
    setError(null);
  };

  const missingnessData = comparisonMode ? result?.current_missingness : result?.missingness;

  return (
    <div className="app-wrapper">
      {/* Background Ambience */}
      <div className="bg-scene">
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--2" />
        <div className="bg-orb bg-orb--3" />
        <div className="bg-grid" />
      </div>

      <div className="main-container">
        {/* Top Navbar */}
        <Navbar
          onLoadDemo={loadDemoDataset}
          onExportReport={exportReport}
          isApiOnline={isApiOnline}
        />

        {/* Hero Header */}
        <motion.header
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header__badge">
            <span className="header__badge-dot" />
            AI-Powered ML Data Quality & Governance
          </div>
          <h1 className="header__title">Dataset Quality Inspector</h1>
          <p className="header__subtitle">
            Inspect missingness, detect distribution drift across dataset versions, and audit demographic bias with statistical confidence.
          </p>
        </motion.header>

        {/* Mode Switcher */}
        <div className="mode-switcher">
          <button
            className={`mode-btn ${!comparisonMode ? "mode-btn--active" : ""}`}
            onClick={() => switchMode(false)}
          >
            🔍 Single Dataset Inspection
          </button>
          <button
            className={`mode-btn ${comparisonMode ? "mode-btn--active" : ""}`}
            onClick={() => switchMode(true)}
          >
            🔄 Drift & Version Comparison
          </button>
        </div>

        {/* Upload Zone */}
        <div className="upload-grid">
          {comparisonMode && (
            <UploadZone
              label="1. Reference Baseline Dataset (Train/v1.0)"
              file={referenceFile}
              onFileSelect={setReferenceFile}
              id="upload-reference"
            />
          )}

          <UploadZone
            label={comparisonMode ? "2. Current Production Dataset (Batch/v2.0)" : "Upload CSV Dataset"}
            file={currentFile}
            onFileSelect={handleCurrentFileSelect}
            id="upload-current"
          />
        </div>

        {/* Action Button */}
        <button
          className={`analyze-btn ${loading ? "analyze-btn--loading" : canAnalyze ? "analyze-btn--ready" : "analyze-btn--disabled"}`}
          onClick={analyze}
          disabled={!canAnalyze}
        >
          {loading ? (
            <>
              <div className="analyze-btn__spinner" />
              <span>Analyzing Dataset Distributions & Integrity...</span>
            </>
          ) : (
            <>
              <span>⚡ {comparisonMode ? "Run Comparative Drift & Quality Audit" : "Analyze Dataset Quality"}</span>
            </>
          )}
        </button>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="error-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inspection Results Dashboard */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Health Score Overview */}
            <div style={{ marginTop: 32 }}>
              <HealthScoreCard
                missingnessData={missingnessData}
                driftData={result.drift}
                biasData={biasResult}
              />
            </div>

            {/* Navigation Tabs */}
            <div className="nav-tabs">
              <button
                className={`tab-btn ${activeTab === "overview" ? "tab-btn--active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                📊 Overview & Metrics
              </button>
              <button
                className={`tab-btn ${activeTab === "missingness" ? "tab-btn--active" : ""}`}
                onClick={() => setActiveTab("missingness")}
              >
                🔍 Missingness Analysis
              </button>
              {comparisonMode && (
                <button
                  className={`tab-btn ${activeTab === "drift" ? "tab-btn--active" : ""}`}
                  onClick={() => setActiveTab("drift")}
                >
                  🔄 Distribution Drift ({result.drift?.drift_detected ? "Shift Detected" : "Stable"})
                </button>
              )}
              <button
                className={`tab-btn ${activeTab === "bias" ? "tab-btn--active" : ""}`}
                onClick={() => setActiveTab("bias")}
              >
                ⚖️ Bias & Fairness Audit
              </button>
              <button
                className={`tab-btn ${activeTab === "preview" ? "tab-btn--active" : ""}`}
                onClick={() => setActiveTab("preview")}
              >
                📑 Data Explorer ({columns.length} cols)
              </button>
              <button
                className={`tab-btn ${activeTab === "remediation" ? "tab-btn--active" : ""}`}
                onClick={() => setActiveTab("remediation")}
              >
                ⚡ AI Remediation Code
              </button>
            </div>

            {/* Tab Views */}
            <div className="tab-content">
              {activeTab === "overview" && (
                <div>
                  {comparisonMode ? (
                    <ComparisonCard
                      referenceData={result.reference_missingness}
                      currentData={result.current_missingness}
                      drift={result.drift}
                    />
                  ) : (
                    <MissingnessCard data={result.missingness} />
                  )}
                  <MissingnessChart data={missingnessData} />
                </div>
              )}

              {activeTab === "missingness" && (
                <div>
                  <MissingnessCard data={missingnessData} />
                  <MissingnessChart data={missingnessData} />
                </div>
              )}

              {activeTab === "drift" && comparisonMode && (
                <div>
                  <DriftCard drift={result.drift} />
                  <ComparisonCard
                    referenceData={result.reference_missingness}
                    currentData={result.current_missingness}
                    drift={result.drift}
                  />
                </div>
              )}

              {activeTab === "bias" && (
                <div>
                  <BiasCard
                    biasData={biasResult}
                    columns={columns}
                    onRunBiasAudit={runBiasAudit}
                    loading={biasLoading}
                  />
                </div>
              )}

              {activeTab === "preview" && (
                <div>
                  <DataPreviewTable
                    rawCsvText={rawCsvText}
                    fileName={currentFile?.name}
                  />
                </div>
              )}

              {activeTab === "remediation" && (
                <div>
                  <RemediationCard
                    missingnessData={missingnessData}
                    driftData={result.drift}
                    biasData={biasResult}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="footer">
          AegisData AI · Dataset Quality & Governance · Built with FastAPI & React · MIT License
        </footer>
      </div>
    </div>
  );
}

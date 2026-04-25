import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import MissingnessCard from "./components/MissingnessCard";
import MissingnessChart from "./components/MissingnessChart";
import DriftCard from "./components/DriftCard";
import ComparisonCard from "./components/ComparisonCard";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/* ===== Reusable UploadZone ===== */
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
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8, fontWeight: 500 }}>
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
            <>File ready for analysis</>
          ) : (
            <>Drag & drop your CSV here, or <strong>browse</strong></>
          )}
        </div>
        <div className="upload-zone__hint">Supports .csv files</div>
        {file && (
          <motion.div
            className="upload-zone__file-name"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            📎 {file.name}
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

/* ===== Main App ===== */
function App() {
  const [referenceFile, setReferenceFile] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comparisonMode, setComparisonMode] = useState(false);

  const canAnalyze = currentFile && (!comparisonMode || referenceFile) && !loading;

  const analyze = async () => {
    if (!canAnalyze) return;
    setLoading(true);
    setError(null);
    setResult(null);

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

  const switchMode = (mode) => {
    setComparisonMode(mode);
    setResult(null);
    setError(null);
  };

  /* Button state class */
  const btnClass = loading
    ? "analyze-btn analyze-btn--loading"
    : canAnalyze
      ? "analyze-btn analyze-btn--ready"
      : "analyze-btn analyze-btn--disabled";

  return (
    <div className="app-wrapper">
      {/* Animated Background */}
      <div className="bg-scene">
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--2" />
        <div className="bg-orb bg-orb--3" />
        <div className="bg-grid" />
        <div className="bg-noise" />
      </div>

      <div className="main-container">
        {/* Header */}
        <motion.header
          className="header"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            className="header__badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="header__badge-dot" />
            AI-Powered Analysis
          </motion.div>

          <h1 className="header__title">
            Dataset Quality Inspector
          </h1>

          <p className="header__subtitle">
            Detect missing values, bias, and distribution drift in your ML datasets
            with statistical precision.
          </p>
        </motion.header>

        {/* Mode Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mode-switcher">
            <button
              className={`mode-btn ${!comparisonMode ? "mode-btn--active" : ""}`}
              onClick={() => switchMode(false)}
              id="mode-single"
            >
              Single Dataset
            </button>
            <button
              className={`mode-btn ${comparisonMode ? "mode-btn--active" : ""}`}
              onClick={() => switchMode(true)}
              id="mode-compare"
            >
              Compare Datasets
            </button>
          </div>
        </motion.div>

        {/* Upload Section */}
        <div className="upload-section">
          <AnimatePresence mode="wait">
            {comparisonMode && (
              <motion.div
                key="ref-upload"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginBottom: 16 }}
              >
                <UploadZone
                  label="Reference Dataset"
                  file={referenceFile}
                  onFileSelect={setReferenceFile}
                  id="upload-reference"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <UploadZone
            label={comparisonMode ? "Current Dataset" : undefined}
            file={currentFile}
            onFileSelect={setCurrentFile}
            id="upload-current"
          />

          {/* Analyze Button */}
          <motion.button
            className={btnClass}
            onClick={analyze}
            disabled={!canAnalyze}
            whileHover={canAnalyze ? { scale: 1.01 } : {}}
            whileTap={canAnalyze ? { scale: 0.98 } : {}}
            style={{ marginTop: 20 }}
            id="btn-analyze"
          >
            {loading ? (
              <>
                <div className="analyze-btn__spinner" />
                Analyzing…
              </>
            ) : (
              <>
                {comparisonMode ? "⚡ Compare Datasets" : "⚡ Analyze Dataset"}
              </>
            )}
          </motion.button>
        </div>

        {/* Error */}
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

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className={`results-section ${comparisonMode ? "results-section--compare" : "results-section--single"}`}>
                {comparisonMode ? (
                  <ComparisonCard
                    referenceData={result.reference_missingness}
                    currentData={result.current_missingness}
                    drift={result.drift}
                  />
                ) : (
                  <>
                    <MissingnessCard data={result.missingness} />
                    {result.drift && <DriftCard drift={result.drift} />}
                  </>
                )}
              </div>

              <MissingnessChart
                data={comparisonMode ? result.current_missingness : result.missingness}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="footer">
          Built with FastAPI + React · <a href="https://github.com/MayankSharma-2812/ai-dataset-quality-inspector" target="_blank" rel="noreferrer">GitHub</a>
        </footer>
      </div>
    </div>
  );
}

export default App;

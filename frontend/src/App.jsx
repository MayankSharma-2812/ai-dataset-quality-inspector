import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import MissingnessCard from "./components/MissingnessCard";
import MissingnessChart from "./components/MissingnessChart";
import DriftCard from "./components/DriftCard";
import ComparisonCard from "./components/ComparisonCard";

function App() {
  const [referenceFile, setReferenceFile] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);

  const analyze = async () => {
    if (!currentFile) return;
    setLoading(true);

    if (comparisonMode && referenceFile) {
      // Comparison mode
      const form = new FormData();
      form.append("reference", referenceFile);
      form.append("current", currentFile);

      const res = await axios.post("http://127.0.0.1:8000/inspect/compare", form);
      setResult(res.data);
    } else {
      // Single file mode
      const form = new FormData();
      form.append("file", currentFile);

      const res = await axios.post("http://127.0.0.1:8000/inspect", form);
      setResult(res.data);
    }

    setLoading(false);
  };

  return (
    <div style={{ width: "100vw", overflowX: "hidden" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          padding: "40px 20px",
          fontFamily: "sans-serif",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          maxWidth: "1400px",
          margin: "0 auto"
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: "bold",
            marginBottom: 40,
            background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center"
          }}
        >
          AI Dataset Quality Inspector
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: 40 }}
        >
          <motion.div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 15,
              marginBottom: 20,
              flexWrap: "wrap"
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setComparisonMode(false)}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: !comparisonMode ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)" : "#374151",
                color: "white",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Single Dataset
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setComparisonMode(true)}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                background: comparisonMode ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)" : "#374151",
                color: "white",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              Compare Datasets
            </motion.button>
          </motion.div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 15,
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            {comparisonMode && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <label style={{ color: "#9CA3AF", fontSize: "14px" }}>Reference:</label>
                <motion.input
                  type="file"
                  onChange={(e) => setReferenceFile(e.target.files[0])}
                  whileFocus={{ scale: 1.02 }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "2px solid #374151",
                    background: "#1F2937",
                    color: "white",
                    fontSize: "14px"
                  }}
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: comparisonMode ? 0.1 : 0 }}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <label style={{ color: "#9CA3AF", fontSize: "14px" }}>
                {comparisonMode ? "Current:" : "Dataset:"}
              </label>
              <motion.input
                type="file"
                onChange={(e) => setCurrentFile(e.target.files[0])}
                whileFocus={{ scale: 1.02 }}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "2px solid #374151",
                  background: "#1F2937",
                  color: "white",
                  fontSize: "14px"
                }}
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={analyze}
              disabled={(!currentFile) || (comparisonMode && !referenceFile) || loading}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                background: (currentFile && (!comparisonMode || referenceFile) && !loading)
                  ? "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                  : "#4B5563",
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                cursor: (currentFile && (!comparisonMode || referenceFile) && !loading)
                  ? "pointer"
                  : "not-allowed",
                transition: "all 0.3s ease"
              }}
            >
              {loading ? "Analyzing..." : (comparisonMode ? "Compare Datasets" : "Analyze")}
            </motion.button>
          </div>
        </motion.div>

        {loading && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 20, color: "#6B7280" }}
          >
            🤖 Analyzing dataset with AI…
          </motion.p>
        )}

        {/* Results Section - Full Width Layout */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              display: "grid",
              gridTemplateColumns: comparisonMode ? "1fr" : "repeat(auto-fit, minmax(400px, 1fr))",
              gap: 20,
              marginTop: 40
            }}
          >
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
          </motion.div>
        )}

        {/* Chart Section - Full Width */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: 20 }}
          >
            <MissingnessChart data={comparisonMode ? result.current_missingness : result.missingness} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default App;

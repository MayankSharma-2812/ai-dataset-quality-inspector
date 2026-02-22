import { motion } from "framer-motion";

export default function ComparisonCard({ referenceData, currentData, drift }) {
  if (!referenceData || !currentData) return null;

  // Get all unique columns from both datasets
  const allColumns = Array.from(new Set([
    ...Object.keys(referenceData),
    ...Object.keys(currentData)
  ]));

  // Calculate comparison metrics
  const comparisonData = allColumns.map(column => ({
    column,
    reference: {
      missing_percent: parseFloat(referenceData[column]?.missing_percent) || 0,
      missing_count: parseInt(referenceData[column]?.missing_count) || 0
    },
    current: {
      missing_percent: parseFloat(currentData[column]?.missing_percent) || 0,
      missing_count: parseInt(currentData[column]?.missing_count) || 0
    },
    drift_info: drift?.feature_drift?.[column] || null
  })).sort((a, b) => Math.abs(b.current.missing_percent - b.reference.missing_percent) - 
                      Math.abs(a.current.missing_percent - a.reference.missing_percent));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        background: "#111827",
        color: "white",
        padding: 24,
        borderRadius: 12,
        marginTop: 20,
      }}
    >
      <h3 style={{ 
        marginBottom: 20, 
        fontSize: "1.25rem",
        fontWeight: "600"
      }}>
        Dataset Comparison Analysis
      </h3>

      {/* Overall Summary */}
      <div style={{ 
        marginBottom: 20,
        padding: 16,
        background: "#1F2937",
        borderRadius: 8,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 15
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#9CA3AF", fontSize: "12px" }}>Total Columns</div>
          <div style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
            {allColumns.length}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#9CA3AF", fontSize: "12px" }}>Drift Detected</div>
          <div style={{ 
            color: drift?.drift_detected ? "#EF4444" : "#10B981", 
            fontSize: "18px", 
            fontWeight: "bold" 
          }}>
            {drift?.drift_detected ? "Yes" : "No"}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#9CA3AF", fontSize: "12px" }}>Missing Change</div>
          <div style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
            {(
              Object.values(currentData).reduce((sum, item) => sum + (parseFloat(item.missing_percent) || 0), 0) -
              Object.values(referenceData).reduce((sum, item) => sum + (parseFloat(item.missing_percent) || 0), 0)
            ).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Column-by-Column Comparison */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ color: "#9CA3AF", marginBottom: 12, fontSize: "14px" }}>
          Column-wise Comparison
        </h4>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {comparisonData.map((item, index) => {
            const change = item.current.missing_percent - item.reference.missing_percent;
            const hasSignificantChange = Math.abs(change) > 5;
            const hasDrift = item.drift_info?.drift_detected;

            return (
              <motion.div
                key={item.column}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                style={{
                  padding: "14px 16px",
                  background: hasDrift ? "#1F2937" : "#374151",
                  borderRadius: 8,
                  border: hasDrift ? "1px solid #EF4444" : 
                           hasSignificantChange ? "1px solid #F59E0B" : "1px solid #4B5563"
                }}
              >
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: 8
                }}>
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>
                    {item.column}
                    {hasDrift && (
                      <span style={{ 
                        marginLeft: 8, 
                        color: "#EF4444", 
                        fontSize: "12px",
                        background: "rgba(239, 68, 68, 0.2)",
                        padding: "2px 6px",
                        borderRadius: 4
                      }}>
                        DRIFT
                      </span>
                    )}
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {change !== 0 && (
                      <span style={{ 
                        color: change > 0 ? "#EF4444" : "#10B981",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}>
                        {change > 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: 15,
                  fontSize: "12px"
                }}>
                  <div>
                    <div style={{ color: "#9CA3AF", marginBottom: 2 }}>Reference</div>
                    <div style={{ color: "white", fontWeight: "500" }}>
                      {item.reference.missing_percent.toFixed(2)}% 
                      <span style={{ color: "#6B7280", marginLeft: 4 }}>
                        ({item.reference.missing_count.toLocaleString()})
                      </span>
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#9CA3AF", marginBottom: 2 }}>Current</div>
                    <div style={{ color: "white", fontWeight: "500" }}>
                      {item.current.missing_percent.toFixed(2)}% 
                      <span style={{ color: "#6B7280", marginLeft: 4 }}>
                        ({item.current.missing_count.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>

                {item.drift_info?.drift_score && (
                  <div style={{ 
                    marginTop: 8, 
                    paddingTop: 8, 
                    borderTop: "1px solid #374151",
                    fontSize: "11px",
                    color: "#9CA3AF"
                  }}>
                    Drift Score: {item.drift_info.drift_score.toFixed(3)}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Drift Summary */}
      {drift?.drift_summary && (
        <div style={{ 
          padding: 16, 
          background: "rgba(239, 68, 68, 0.1)", 
          borderRadius: 8,
          border: "1px solid rgba(239, 68, 68, 0.3)"
        }}>
          <h4 style={{ color: "#EF4444", marginBottom: 8, fontSize: "14px" }}>
            Drift Analysis Summary
          </h4>
          <p style={{ lineHeight: 1.5, fontSize: "13px", color: "#E5E7EB" }}>
            {drift.drift_summary}
          </p>
        </div>
      )}
    </motion.div>
  );


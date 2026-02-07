import { motion } from "framer-motion";

export default function DriftCard({ drift, compact = false }) {
  if (!drift) return null;

  if (compact) {
    // Compact version for comparison mode
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: "#111827",
          color: "white",
          padding: 16,
          borderRadius: 8,
          border: drift.drift_detected ? "1px solid #EF4444" : "1px solid #10B981"
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h4 style={{
            margin: 0,
            color: drift.drift_detected ? "#EF4444" : "#10B981",
            fontSize: "14px"
          }}>
            {drift.drift_detected ? "⚠️ Drift Detected" : "✅ No Drift"}
          </h4>

          {drift.feature_drift && (
            <span style={{
              fontSize: "12px",
              color: "#9CA3AF"
            }}>
              {Object.values(drift.feature_drift).filter(f => f.drift_detected).length} features affected
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  // Full version for single dataset mode
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      style={{
        background: "#111827",
        color: "white",
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
        border: drift.drift_detected ? "2px solid #EF4444" : "2px solid #10B981"
      }}
    >
      <h3 style={{
        marginBottom: 15,
        color: drift.drift_detected ? "#EF4444" : "#10B981"
      }}>
        {drift.drift_detected ? "⚠️ Drift Detected" : "✅ No Significant Drift"}
      </h3>

      {drift.drift_summary && (
        <div style={{ marginTop: 10 }}>
          <h4 style={{ color: "#9CA3AF", marginBottom: 8 }}>Drift Summary:</h4>
          <p style={{ lineHeight: 1.6 }}>{drift.drift_summary}</p>
        </div>
      )}

      {drift.feature_drift && Object.keys(drift.feature_drift).length > 0 && (
        <div style={{ marginTop: 15 }}>
          <h4 style={{ color: "#9CA3AF", marginBottom: 8 }}>Feature-wise Drift:</h4>
          {Object.entries(drift.feature_drift).map(([feature, info]) => (
            <div key={feature} style={{
              marginTop: 8,
              padding: "8px 12px",
              background: "#1F2937",
              borderRadius: 6
            }}>
              <strong>{feature}</strong>: {info.drift_detected ? "Drift detected" : "No drift"}
              {info.drift_score && (
                <span style={{ marginLeft: 10, color: "#9CA3AF" }}>
                  (Score: {info.drift_score.toFixed(3)})
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

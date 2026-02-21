import { motion } from "framer-motion";

export default function DriftCard({ drift, compact = false }) {
  if (!drift) return null;

  const cardStyle = {
    background: "#111827",
    color: "white",
    padding: compact ? 16 : 20,
    borderRadius: compact ? 8 : 12,
    border: drift.drift_detected ? `2px solid #EF4444` : `2px solid #10B981`,
    marginTop: compact ? undefined : 20
  };

  const headingStyle = {
    marginBottom: compact ? undefined : 15,
    color: drift.drift_detected ? "#EF4444" : "#10B981"
  };

  const summaryStyle = {
    marginTop: compact ? undefined : 10,
    lineHeight: compact ? undefined : 1.6
  };

  const featureStyle = {
    marginTop: compact ? undefined : 15,
    padding: compact ? undefined : "8px 12px",
    background: "#1F2937",
    borderRadius: compact ? undefined : 6
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      style={cardStyle}
    >
      <h3 style={headingStyle}>
        {drift.drift_detected ? "⚠️ Drift Detected" : "✅ No Significant Drift"}
      </h3>

      {drift.drift_summary && (
        <div style={summaryStyle}>
          <h4 style={{ color: "#9CA3AF", marginBottom: 8 }}>Drift Summary:</h4>
          <p>{drift.drift_summary}</p>
        </div>
      )}

      {drift.feature_drift && Object.keys(drift.feature_drift).length > 0 && (
        <div style={featureStyle}>
          <h4 style={{ color: "#9CA3AF", marginBottom: 8 }}>Feature-wise Drift:</h4>
          {Object.entries(drift.feature_drift).map(([feature, info]) => (
            <div key={feature} style={{
              marginTop: compact ? undefined : 8,
              padding: compact ? undefined : "8px 12px",
              background: "#1F2937",
              borderRadius: compact ? undefined : 6
            }}>
              <strong>{feature}</strong>: {info.drift_detected ? "Drift detected" : "No drift"}
              {info.drift_score && (
                <span style={{ marginLeft: compact ? undefined : 10, color: "#9CA3AF" }}>
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


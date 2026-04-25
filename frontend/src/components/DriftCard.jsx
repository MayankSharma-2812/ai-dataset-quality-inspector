import { motion } from "framer-motion";

export default function DriftCard({ drift }) {
  if (!drift) return null;

  const hasDrift = drift.drift_detected;
  const features = drift.feature_drift ? Object.entries(drift.feature_drift) : [];

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="glass-card__header">
        <div className={`glass-card__icon ${hasDrift ? "glass-card__icon--rose" : "glass-card__icon--emerald"}`}>
          {hasDrift ? "⚠️" : "✅"}
        </div>
        <div>
          <div className="glass-card__title">
            {hasDrift ? "Drift Detected" : "No Significant Drift"}
          </div>
          <div className="glass-card__subtitle">Distribution analysis</div>
        </div>
      </div>

      {features.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {features.map(([feature, info], index) => (
            <motion.div
              key={feature}
              className={`drift-feature ${info.drift_detected ? "drift-feature--drifted" : ""}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.06 }}
            >
              <div className="drift-feature__header">
                <div className="drift-feature__name">
                  {feature}
                  <span className={`drift-badge ${info.drift_detected ? "drift-badge--drift" : "drift-badge--ok"}`}>
                    {info.drift_detected ? "DRIFT" : "OK"}
                  </span>
                </div>
              </div>

              <div className="drift-feature__metrics">
                <div>
                  <div className="drift-feature__metric-label">KS p-value</div>
                  <div className="drift-feature__metric-value">{info.ks_p_value?.toFixed(4)}</div>
                </div>
                <div>
                  <div className="drift-feature__metric-label">PSI</div>
                  <div className="drift-feature__metric-value">{info.psi?.toFixed(4)}</div>
                </div>
              </div>

              {info.js_divergence != null && (
                <div className="drift-feature__score">
                  JS Divergence: {info.js_divergence.toFixed(4)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary */}
      {drift.drift_summary && (
        <div className={`drift-summary ${hasDrift ? "drift-summary--danger" : "drift-summary--success"}`}>
          <div className="drift-summary__title">
            {hasDrift ? "⚠ Drift Summary" : "✓ Analysis Summary"}
          </div>
          <p>{drift.drift_summary}</p>
        </div>
      )}
    </motion.div>
  );
}

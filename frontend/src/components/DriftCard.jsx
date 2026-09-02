import { motion } from "framer-motion";

export default function DriftCard({ drift }) {
  if (!drift) return null;

  const hasDrift = drift.drift_detected;
  const features = drift.feature_drift ? Object.entries(drift.feature_drift) : [];
  const driftedCount = features.filter(([_, info]) => info.drift_detected).length;

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
            {hasDrift ? "Distribution Drift Detected" : "Dataset Stability Verified"}
          </div>
          <div className="glass-card__subtitle">Statistical hypothesis testing (KS-Test, PSI, JS Divergence)</div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-row" style={{ marginTop: 0, marginBottom: 20 }}>
        <div className="stat-item">
          <div className="stat-item__label">Numerical Features Checked</div>
          <div className="stat-item__value">{features.length}</div>
        </div>
        <div className="stat-item">
          <div className="stat-item__label">Drifted Features</div>
          <div className={`stat-item__value ${driftedCount > 0 ? "stat-item__value--danger" : "stat-item__value--success"}`}>
            {driftedCount}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-item__label">Stability Status</div>
          <div className={`stat-item__value ${hasDrift ? "stat-item__value--danger" : "stat-item__value--success"}`}>
            {hasDrift ? "ACTION REQUIRED" : "PASS (STABLE)"}
          </div>
        </div>
      </div>

      {features.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {features.map(([feature, info], index) => {
            const isDrifted = info.drift_detected;
            const psiLevel = info.psi > 0.2 ? "Severe" : info.psi > 0.1 ? "Moderate" : "Stable";

            return (
              <motion.div
                key={feature}
                className={`drift-feature ${isDrifted ? "drift-feature--drifted" : ""}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.04 }}
              >
                <div className="drift-feature__header">
                  <div className="drift-feature__name">
                    <span>{feature}</span>
                    <span className={`drift-badge ${isDrifted ? "drift-badge--drift" : "drift-badge--ok"}`}>
                      {isDrifted ? "DRIFT DETECTED" : "STABLE"}
                    </span>
                  </div>
                  <div className="drift-feature__level" style={{ fontSize: 12, color: isDrifted ? "var(--accent-rose)" : "var(--accent-emerald)" }}>
                    PSI: {psiLevel}
                  </div>
                </div>

                <div className="drift-feature__metrics">
                  <div>
                    <div className="drift-feature__metric-label">KS-Test p-value</div>
                    <div className="drift-feature__metric-value">
                      {info.ks_p_value?.toFixed(4)}
                      <span style={{ fontSize: 11, color: info.ks_drift ? "var(--accent-rose)" : "var(--text-muted)", marginLeft: 6 }}>
                        ({info.ks_drift ? "p < 0.05" : "No Sig Shift"})
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="drift-feature__metric-label">Population Stability Index (PSI)</div>
                    <div className="drift-feature__metric-value">
                      {info.psi?.toFixed(4)}
                    </div>
                  </div>
                </div>

                {info.js_divergence != null && (
                  <div className="drift-feature__score">
                    Jensen-Shannon Divergence: <strong>{info.js_divergence.toFixed(4)}</strong> · KS Stat: <strong>{info.ks_statistic?.toFixed(4)}</strong>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Summary Banner */}
      {drift.drift_summary && (
        <div className={`drift-summary ${hasDrift ? "drift-summary--danger" : "drift-summary--success"}`}>
          <div className="drift-summary__title">
            {hasDrift ? "⚠️ Statistical Drift Summary" : "✓ Dataset Alignment Summary"}
          </div>
          <p>{drift.drift_summary}</p>
        </div>
      )}
    </motion.div>
  );
}

import { motion } from "framer-motion";

export default function ComparisonCard({ referenceData, currentData, drift }) {
  if (!referenceData || !currentData) return null;

  const allColumns = Array.from(new Set([
    ...Object.keys(referenceData),
    ...Object.keys(currentData)
  ]));

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
  })).sort((a, b) =>
    Math.abs(b.current.missing_percent - b.reference.missing_percent) -
    Math.abs(a.current.missing_percent - a.reference.missing_percent)
  );

  const totalChange = (
    Object.values(currentData).reduce((s, i) => s + (parseFloat(i.missing_percent) || 0), 0) -
    Object.values(referenceData).reduce((s, i) => s + (parseFloat(i.missing_percent) || 0), 0)
  );

  const driftedCount = drift?.feature_drift
    ? Object.values(drift.feature_drift).filter(f => f.drift_detected).length
    : 0;

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card__header">
        <div className="glass-card__icon glass-card__icon--blue">🔄</div>
        <div>
          <div className="glass-card__title">Dataset Comparison</div>
          <div className="glass-card__subtitle">Reference vs Current analysis</div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-row" style={{ marginTop: 0, marginBottom: 20 }}>
        <div className="stat-item">
          <div className="stat-item__label">Columns</div>
          <div className="stat-item__value">{allColumns.length}</div>
        </div>
        <div className="stat-item">
          <div className="stat-item__label">Features Drifted</div>
          <div className={`stat-item__value ${driftedCount > 0 ? "stat-item__value--danger" : "stat-item__value--success"}`}>
            {driftedCount}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-item__label">Missing Change</div>
          <div className={`stat-item__value ${totalChange > 0 ? "stat-item__value--danger" : "stat-item__value--success"}`}>
            {totalChange > 0 ? "+" : ""}{totalChange.toFixed(1)}%
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-item__label">Drift Status</div>
          <div className={`stat-item__value ${drift?.drift_detected ? "stat-item__value--danger" : "stat-item__value--success"}`}>
            {drift?.drift_detected ? "Detected" : "Stable"}
          </div>
        </div>
      </div>

      {/* Column-by-Column */}
      <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, marginBottom: 12 }}>
        Column-wise Comparison
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {comparisonData.map((item, index) => {
          const change = item.current.missing_percent - item.reference.missing_percent;
          const hasDrift = item.drift_info?.drift_detected;

          return (
            <motion.div
              key={item.column}
              className={`drift-feature ${hasDrift ? "drift-feature--drifted" : ""}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.04 }}
            >
              <div className="drift-feature__header">
                <div className="drift-feature__name">
                  {item.column}
                  {hasDrift && (
                    <span className="drift-badge drift-badge--drift">DRIFT</span>
                  )}
                </div>
                {change !== 0 && (
                  <div
                    className="drift-feature__change"
                    style={{ color: change > 0 ? "var(--accent-rose)" : "var(--accent-emerald)" }}
                  >
                    {change > 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
                  </div>
                )}
              </div>

              <div className="drift-feature__metrics">
                <div>
                  <div className="drift-feature__metric-label">Reference</div>
                  <div className="drift-feature__metric-value">
                    {item.reference.missing_percent.toFixed(2)}%
                    <span style={{ color: "var(--text-dim)", marginLeft: 6, fontSize: 11 }}>
                      ({item.reference.missing_count.toLocaleString()})
                    </span>
                  </div>
                </div>
                <div>
                  <div className="drift-feature__metric-label">Current</div>
                  <div className="drift-feature__metric-value">
                    {item.current.missing_percent.toFixed(2)}%
                    <span style={{ color: "var(--text-dim)", marginLeft: 6, fontSize: 11 }}>
                      ({item.current.missing_count.toLocaleString()})
                    </span>
                  </div>
                </div>
              </div>

              {item.drift_info?.drift_score != null && (
                <div className="drift-feature__score">
                  PSI: {item.drift_info.psi?.toFixed(4)} · KS p-value: {item.drift_info.ks_p_value?.toFixed(4)}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Drift Summary */}
      {drift?.drift_summary && (
        <div className={`drift-summary ${drift.drift_detected ? "drift-summary--danger" : "drift-summary--success"}`}>
          <div className="drift-summary__title">
            {drift.drift_detected ? "⚠ Drift Summary" : "✓ Analysis Summary"}
          </div>
          <p>{drift.drift_summary}</p>
        </div>
      )}
    </motion.div>
  );
}

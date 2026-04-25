import { motion } from "framer-motion";

export default function MissingnessCard({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass-card__header">
          <div className="glass-card__icon glass-card__icon--blue">🔍</div>
          <div>
            <div className="glass-card__title">Missing Values</div>
            <div className="glass-card__subtitle">No data to display</div>
          </div>
        </div>
      </motion.div>
    );
  }

  const sortedData = Object.entries(data)
    .map(([col, info]) => ({
      column: col,
      missing_percent: parseFloat(info.missing_percent) || 0,
      missing_count: parseInt(info.missing_count) || 0
    }))
    .sort((a, b) => b.missing_percent - a.missing_percent);

  const totalMissing = sortedData.reduce((sum, item) => sum + item.missing_count, 0);
  const colsWithMissing = sortedData.filter(item => item.missing_percent > 0).length;
  const maxMissing = sortedData.length > 0 ? sortedData[0].missing_percent : 0;

  const getSeverityClass = (pct) => {
    if (pct > 20) return "feature-item__value--bad";
    if (pct > 5) return "feature-item__value--warn";
    return "feature-item__value--good";
  };

  const getSeverityLabel = (pct) => {
    if (pct > 20) return "HIGH";
    if (pct > 5) return "MEDIUM";
    return "LOW";
  };

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card__header">
        <div className="glass-card__icon glass-card__icon--rose">🔍</div>
        <div>
          <div className="glass-card__title">Missing Values Analysis</div>
          <div className="glass-card__subtitle">Per-feature breakdown</div>
        </div>
      </div>

      <div className="feature-grid">
        {sortedData.map((item, index) => (
          <motion.div
            key={item.column}
            className={`feature-item ${item.missing_percent > 20 ? "feature-item--danger" : ""}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.06 }}
          >
            <div className="feature-item__name" title={item.column}>
              {item.column}
            </div>
            <div className={`feature-item__value ${getSeverityClass(item.missing_percent)}`}>
              {item.missing_percent.toFixed(1)}%
            </div>
            <div className="feature-item__label">
              {item.missing_count.toLocaleString()} missing · {getSeverityLabel(item.missing_percent)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-item__label">Columns with Missing</div>
          <div className="stat-item__value stat-item__value--accent">
            {colsWithMissing} / {sortedData.length}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-item__label">Total Missing</div>
          <div className="stat-item__value">
            {totalMissing.toLocaleString()}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-item__label">Worst Feature</div>
          <div className="stat-item__value stat-item__value--danger">
            {maxMissing.toFixed(1)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}

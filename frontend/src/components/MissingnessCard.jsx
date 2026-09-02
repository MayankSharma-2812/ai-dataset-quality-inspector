import { useState } from "react";
import { motion } from "framer-motion";

export default function MissingnessCard({ data }) {
  const [filter, setFilter] = useState("all"); // 'all', 'high', 'medium', 'clean'
  const [search, setSearch] = useState("");

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
            <div className="glass-card__title">Missing Values Breakdown</div>
            <div className="glass-card__subtitle">No data loaded</div>
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

  const filteredData = sortedData.filter(item => {
    const matchesSearch = item.column.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "high") return item.missing_percent > 20;
    if (filter === "medium") return item.missing_percent > 5 && item.missing_percent <= 20;
    if (filter === "clean") return item.missing_percent === 0;
    return true;
  });

  const getSeverityClass = (pct) => {
    if (pct > 20) return "feature-item__value--bad";
    if (pct > 5) return "feature-item__value--warn";
    return "feature-item__value--good";
  };

  const getSeverityLabel = (pct) => {
    if (pct > 20) return "CRITICAL";
    if (pct > 5) return "MODERATE";
    if (pct > 0) return "LOW";
    return "CLEAN";
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
          <div className="glass-card__title">Missing Values & Null Analysis</div>
          <div className="glass-card__subtitle">Feature-level missingness distributions</div>
        </div>
      </div>

      {/* Summary KPI Row */}
      <div className="stats-row" style={{ marginTop: 0, marginBottom: 20 }}>
        <div className="stat-item">
          <div className="stat-item__label">Total Null Cells</div>
          <div className="stat-item__value stat-item__value--danger">
            {totalMissing.toLocaleString()}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-item__label">Affected Columns</div>
          <div className="stat-item__value stat-item__value--accent">
            {colsWithMissing} / {sortedData.length}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-item__label">Max Column Missingness</div>
          <div className={`stat-item__value ${maxMissing > 20 ? "stat-item__value--danger" : "stat-item__value--success"}`}>
            {maxMissing.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-row">
        <div className="search-bar search-bar--compact">
          <span className="search-bar__icon">🔎</span>
          <input
            type="text"
            className="search-bar__input"
            placeholder="Filter features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-chips">
          <button
            className={`filter-chip ${filter === "all" ? "filter-chip--active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({sortedData.length})
          </button>
          <button
            className={`filter-chip ${filter === "high" ? "filter-chip--active" : ""}`}
            onClick={() => setFilter("high")}
          >
            High &gt;20% ({sortedData.filter(d => d.missing_percent > 20).length})
          </button>
          <button
            className={`filter-chip ${filter === "medium" ? "filter-chip--active" : ""}`}
            onClick={() => setFilter("medium")}
          >
            Moderate 5–20% ({sortedData.filter(d => d.missing_percent > 5 && d.missing_percent <= 20).length})
          </button>
          <button
            className={`filter-chip ${filter === "clean" ? "filter-chip--active" : ""}`}
            onClick={() => setFilter("clean")}
          >
            Clean ({sortedData.filter(d => d.missing_percent === 0).length})
          </button>
        </div>
      </div>

      {/* Grid of features */}
      <div className="feature-grid">
        {filteredData.map((item, index) => (
          <motion.div
            key={item.column}
            className={`feature-item ${item.missing_percent > 20 ? "feature-item--danger" : ""}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(0.3, index * 0.03) }}
          >
            <div className="feature-item__name" title={item.column}>
              {item.column}
            </div>
            <div className={`feature-item__value ${getSeverityClass(item.missing_percent)}`}>
              {item.missing_percent.toFixed(1)}%
            </div>
            <div className="feature-item__label">
              {item.missing_count.toLocaleString()} missing · <strong>{getSeverityLabel(item.missing_percent)}</strong>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

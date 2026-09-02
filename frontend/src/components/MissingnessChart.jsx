import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

/* Custom Tooltip */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const val = payload[0].value;
  return (
    <div style={{
      background: "rgba(15, 23, 42, 0.95)",
      border: "1px solid rgba(99, 102, 241, 0.3)",
      borderRadius: 10,
      padding: "12px 16px",
      backdropFilter: "blur(12px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 12, color: "#94A3B8" }}>
        Missing Rate: <span style={{ color: getBarColor(val), fontWeight: 700 }}>
          {val.toFixed(2)}%
        </span>
      </div>
      {payload[0].payload.missing_count != null && (
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
          {payload[0].payload.missing_count.toLocaleString()} null entries
        </div>
      )}
    </div>
  );
}

function getBarColor(value) {
  if (value > 20) return "#FB7185";
  if (value > 5) return "#FBBF24";
  return "#6366F1";
}

export default function MissingnessChart({ data }) {
  const [sortOrder, setSortOrder] = useState("desc");

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  let chartData = Object.entries(data)
    .map(([key, val]) => ({
      feature: key,
      missing: parseFloat(val.missing_percent) || 0,
      missing_count: parseInt(val.missing_count) || 0
    }));

  if (sortOrder === "desc") {
    chartData.sort((a, b) => b.missing - a.missing);
  } else if (sortOrder === "asc") {
    chartData.sort((a, b) => a.missing - b.missing);
  } else {
    chartData.sort((a, b) => a.feature.localeCompare(b.feature));
  }

  const avgMissing = chartData.reduce((s, i) => s + i.missing, 0) / (chartData.length || 1);
  const maxMissing = Math.max(...chartData.map(i => i.missing), 0);

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      style={{ marginTop: 20 }}
    >
      <div className="glass-card__header" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="glass-card__icon glass-card__icon--amber">📊</div>
          <div>
            <div className="glass-card__title">Missing Value Distribution Chart</div>
            <div className="glass-card__subtitle">Visual severity ranking across all dataset columns</div>
          </div>
        </div>

        <div className="chart-sort-controls">
          <button
            className={`sort-btn ${sortOrder === "desc" ? "sort-btn--active" : ""}`}
            onClick={() => setSortOrder("desc")}
          >
            Worst First ↓
          </button>
          <button
            className={`sort-btn ${sortOrder === "asc" ? "sort-btn--active" : ""}`}
            onClick={() => setSortOrder("asc")}
          >
            Clean First ↑
          </button>
          <button
            className={`sort-btn ${sortOrder === "alpha" ? "sort-btn--active" : ""}`}
            onClick={() => setSortOrder("alpha")}
          >
            A–Z
          </button>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 12, right: 16, left: 4, bottom: 65 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="feature"
              stroke="transparent"
              angle={-40}
              textAnchor="end"
              height={70}
              tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'Inter' }}
              interval={0}
              tickLine={false}
            />
            <YAxis
              stroke="transparent"
              tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'Inter' }}
              tickLine={false}
              axisLine={false}
              unit="%"
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }} />
            <Bar
              dataKey="missing"
              radius={[6, 6, 0, 0]}
              animationDuration={800}
            >
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={getBarColor(entry.missing)} fillOpacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Footer */}
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-item__label">Total Features Analyzed</div>
          <div className="stat-item__value">{chartData.length}</div>
        </div>
        <div className="stat-item">
          <div className="stat-item__label">Mean Missingness</div>
          <div className="stat-item__value stat-item__value--accent">{avgMissing.toFixed(2)}%</div>
        </div>
        <div className="stat-item">
          <div className="stat-item__label">Peak Missing Feature</div>
          <div className={`stat-item__value ${maxMissing > 20 ? "stat-item__value--danger" : "stat-item__value--success"}`}>
            {maxMissing.toFixed(2)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}
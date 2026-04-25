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

  return (
    <div style={{
      background: "rgba(15, 23, 42, 0.95)",
      border: "1px solid rgba(99, 102, 241, 0.2)",
      borderRadius: 10,
      padding: "12px 16px",
      backdropFilter: "blur(12px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 12, color: "#94A3B8" }}>
        Missing: <span style={{ color: getBarColor(payload[0].value), fontWeight: 600 }}>
          {payload[0].value.toFixed(2)}%
        </span>
      </div>
      {payload[0].payload.missing_count != null && (
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
          {payload[0].payload.missing_count.toLocaleString()} values
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
  if (!data || Object.keys(data).length === 0) {
    return (
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="glass-card__header">
          <div className="glass-card__icon glass-card__icon--blue">📊</div>
          <div>
            <div className="glass-card__title">Visualization</div>
            <div className="glass-card__subtitle">No data to chart</div>
          </div>
        </div>
      </motion.div>
    );
  }

  const chartData = Object.entries(data)
    .map(([key, val]) => ({
      feature: key,
      missing: parseFloat(val.missing_percent) || 0,
      missing_count: parseInt(val.missing_count) || 0
    }))
    .sort((a, b) => b.missing - a.missing);

  const avgMissing = chartData.reduce((s, i) => s + i.missing, 0) / chartData.length;
  const maxMissing = Math.max(...chartData.map(i => i.missing));

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      style={{ marginTop: 20 }}
    >
      <div className="glass-card__header">
        <div className="glass-card__icon glass-card__icon--amber">📊</div>
        <div>
          <div className="glass-card__title">Missing Values Visualization</div>
          <div className="glass-card__subtitle">Sorted by severity</div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 16, left: 4, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(99, 102, 241, 0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="feature"
              stroke="transparent"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'Inter' }}
              interval={0}
              tickLine={false}
            />
            <YAxis
              stroke="transparent"
              tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'Inter' }}
              tickLine={false}
              axisLine={false}
              label={{
                value: 'Missing %',
                angle: -90,
                position: 'insideLeft',
                fill: '#475569',
                style: { fontSize: 12, fontFamily: 'Inter' },
                offset: 10
              }}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }} />
            <Bar
              dataKey="missing"
              radius={[6, 6, 0, 0]}
              animationDuration={1200}
              animationBegin={200}
              animationEasing="ease-out"
            >
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={getBarColor(entry.missing)} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Footer */}
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-item__label">Features</div>
          <div className="stat-item__value">{chartData.length}</div>
        </div>
        <div className="stat-item">
          <div className="stat-item__label">Avg Missing</div>
          <div className="stat-item__value stat-item__value--accent">{avgMissing.toFixed(2)}%</div>
        </div>
        <div className="stat-item">
          <div className="stat-item__label">Max Missing</div>
          <div className="stat-item__value stat-item__value--danger">{maxMissing.toFixed(2)}%</div>
        </div>
      </div>
    </motion.div>
  );
}
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function MissingnessChart({ data }) {
  // Handle empty or invalid data
  if (!data || Object.keys(data).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: "#111827",
          color: "white",
          padding: 20,
          borderRadius: 12,
          marginTop: 20,
          textAlign: "center"
        }}
      >
        <h3>Missing Values Visualization</h3>
        <p style={{ color: "#9CA3AF", marginTop: 20 }}>
          No data available to visualize
        </p>
      </motion.div>
    );
  }

  // Transform data for chart and sort by missing percentage
  const chartData = Object.entries(data)
    .map(([key, val]) => ({
      feature: key,
      missing: parseFloat(val.missing_percent) || 0,
      missing_count: parseInt(val.missing_count) || 0
    }))
    .sort((a, b) => b.missing - a.missing); // Sort by highest missing percentage first

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: "#111827",
        color: "white",
        padding: 20,
        borderRadius: 12,
        marginTop: 20
      }}
    >
      <h3>Missing Values Visualization</h3>

      <div style={{ width: "100%", height: 400, marginTop: 20 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="feature"
              stroke="#9CA3AF"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              interval={0} // Show all labels
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              label={{
                value: 'Missing Percentage (%)',
                angle: -90,
                position: 'insideLeft',
                fill: '#9CA3AF',
                style: { fontSize: 14 }
              }}
              domain={[0, 'dataMax + 5']} // Add some padding to max
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#F3F4F6', fontWeight: 'bold' }}
              formatter={(value, name) => {
                if (name === 'missing') {
                  return [`${value.toFixed(2)}%`, 'Missing %'];
                }
                return [value, name];
              }}
              labelFormatter={(label) => `Feature: ${label}`}
            />
            <Bar
              dataKey="missing"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              animationBegin={300}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Add summary statistics */}
      <div style={{
        marginTop: 20,
        padding: 15,
        background: '#1F2937',
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#9CA3AF', fontSize: 12 }}>Total Features</div>
          <div style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            {chartData.length}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#9CA3AF', fontSize: 12 }}>Avg Missing</div>
          <div style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            {(chartData.reduce((sum, item) => sum + item.missing, 0) / chartData.length).toFixed(2)}%
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#9CA3AF', fontSize: 12 }}>Max Missing</div>
          <div style={{ color: '#EF4444', fontSize: 18, fontWeight: 'bold' }}>
            {Math.max(...chartData.map(item => item.missing)).toFixed(2)}%
          </div>
        </div>
      </div>
    </motion.div>
  )


import { motion } from "framer-motion";

export default function MissingnessCard({ data }) {
  // Handle empty or invalid data
  if (!data || Object.keys(data).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "#111827",
          color: "white",
          padding: 20,
          borderRadius: 12,
          textAlign: "center"
        }}
      >
        <h3>Missing Values</h3>
        <p style={{ color: "#9CA3AF", marginTop: 20 }}>No missing data to display</p>
      </motion.div>
    );
  }

  // Sort columns by missing percentage (highest first)
  const sortedData = Object.entries(data)
    .map(([col, info]) => ({
      column: col,
      missing_percent: parseFloat(info.missing_percent) || 0,
      missing_count: parseInt(info.missing_count) || 0
    }))
    .sort((a, b) => b.missing_percent - a.missing_percent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "#111827",
        color: "white",
        padding: 24,
        borderRadius: 12
      }}
    >
      <h3 style={{
        marginBottom: 20,
        fontSize: "1.25rem",
        fontWeight: "600"
      }}>
        Missing Values Analysis
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15 }}>
        {sortedData.map((item, index) => (
          <motion.div
            key={item.column}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              padding: "12px 16px",
              background: item.missing_percent > 20 ? "#1F2937" : "#374151",
              borderRadius: 8,
              border: item.missing_percent > 20 ? "1px solid #EF4444" : "1px solid #4B5563",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: 4 }}>
              {item.column}
            </div>
            <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
              {item.missing_count.toLocaleString()} missing values
            </div>
            <div style={{ fontSize: "11px", color: "#6B7280", marginTop: 4 }}>
              {item.missing_percent > 20 ? "High" : item.missing_percent > 5 ? "Medium" : "Low"}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div style={{
        marginTop: 20,
        padding: 16,
        background: "#1F2937",
        borderRadius: 8,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <div style={{ color: "#9CA3AF", fontSize: "12px" }}>Columns with missing data</div>
          <div style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>
            {sortedData.filter(item => item.missing_percent > 0).length} / {sortedData.length}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#9CA3AF", fontSize: "12px" }}>Total missing values</div>
          <div style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>
            {sortedData.reduce((sum, item) => sum + item.missing_count, 0).toLocaleString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


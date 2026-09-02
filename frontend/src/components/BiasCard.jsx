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

export default function BiasCard({
  biasData,
  columns = [],
  onRunBiasAudit,
  loading = false,
  selectedFeature = "gender",
  selectedTarget = "approved"
}) {
  const [feature, setFeature] = useState(selectedFeature);
  const [target, setTarget] = useState(selectedTarget);

  const handleAudit = (e) => {
    e.preventDefault();
    if (onRunBiasAudit) {
      onRunBiasAudit(feature, target);
    }
  };

  const disparateImpact = biasData?.disparate_impact != null
    ? parseFloat(biasData.disparate_impact)
    : null;

  const statisticalParity = biasData?.statistical_parity != null
    ? parseFloat(biasData.statistical_parity)
    : null;

  const isDisparateImpactPassed = disparateImpact != null && disparateImpact >= 0.80;

  // Format group distribution for chart
  let chartData = [];
  if (biasData?.group_distribution) {
    chartData = Object.entries(biasData.group_distribution).map(([group, outcomes]) => {
      // Find positive rate (typically key 1, '1', or highest key)
      const keys = Object.keys(outcomes);
      const positiveKey = keys.find(k => k === "1" || k === 1 || k.toLowerCase?.() === "yes" || k.toLowerCase?.() === "true") || keys[keys.length - 1];
      const positiveRate = outcomes[positiveKey] ? parseFloat(outcomes[positiveKey]) * 100 : 0;

      return {
        group: String(group),
        positiveRate: Number(positiveRate.toFixed(1)),
        details: outcomes
      };
    });
  }

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card__header">
        <div className="glass-card__icon glass-card__icon--purple">⚖️</div>
        <div>
          <div className="glass-card__title">Demographic Bias & Algorithmic Fairness Audit</div>
          <div className="glass-card__subtitle">Evaluates disparate impact & statistical parity against protected groups</div>
        </div>
      </div>

      {/* Feature / Target Selection Form */}
      <form className="bias-controls" onSubmit={handleAudit}>
        <div className="control-group">
          <label className="control-label" htmlFor="bias-feature-select">
            Sensitive / Protected Feature (Group)
          </label>
          <select
            id="bias-feature-select"
            className="control-select"
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
          >
            {columns.length > 0 ? (
              columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))
            ) : (
              <>
                <option value="gender">gender</option>
                <option value="race">race</option>
                <option value="age">age</option>
              </>
            )}
          </select>
        </div>

        <div className="control-group">
          <label className="control-label" htmlFor="bias-target-select">
            Target Outcome Label (Decision)
          </label>
          <select
            id="bias-target-select"
            className="control-select"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            {columns.length > 0 ? (
              columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))
            ) : (
              <>
                <option value="approved">approved</option>
                <option value="target">target</option>
                <option value="hired">hired</option>
              </>
            )}
          </select>
        </div>

        <button
          type="submit"
          className="bias-audit-btn"
          disabled={loading}
        >
          {loading ? "Evaluating..." : "Run Fairness Audit"}
        </button>
      </form>

      {/* Audit Results */}
      {biasData ? (
        <div className="bias-results-grid">
          {/* Disparate Impact Metric Card */}
          <div className="metric-box">
            <div className="metric-box__header">
              <span className="metric-box__title">Disparate Impact Ratio (4/5th Rule)</span>
              <span className={`status-badge ${isDisparateImpactPassed ? "status-badge--success" : "status-badge--danger"}`}>
                {isDisparateImpactPassed ? "PASSED (≥ 0.80)" : "FAIL / ADVERSE IMPACT (< 0.80)"}
              </span>
            </div>
            <div className="metric-box__value">
              {disparateImpact !== null ? disparateImpact.toFixed(3) : "N/A"}
            </div>
            <p className="metric-box__desc">
              Ratio of positive selection rate of unprivileged group to privileged group.
              The EEOC standard requires a minimum ratio of <strong>0.80</strong>.
            </p>

            {/* Threshold progress bar */}
            <div className="threshold-bar">
              <div
                className="threshold-bar__fill"
                style={{
                  width: `${Math.min(100, (disparateImpact || 0) * 100)}%`,
                  background: isDisparateImpactPassed ? "var(--accent-emerald)" : "var(--accent-rose)"
                }}
              />
              <div className="threshold-bar__marker" style={{ left: "80%" }} title="80% Legal Threshold" />
            </div>
            <div className="threshold-bar__labels">
              <span>0.0 Adverse Impact</span>
              <span style={{ color: "var(--accent-amber)" }}>0.80 EEOC Threshold</span>
              <span>1.0 Full Parity</span>
            </div>
          </div>

          {/* Statistical Parity Difference */}
          <div className="metric-box">
            <div className="metric-box__header">
              <span className="metric-box__title">Statistical Parity Difference</span>
              <span className={`status-badge ${statisticalParity != null && statisticalParity <= 0.1 ? "status-badge--success" : "status-badge--warning"}`}>
                {statisticalParity != null && statisticalParity <= 0.1 ? "LOW DISPARITY" : "HIGH DISPARITY"}
              </span>
            </div>
            <div className="metric-box__value">
              {statisticalParity !== null ? `${(statisticalParity * 100).toFixed(1)}%` : "N/A"}
            </div>
            <p className="metric-box__desc">
              Maximum absolute difference in favorable outcome probability between distinct demographic subgroups. Lower values indicate fairer outcomes.
            </p>
          </div>

          {/* Group Distribution Chart */}
          {chartData.length > 0 && (
            <div className="metric-box metric-box--full">
              <div className="metric-box__header">
                <span className="metric-box__title">Favorable Decision Rate by Group ({feature})</span>
              </div>
              <div style={{ height: 220, marginTop: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="group" stroke="#64748B" tickLine={false} />
                    <YAxis
                      stroke="#64748B"
                      tickLine={false}
                      unit="%"
                      domain={[0, 100]}
                    />
                    <Tooltip
                      formatter={(val) => [`${val}%`, "Positive Rate"]}
                      contentStyle={{
                        background: "rgba(15, 23, 42, 0.95)",
                        borderColor: "rgba(99, 102, 241, 0.3)",
                        borderRadius: 8,
                        color: "#F1F5F9"
                      }}
                    />
                    <Bar dataKey="positiveRate" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={isDisparateImpactPassed ? "var(--accent-emerald)" : "var(--accent-purple)"}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state__icon">⚖️</span>
          <div className="empty-state__title">Select Columns to Audit Fairness</div>
          <p className="empty-state__text">
            Choose a demographic feature (e.g., <code>gender</code>) and the target decision (e.g., <code>approved</code>) then click <strong>Run Fairness Audit</strong> to check for legal compliance and disparate impact.
          </p>
        </div>
      )}
    </motion.div>
  );
}

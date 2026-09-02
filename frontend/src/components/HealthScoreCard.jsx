import { motion } from "framer-motion";

export default function HealthScoreCard({ missingnessData, driftData, biasData }) {
  // Compute composite score
  let score = 100;
  let criticalIssues = 0;
  let warningIssues = 0;
  let healthyFeatures = 0;

  // 1. Missingness impact
  if (missingnessData) {
    const missingValues = Object.values(missingnessData);
    const avgMissing = missingValues.reduce((s, i) => s + (parseFloat(i.missing_percent) || 0), 0) / (missingValues.length || 1);
    const maxMissing = Math.max(...missingValues.map(i => parseFloat(i.missing_percent) || 0), 0);

    if (maxMissing > 20) {
      score -= Math.min(30, maxMissing * 0.8);
      criticalIssues++;
    } else if (maxMissing > 5) {
      score -= Math.min(15, maxMissing * 0.5);
      warningIssues++;
    }

    missingValues.forEach(m => {
      const pct = parseFloat(m.missing_percent) || 0;
      if (pct === 0) healthyFeatures++;
      else if (pct > 20) criticalIssues++;
      else if (pct > 5) warningIssues++;
    });
  }

  // 2. Drift impact
  if (driftData?.feature_drift) {
    const driftedFeatures = Object.values(driftData.feature_drift).filter(f => f.drift_detected);
    if (driftedFeatures.length > 0) {
      score -= Math.min(35, driftedFeatures.length * 12);
      criticalIssues += driftedFeatures.length;
    }
  }

  // 3. Bias impact
  if (biasData?.disparate_impact != null) {
    const di = parseFloat(biasData.disparate_impact);
    if (di < 0.80) {
      score -= Math.min(25, (0.80 - di) * 50);
      criticalIssues++;
    } else {
      healthyFeatures++;
    }
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  let statusColor = "var(--accent-emerald)";
  let statusBadge = "EXCELLENT QUALITY";
  let verdictText = "Dataset meets standard production quality benchmarks with minimal anomalies.";

  if (finalScore < 60) {
    statusColor = "var(--accent-rose)";
    statusBadge = "CRITICAL RISKS DETECTED";
    verdictText = "Dataset contains severe quality risks (high missingness, significant distribution drift, or demographic bias). Model training should be paused until remediation.";
  } else if (finalScore < 85) {
    statusColor = "var(--accent-amber)";
    statusBadge = "NEEDS ATTENTION";
    verdictText = "Moderate quality anomalies detected. Imputation and distribution calibration recommended before production deployment.";
  }

  const strokeDashoffset = 283 - (283 * finalScore) / 100;

  return (
    <motion.div
      className="glass-card health-score-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="health-score-card__grid">
        {/* Radial Score Dial */}
        <div className="health-score-dial">
          <svg className="health-score-dial__svg" viewBox="0 0 100 100">
            <circle
              className="health-score-dial__bg"
              cx="50"
              cy="50"
              r="45"
            />
            <circle
              className="health-score-dial__meter"
              cx="50"
              cy="50"
              r="45"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              stroke={statusColor}
            />
          </svg>
          <div className="health-score-dial__center">
            <span className="health-score-dial__number" style={{ color: statusColor }}>
              {finalScore}
            </span>
            <span className="health-score-dial__label">/ 100</span>
          </div>
        </div>

        {/* Details & Verdict */}
        <div className="health-score-card__content">
          <div className="health-score-card__badge" style={{ borderColor: statusColor, color: statusColor }}>
            <span className="health-score-card__dot" style={{ background: statusColor }} />
            {statusBadge}
          </div>
          <h2 className="health-score-card__title">Dataset Health & Readiness Score</h2>
          <p className="health-score-card__verdict">{verdictText}</p>

          <div className="health-score-card__pills">
            <div className="score-pill score-pill--critical">
              <span className="score-pill__count">{criticalIssues}</span>
              <span className="score-pill__label">Critical Risks</span>
            </div>
            <div className="score-pill score-pill--warning">
              <span className="score-pill__count">{warningIssues}</span>
              <span className="score-pill__label">Warnings</span>
            </div>
            <div className="score-pill score-pill--healthy">
              <span className="score-pill__count">{healthyFeatures}</span>
              <span className="score-pill__label">Passed Checks</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

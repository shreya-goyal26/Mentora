import { Award } from "lucide-react";

export default function ScoreCard({ score = 0 }) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  const getScoreColor = (val) => {
    if (val >= 80) return "#10b981";
    if (val >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const color = getScoreColor(normalizedScore);

  return (
    <div className="card score-card">
      <div className="card-header">
        <div className="flex-inline-gap">
          <Award size={18} style={{ color }} />
          <h4 className="card-title">Resolution Quality Score</h4>
        </div>
      </div>

      <div className="score-display">
        <div
          className="score-circle"
          style={{
            borderColor: color,
            color: color,
          }}
        >
          <span className="score-number">{normalizedScore}</span>
          <span className="score-total">/100</span>
        </div>

        <div className="score-meta">
          <p className="score-grade font-bold">
            {normalizedScore >= 80
              ? "Exemplary Handling"
              : normalizedScore >= 60
              ? "Satisfactory Performance"
              : "Needs Empathy & Resolution Coaching"}
          </p>
          <p className="score-explanation">
            Calculated based on empathy, sentiment progression, customer turns, and de-escalation success.
          </p>
        </div>
      </div>
    </div>
  );
}

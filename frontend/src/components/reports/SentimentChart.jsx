import { BarChart3 } from "lucide-react";
import { SENTIMENT_CONFIG } from "../../utils/constants";

export default function SentimentChart({
  sentiment,
  totalMessages = 0,
  escalationRisk = "Low",
}) {
  const currentSentiment = sentiment || "Neutral";
  const sentimentMeta = SENTIMENT_CONFIG[currentSentiment] || SENTIMENT_CONFIG.Neutral;

  return (
    <div className="card report-chart-card">
      <div className="card-header">
        <div className="flex-inline-gap">
          <BarChart3 size={18} className="text-primary" />
          <h4 className="card-title">Interaction Metrics</h4>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-box">
          <span className="metric-box-label">Total Exchanges</span>
          <span className="metric-box-val">{totalMessages}</span>
          <span className="metric-box-sub">Customer & Agent Turns</span>
        </div>

        <div className="metric-box">
          <span className="metric-box-label">Final Sentiment</span>
          <span
            className="metric-box-val font-semibold"
            style={{ color: sentimentMeta.color }}
          >
            {currentSentiment}
          </span>
          <span className="metric-box-sub">Analyzed by Sentiment Agent</span>
        </div>

        <div className="metric-box">
          <span className="metric-box-label">Escalation Threat</span>
          <span
            className={`metric-box-val font-semibold ${
              escalationRisk === "High"
                ? "text-danger"
                : escalationRisk === "Medium"
                ? "text-warning"
                : "text-success"
            }`}
          >
            {escalationRisk}
          </span>
          <span className="metric-box-sub">Monitored Risk Score</span>
        </div>
      </div>
    </div>
  );
}

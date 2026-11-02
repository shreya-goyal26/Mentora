import { Lightbulb, CheckCircle2 } from "lucide-react";

export default function CoachingRecommendations({ recommendation }) {
  return (
    <div className="card report-coaching-card">
      <div className="card-header">
        <div className="flex-inline-gap">
          <Lightbulb size={18} className="text-warning" />
          <h4 className="card-title">Personalized Coaching Recommendations</h4>
        </div>
      </div>

      <div className="coaching-recommendation-content">
        <div className="recommendation-highlight">
          <CheckCircle2 size={20} className="recommendation-check" />
          <p className="recommendation-text">
            {recommendation || "Maintain polite and clear communication throughout customer inquiries."}
          </p>
        </div>

        <div className="coaching-key-takeaways">
          <h5 className="takeaways-title">Key Improvement Focus:</h5>
          <ul className="takeaways-list">
            <li>
              <strong>Active Listening:</strong> Acknowledge the emotional tone before offering technical solutions.
            </li>
            <li>
              <strong>Policy Precision:</strong> Utilize surfaced RAG knowledge items to provide verified timeframe commitments.
            </li>
            <li>
              <strong>De-escalation:</strong> Respond promptly when escalation triggers are flagged to prevent supervisor transfer.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

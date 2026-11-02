import { Smile, Meh, Frown } from "lucide-react";
import { SENTIMENT_CONFIG } from "../../utils/constants";

export default function SentimentCard({ sentiment }) {
  const currentSentiment = sentiment || "Neutral";
  const config = SENTIMENT_CONFIG[currentSentiment] || SENTIMENT_CONFIG.Neutral;

  const Icon =
    currentSentiment === "Positive"
      ? Smile
      : currentSentiment === "Negative"
      ? Frown
      : Meh;

  return (
    <div className="coaching-mini-card">
      <div className="coaching-mini-header">
        <Icon size={14} style={{ color: config.color }} />
        <span className="coaching-mini-label">Customer Sentiment</span>
      </div>
      <div className="coaching-mini-value">
        <span
          className="badge"
          style={{
            backgroundColor: config.bg,
            color: config.color,
            borderColor: config.border,
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          {sentiment ? config.label : "Awaiting Turn"}
        </span>
      </div>
    </div>
  );
}

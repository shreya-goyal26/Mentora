import { Target } from "lucide-react";

export default function IntentCard({ intent }) {
  return (
    <div className="coaching-mini-card">
      <div className="coaching-mini-header">
        <Target size={14} className="text-primary" />
        <span className="coaching-mini-label">Detected Intent</span>
      </div>
      <div className="coaching-mini-value">
        <span className="badge badge-primary">{intent || "Awaiting Turn"}</span>
      </div>
    </div>
  );
}

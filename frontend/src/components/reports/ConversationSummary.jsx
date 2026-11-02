import { FileText, User, Headset } from "lucide-react";

export default function ConversationSummary({
  conversationHistory = [],
  intent,
}) {
  return (
    <div className="card report-transcript-card">
      <div className="card-header">
        <div className="flex-inline-gap">
          <FileText size={18} className="text-primary" />
          <h4 className="card-title">Session Interaction Transcript</h4>
        </div>
        {intent && <span className="badge badge-primary">Intent: {intent}</span>}
      </div>

      <div className="report-transcript-list">
        {conversationHistory.length === 0 ? (
          <p className="text-muted p-4 text-center">No messages recorded in this session.</p>
        ) : (
          conversationHistory.map((item, idx) => {
            const isCustomer = item.sender === "customer";
            return (
              <div
                key={idx}
                className={`transcript-entry ${
                  isCustomer ? "transcript-customer" : "transcript-agent"
                }`}
              >
                <div className="transcript-meta">
                  {isCustomer ? <User size={14} /> : <Headset size={14} />}
                  <span className="font-semibold">
                    {isCustomer ? "Customer" : "Agent"}
                  </span>
                  <span className="text-xs text-muted">Turn #{idx + 1}</span>
                </div>
                <div className="transcript-content">{item.content}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

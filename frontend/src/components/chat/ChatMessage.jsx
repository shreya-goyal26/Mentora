import { User, Headset } from "lucide-react";
import { formatTime } from "../../utils/formatDate";

export default function ChatMessage({ message, index }) {
  const isCustomer = message.sender === "customer";

  return (
    <div
      className={`chat-bubble-row ${
        isCustomer ? "chat-bubble-customer" : "chat-bubble-agent"
      }`}
    >
      <div className="chat-avatar">
        {isCustomer ? <User size={16} /> : <Headset size={16} />}
      </div>

      <div className="chat-content-wrapper">
        <div className="chat-meta">
          <span className="chat-sender-name">
            {isCustomer ? "Customer" : "Support Agent"}
          </span>
          <span className="chat-turn-badge">Turn #{index + 1}</span>
          {message.timestamp && (
            <span className="chat-time">{formatTime(message.timestamp)}</span>
          )}
        </div>

        <div className="chat-bubble-text">{message.content}</div>
      </div>
    </div>
  );
}

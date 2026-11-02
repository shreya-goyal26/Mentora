import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";
import { MessageSquare, Sparkles } from "lucide-react";
import Loader from "../common/Loader";

export default function ChatWindow({
  messages = [],
  mode,
  sessionInfo,
  onSendMessage,
  onSendAgentReply,
  onSimulateTurn,
  onReplayNext,
  onReplayReset,
  replayState,
  loading = false,
  appliedSuggestion = "",
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat-window-panel">
      {/* Panel Top Meta Header */}
      <div className="panel-header">
        <div className="flex-between full-width">
          <div>
            <h3 className="panel-title flex-inline-gap">
              <MessageSquare size={16} /> Conversation Feed
            </h3>
            <p className="panel-subtitle">
              {sessionInfo?.product_category} &bull; {sessionInfo?.scenario}
            </p>
          </div>
          <span className={`badge badge-mode-${mode}`}>{mode} mode</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="chat-messages-container">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <Sparkles size={32} className="chat-empty-icon" />
            <h4>Conversation Initialized</h4>
            <p>
              {mode === "simulator"
                ? "Click 'Simulate Next Customer Turn' below to trigger the Customer Simulator Agent."
                : mode === "replay"
                ? "Click 'Next Turn' below to step through the transcript."
                : "Paste the customer's incoming message in the box below to run real-time coaching."}
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} index={idx} />
          ))
        )}

        {loading && (
          <div className="chat-bubble-row chat-bubble-loading">
            <Loader size="sm" text="AI Pipeline analyzing turn & knowledge..." />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input / Control Bar */}
      <MessageInput
        mode={mode}
        onSendMessage={onSendMessage}
        onSendAgentReply={onSendAgentReply}
        onSimulateTurn={onSimulateTurn}
        onReplayNext={onReplayNext}
        onReplayReset={onReplayReset}
        replayState={replayState}
        loading={loading}
        appliedSuggestion={appliedSuggestion}
      />
    </div>
  );
}

import { useState } from "react";
import { Send, Bot, Play, SkipForward, RotateCcw, Headset } from "lucide-react";
import Button from "../common/Button";

export default function MessageInput({
  mode,
  onSendMessage,
  onSendAgentReply,
  onSimulateTurn,
  onReplayNext,
  onReplayReset,
  replayState,
  loading = false,
  appliedSuggestion = "",
}) {
  const [content, setContent] = useState("");
  const [prevSuggestion, setPrevSuggestion] = useState(appliedSuggestion);

  // Sync suggestion into input state when prop changes during render
  if (appliedSuggestion !== prevSuggestion) {
    setPrevSuggestion(appliedSuggestion);
    if (appliedSuggestion) {
      setContent(appliedSuggestion);
    }
  }

  const handleCustomerSubmit = (e) => {
    e?.preventDefault();
    if (!content.trim() || loading) return;
    onSendMessage(content.trim());
    setContent("");
  };

  const handleAgentSubmit = (e) => {
    e?.preventDefault();
    if (!content.trim() || loading || !onSendAgentReply) return;
    onSendAgentReply(content.trim());
    setContent("");
  };

  return (
    <div className="chat-input-container">
      {/* Simulator Mode Control Toolbar */}
      {mode === "simulator" && (
        <div className="simulator-toolbar">
          <div className="simulator-info">
            <Bot size={16} className="simulator-icon" />
            <span>AI Customer Simulator</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Bot}
            onClick={onSimulateTurn}
            loading={loading}
          >
            Simulate Next Customer Turn
          </Button>
        </div>
      )}

      {/* Replay Mode Control Toolbar */}
      {mode === "replay" && (
        <div className="replay-toolbar">
          <div className="replay-status">
            <span className="font-semibold">Replay Progress:</span> Turn{" "}
            {replayState?.currentTurn || 0} of {replayState?.totalTurns || 0}
          </div>
          <div className="flex-inline-gap">
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={onReplayReset}
              disabled={loading || !replayState?.currentTurn}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={replayState?.hasMore ? SkipForward : Play}
              onClick={onReplayNext}
              loading={loading}
              disabled={!replayState?.hasMore}
            >
              {replayState?.hasMore ? "Next Turn" : "Replay Finished"}
            </Button>
          </div>
        </div>
      )}

      {/* Message Input Area */}
      <form onSubmit={handleCustomerSubmit} className="chat-input-form">
        <textarea
          className="chat-textarea"
          rows={2}
          placeholder={
            mode === "simulator"
              ? "Type or insert AI suggested agent response to reply to customer..."
              : "Paste incoming customer message to analyze turn, or type your agent reply..."
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (mode === "simulator") {
                handleAgentSubmit(e);
              } else {
                handleCustomerSubmit(e);
              }
            }
          }}
          disabled={loading}
        />

        <div className="chat-input-actions">
          <div>
            {appliedSuggestion && (
              <span className="suggestion-applied-indicator">
                AI Suggestion loaded in input
              </span>
            )}
          </div>

          <div className="flex-inline-gap">
            {mode === "simulator" ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                icon={Headset}
                disabled={!content.trim() || loading}
                loading={loading}
                onClick={handleAgentSubmit}
              >
                Send Agent Reply
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  icon={Headset}
                  disabled={!content.trim() || loading}
                  loading={loading}
                  onClick={handleAgentSubmit}
                >
                  Send Agent Reply
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={Send}
                  disabled={!content.trim() || loading}
                  loading={loading}
                >
                  Analyze Customer Turn
                </Button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

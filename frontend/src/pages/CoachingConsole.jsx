import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSessionById } from "../services/sessionService";
import { sendCustomerMessage, sendAgentMessage, simulateNextTurn } from "../services/messageService";
import { endSession } from "../services/reportService";
import { useSession } from "../hooks/useSession";

import ChatWindow from "../components/chat/ChatWindow";
import IntentCard from "../components/coaching/IntentCard";
import SentimentCard from "../components/coaching/SentimentCard";
import SuggestedResponse from "../components/coaching/SuggestedResponse";
import KnowledgePanel from "../components/coaching/KnowledgePanel";
import EscalationMonitor from "../components/coaching/EscalationMonitor";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import { ArrowLeft, Sparkles, AlertCircle, Upload, Check } from "lucide-react";

// Sample pre-loaded replay transcript for Replay Mode demonstration
const SAMPLE_REPLAY_TURNS = [
  "Hello, I ordered a smartphone 5 days ago and the delivery status has not updated.",
  "I was promised it would arrive yesterday. I am really frustrated and disappointed!",
  "Can you please cancel my order and issue a full refund immediately?",
];

export default function CoachingConsole() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { refreshSessions } = useSession();

  const [sessionData, setSessionData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [coachingState, setCoachingState] = useState({
    intent: null,
    sentiment: null,
    suggested_response: null,
    retrieved_knowledge: [],
    escalation_risk: "Low",
    escalation_reason: null,
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [endModalOpen, setEndModalOpen] = useState(false);
  const [appliedSuggestion, setAppliedSuggestion] = useState("");

  // Replay mode state
  const [replayTurns, setReplayTurns] = useState(SAMPLE_REPLAY_TURNS);
  const [replayIndex, setReplayIndex] = useState(0);
  const [replayFileName, setReplayFileName] = useState("default_customer_transcript.json");

  // Load session from backend
  useEffect(() => {
    let mounted = true;

    async function fetchSession() {
      try {
        const data = await getSessionById(sessionId);
        if (!mounted) return;
        setSessionData(data.session);
        setMessages(data.conversation_history || []);
        if (data.latest_state) {
          setCoachingState(data.latest_state);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Failed to load session:", err);
        setError(err.message || "Failed to load session from backend.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchSession();

    return () => {
      mounted = false;
    };
  }, [sessionId]);

  // Handle Manual Message Submission (POST /api/sessions/{id}/messages)
  const handleSendMessage = async (content) => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await sendCustomerMessage(sessionId, content);
      setMessages(result.conversation_history || []);
      setCoachingState({
        intent: result.intent,
        sentiment: result.sentiment,
        suggested_response: result.suggested_response,
        retrieved_knowledge: result.retrieved_knowledge || [],
        escalation_risk: result.escalation_risk || "Low",
        escalation_reason: result.escalation_reason,
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message to coaching pipeline.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Support Agent Reply (POST /api/sessions/{id}/agent-messages)
  const handleSendAgentReply = async (content) => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await sendAgentMessage(sessionId, content);
      setMessages(result.conversation_history || []);
      setAppliedSuggestion("");
    } catch (err) {
      console.error("Error sending agent reply:", err);
      setError(err.message || "Failed to record agent reply.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Simulator Turn (POST /api/sessions/{id}/simulate-turn)
  const handleSimulateTurn = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const result = await simulateNextTurn(sessionId);
      setMessages(result.conversation_history || []);
      setCoachingState({
        intent: result.intent,
        sentiment: result.sentiment,
        suggested_response: result.suggested_response,
        retrieved_knowledge: result.retrieved_knowledge || [],
        escalation_risk: result.escalation_risk || "Low",
        escalation_reason: result.escalation_reason,
      });
    } catch (err) {
      console.error("Simulator turn failed:", err);
      setError(err.message || "Simulator turn execution failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Replay Next Turn
  const handleReplayNext = async () => {
    if (replayIndex >= replayTurns.length) return;
    const nextMsg = replayTurns[replayIndex];
    setReplayIndex((prev) => prev + 1);
    await handleSendMessage(nextMsg);
  };

  const handleReplayReset = () => {
    setReplayIndex(0);
  };

  // Handle transcript upload in Replay mode
  const handleTranscriptUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReplayFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        // Parse line-by-line or JSON array
        let parsed = [];
        try {
          const json = JSON.parse(text);
          parsed = Array.isArray(json)
            ? json.map((item) => (typeof item === "string" ? item : item.content || JSON.stringify(item)))
            : [text];
        } catch {
          parsed = text.split("\n").filter((line) => line.trim().length > 0);
        }

        if (parsed.length > 0) {
          setReplayTurns(parsed);
          setReplayIndex(0);
        }
      } catch (uploadErr) {
        console.error("Failed to parse transcript:", uploadErr);
        setError("Could not parse transcript file. Supported format: plain text or JSON message array.");
      }
    };
    reader.readAsText(file);
  };

  // Handle End Session (POST /api/sessions/{id}/end)
  const handleEndSession = async () => {
    setActionLoading(true);
    try {
      await endSession(sessionId);
      await refreshSessions();
      navigate(`/session/${sessionId}/report`);
    } catch (err) {
      console.error("Failed to end session:", err);
      setError(err.message || "Failed to conclude session on backend.");
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex-center min-h-400">
        <Loader text="Loading Live Coaching Console..." size="lg" />
      </div>
    );
  }

  if (error && !sessionData) {
    return (
      <div className="page-container">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/")}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const mode = sessionData?.mode || "manual";

  return (
    <div className="console-layout">
      {/* Top Banner / Session Info */}
      <div className="console-top-bar">
        <div className="flex-inline-gap">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate("/sessions")}
          >
            Sessions
          </Button>
          <div className="console-title-group">
            <h3 className="console-title">Live Support Coaching Console</h3>
            <span className="console-session-id mono">ID: {sessionId.slice(0, 8)}...</span>
          </div>
        </div>

        <div className="console-meta-pills">
          <span className="badge badge-outline">{sessionData?.product_category}</span>
          <span className="badge badge-outline">{sessionData?.scenario}</span>
          <span className={`badge badge-mode-${mode}`}>{mode.toUpperCase()}</span>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

      {/* Replay Mode Upload & API Dependency Banner */}
      {mode === "replay" && (
        <div className="replay-upload-banner">
          <div className="flex-between full-width">
            <div className="flex-inline-gap">
              <Upload size={16} className="text-primary" />
              <div>
                <span className="font-semibold text-sm">Transcript: {replayFileName}</span>
                <p className="text-xs text-muted">
                  Client-side transcript parsing active ({replayTurns.length} turns). Backend upload endpoint (POST /api/sessions/{sessionId}/transcript) planned for Milestone 3.
                </p>
              </div>
            </div>
            <label className="btn btn-outline btn-sm file-upload-label">
              Upload Custom File
              <input
                type="file"
                accept=".txt,.json,.csv"
                onChange={handleTranscriptUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
      )}

      {/* 3-Panel Coaching Grid */}
      <div className="three-panel-grid">
        {/* PANEL 1: Conversation Window */}
        <section className="panel-col panel-col-chat">
          <ChatWindow
            messages={messages}
            mode={mode}
            sessionInfo={sessionData}
            onSendMessage={handleSendMessage}
            onSendAgentReply={handleSendAgentReply}
            onSimulateTurn={handleSimulateTurn}
            onReplayNext={handleReplayNext}
            onReplayReset={handleReplayReset}
            appliedSuggestion={appliedSuggestion}
            replayState={{
              currentTurn: replayIndex,
              totalTurns: replayTurns.length,
              hasMore: replayIndex < replayTurns.length,
            }}
            loading={actionLoading}
          />
        </section>

        {/* PANEL 2: Real-Time AI Coaching & Knowledge */}
        <section className="panel-col panel-col-coaching">
          <div className="coaching-header-card">
            <Sparkles size={16} className="text-accent" />
            <h4 className="font-semibold text-sm">Live Multi-Agent Coaching Feed</h4>
          </div>

          <div className="grid-2 gap-3 mb-3">
            <IntentCard intent={coachingState.intent} />
            <SentimentCard sentiment={coachingState.sentiment} />
          </div>

          <SuggestedResponse
            response={coachingState.suggested_response}
            onApply={(resp) => setAppliedSuggestion(resp)}
          />

          <KnowledgePanel knowledge={coachingState.retrieved_knowledge} />
        </section>

        {/* PANEL 3: Escalation Risk Monitor & Controls */}
        <section className="panel-col panel-col-escalation">
          <EscalationMonitor
            risk={coachingState.escalation_risk}
            reason={coachingState.escalation_reason}
            onEndSession={() => setEndModalOpen(true)}
            loading={actionLoading}
          />
        </section>
      </div>

      {/* End Session Confirmation Modal */}
      <Modal
        isOpen={endModalOpen}
        onClose={() => setEndModalOpen(false)}
        title="Conclude Coaching Session?"
        footer={
          <div className="flex-inline-gap justify-end full-width">
            <Button
              variant="outline"
              onClick={() => setEndModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              icon={Check}
              onClick={handleEndSession}
              loading={actionLoading}
            >
              Confirm & Generate Report
            </Button>
          </div>
        }
      >
        <div className="flex-inline-gap mb-3">
          <AlertCircle size={24} className="text-warning flex-shrink-0" />
          <p className="text-sm">
            Ending this session will finalize all turns and trigger the <strong>Post-Interaction Summary Agent</strong> to calculate your final resolution quality score and coaching recommendations.
          </p>
        </div>
      </Modal>
    </div>
  );
}

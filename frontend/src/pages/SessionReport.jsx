import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSessionById } from "../services/sessionService";
import { endSession } from "../services/reportService";
import ScoreCard from "../components/reports/ScoreCard";
import SentimentChart from "../components/reports/SentimentChart";
import CoachingRecommendations from "../components/reports/CoachingRecommendations";
import ConversationSummary from "../components/reports/ConversationSummary";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Button from "../components/common/Button";
import { Printer, ArrowLeft, Award } from "lucide-react";

export default function SessionReport() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function generateReport() {
      try {
        const data = await getSessionById(sessionId);
        if (!mounted) return;
        setSession(data.session);
        setHistory(data.conversation_history || []);

        if (data.summary) {
          setSummary(data.summary);
        } else {
          // If session was not yet officially finalized, finalize it now
          const endResult = await endSession(sessionId);
          if (!mounted) return;
          setSummary(endResult.summary);
          if (endResult.conversation_history) {
            setHistory(endResult.conversation_history);
          }
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Failed to generate report:", err);
        setError(err.message || "Failed to load session report from backend.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    generateReport();

    return () => {
      mounted = false;
    };
  }, [sessionId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="page-container flex-center min-h-400">
        <Loader text="Generating Post-Interaction Performance Report..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/sessions")}>
          Return to Sessions
        </Button>
      </div>
    );
  }

  return (
    <div className="page-container print-container">
      {/* Report Header Bar */}
      <div className="report-header-bar flex-between mb-4">
        <div>
          <div className="badge badge-success flex-inline-gap mb-1">
            <Award size={12} /> Post-Interaction Analysis Complete
          </div>
          <h2 className="report-title">Agent Performance Evaluation Report</h2>
          <p className="report-meta">
            Session: <span className="mono">{sessionId}</span> &bull; Mode:{" "}
            <span className="font-semibold">{session?.mode}</span> &bull; Scenario:{" "}
            <span className="font-semibold">{session?.scenario}</span>
          </p>
        </div>

        <div className="report-actions flex-inline-gap">
          <Button
            variant="outline"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate("/sessions")}
          >
            All Sessions
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
          >
            Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Top Scores & Metrics Grid */}
      <div className="report-top-grid">
        <ScoreCard score={summary?.resolution_quality_score ?? 75} />
        <SentimentChart
          sentiment={summary?.sentiment}
          totalMessages={summary?.total_messages || history.length}
          escalationRisk={summary?.escalation_risk}
        />
      </div>

      {/* Coaching Recommendations */}
      <div className="mt-4">
        <CoachingRecommendations
          recommendation={summary?.coaching_recommendation}
        />
      </div>

      {/* Conversation Transcript */}
      <div className="mt-4">
        <ConversationSummary
          conversationHistory={history}
          intent={summary?.intent}
        />
      </div>
    </div>
  );
}

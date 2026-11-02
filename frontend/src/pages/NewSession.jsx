import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSession } from "../services/sessionService";
import { useSession } from "../hooks/useSession";
import SessionForm from "../components/session/SessionForm";
import ErrorMessage from "../components/common/ErrorMessage";
import { Sparkles, ArrowLeft } from "lucide-react";
import Button from "../components/common/Button";

export default function NewSession() {
  const navigate = useNavigate();
  const { refreshSessions } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateSession = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const newSession = await createSession(payload);
      await refreshSessions();
      if (newSession && newSession.session_id) {
        navigate(`/session/${newSession.session_id}`);
      } else {
        throw new Error("Backend did not return a session ID.");
      }
    } catch (err) {
      console.error("Session creation failed:", err);
      setError(err.message || "Failed to initialize session on backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container page-narrow">
      <div className="page-header">
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <div className="mt-2">
          <div className="badge badge-primary flex-inline-gap mb-2">
            <Sparkles size={12} /> Milestone 1 Interaction Setup
          </div>
          <h2 className="page-title">Configure Coaching Session</h2>
          <p className="page-desc">
            Define your interaction mode, scenario context, and simulated customer persona before entering the coaching console.
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

      <div className="card">
        <SessionForm onSubmit={handleCreateSession} loading={loading} />
      </div>
    </div>
  );
}

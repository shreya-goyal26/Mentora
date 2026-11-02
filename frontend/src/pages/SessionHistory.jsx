import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSessions } from "../services/sessionService";
import { formatDate } from "../utils/formatDate";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { PlusCircle, History, MessageSquare, ArrowRight, Clock, RefreshCw } from "lucide-react";

export default function SessionHistory() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessions();
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load sessions:", err);
      setError(err.message || "Failed to load session history from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await getSessions();
        if (mounted) {
          setSessions(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (mounted) {
          console.error("Failed to load sessions:", err);
          setError(err.message || "Failed to load session history from backend.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="page-container">
      <div className="flex-between mb-4">
        <div>
          <h2 className="page-title flex-inline-gap">
            <History size={22} className="text-primary" /> Session History
          </h2>
          <p className="page-desc">
            All recorded support coaching interactions and completed performance reports.
          </p>
        </div>

        <div className="flex-inline-gap">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={fetchSessions}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => navigate("/new-session")}
          >
            New Session
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchSessions} />}

      {loading ? (
        <div className="card p-6 flex-center">
          <Loader text="Loading session history from backend..." />
        </div>
      ) : sessions.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={MessageSquare}
            title="No Coaching Sessions Found"
            description="Start your first session to begin tracking agent performance and real-time coaching."
            action={
              <Button
                variant="primary"
                onClick={() => navigate("/new-session")}
              >
                Create First Session
              </Button>
            }
          />
        </div>
      ) : (
        <div className="card table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Mode</th>
                  <th>Product Category</th>
                  <th>Scenario</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.session_id}>
                    <td className="mono font-semibold">
                      {s.session_id.slice(0, 8)}...
                    </td>
                    <td>
                      <span className={`badge badge-mode-${s.mode}`}>
                        {s.mode}
                      </span>
                    </td>
                    <td>{s.product_category}</td>
                    <td>{s.scenario}</td>
                    <td>
                      <span
                        className={`badge ${
                          s.status === "completed"
                            ? "badge-success"
                            : "badge-active"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="text-muted text-sm">
                      <span className="flex-inline-gap">
                        <Clock size={12} />
                        {formatDate(s.created_at)}
                      </span>
                    </td>
                    <td className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={ArrowRight}
                        onClick={() =>
                          navigate(
                            s.status === "completed"
                              ? `/session/${s.session_id}/report`
                              : `/session/${s.session_id}`
                          )
                        }
                      >
                        {s.status === "completed" ? "View Report" : "Open Console"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageSquare, Clock } from "lucide-react";
import { formatDate } from "../../utils/formatDate";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";

export default function RecentSessions({ sessions = [], loading = false }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="card table-card">
        <div className="card-header">
          <h3 className="card-title">Recent Coaching Sessions</h3>
        </div>
        <div className="table-loading">Loading sessions...</div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="card table-card">
        <div className="card-header">
          <h3 className="card-title">Recent Coaching Sessions</h3>
        </div>
        <EmptyState
          icon={MessageSquare}
          title="No Sessions Recorded Yet"
          description="Start your first AI coaching interaction in Simulator, Manual, or Replay mode."
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/new-session")}
            >
              Start New Session
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="card table-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Recent Coaching Sessions</h3>
          <p className="card-subtitle">Real-time interactions tracked across modes</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={ArrowRight}
          onClick={() => navigate("/sessions")}
        >
          View All
        </Button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Mode</th>
              <th>Product</th>
              <th>Scenario</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.slice(0, 5).map((s) => (
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
                <td className="text-truncate">{s.scenario}</td>
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
                <td>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      navigate(
                        s.status === "completed"
                          ? `/session/${s.session_id}/report`
                          : `/session/${s.session_id}`
                      )
                    }
                  >
                    {s.status === "completed" ? "Report" : "Open Console"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

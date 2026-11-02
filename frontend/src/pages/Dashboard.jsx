import { useNavigate } from "react-router-dom";
import { PlusCircle, Activity, CheckCircle, Clock, Sparkles } from "lucide-react";
import { useSession } from "../hooks/useSession";
import StatCard from "../components/dashboard/StatCard";
import RecentSessions from "../components/dashboard/RecentSessions";
import Button from "../components/common/Button";

export default function Dashboard() {
  const navigate = useNavigate();
  const { sessions, sessionsLoading, backendStatus } = useSession();

  const totalSessions = sessions.length;
  const activeSessions = sessions.filter((s) => s.status === "active").length;
  const completedSessions = sessions.filter((s) => s.status === "completed").length;

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div className="dashboard-hero">
        <div className="hero-text">
          <div className="hero-badge">
            <Sparkles size={14} /> AI Real-Time Agent Guidance
          </div>
          <h2 className="hero-title">Support Coaching Dashboard</h2>
          <p className="hero-desc">
            Monitor live customer conversations, test simulator scenarios, and empower agents with instant RAG-powered knowledge suggestions and escalation alerts.
          </p>
        </div>

        <div className="hero-actions">
          <Button
            variant="primary"
            size="lg"
            icon={PlusCircle}
            onClick={() => navigate("/new-session")}
            disabled={!backendStatus.connected}
          >
            Start New Session
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <StatCard
          title="Total Sessions"
          value={totalSessions}
          subtitle="All recorded coaching interactions"
          icon={Activity}
          variant="blue"
        />
        <StatCard
          title="Active Sessions"
          value={activeSessions}
          subtitle="In-progress live consoles"
          icon={Clock}
          variant="amber"
        />
        <StatCard
          title="Completed Sessions"
          value={completedSessions}
          subtitle="Post-interaction reports generated"
          icon={CheckCircle}
          variant="emerald"
        />
      </div>

      {/* Recent Sessions Table */}
      <RecentSessions sessions={sessions} loading={sessionsLoading} />
    </div>
  );
}

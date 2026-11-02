import { Bot, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { useSession } from "../../hooks/useSession";

export default function Header() {
  const { backendStatus, verifyBackend } = useSession();

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-badge">
          <Bot className="logo-icon" size={22} />
        </div>
        <div>
          <h1 className="header-title">AI Customer Support Coach</h1>
          <span className="header-subtitle">Real-Time Coaching & Knowledge Assistant</span>
        </div>
      </div>

      <div className="header-right">
        {/* Preserved working backend connection test status */}
        <div
          className={`backend-pill ${
            backendStatus.connected ? "pill-connected" : "pill-disconnected"
          }`}
          title={backendStatus.message}
        >
          {backendStatus.connected ? (
            <CheckCircle2 size={14} className="pill-icon" />
          ) : (
            <XCircle size={14} className="pill-icon" />
          )}
          <span className="pill-label">
            {backendStatus.connected ? "Backend Connected" : "Backend Offline"}
          </span>
          <button
            type="button"
            className="pill-refresh-btn"
            onClick={verifyBackend}
            title="Refresh /api/status check"
            disabled={backendStatus.loading}
          >
            <RefreshCw
              size={12}
              className={backendStatus.loading ? "spin" : ""}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

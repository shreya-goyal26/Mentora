import { AlertTriangle, ShieldCheck, ShieldAlert, AlertCircle, LogOut } from "lucide-react";
import { ESCALATION_LEVELS } from "../../utils/constants";
import Button from "../common/Button";

export default function EscalationMonitor({
  risk = "Low",
  reason,
  onEndSession,
  loading = false,
}) {
  const currentRisk = risk || "Low";
  const config = ESCALATION_LEVELS[currentRisk] || ESCALATION_LEVELS.Low;
  const isHighRisk = currentRisk === "High";

  const RiskIcon =
    currentRisk === "High"
      ? ShieldAlert
      : currentRisk === "Medium"
      ? AlertTriangle
      : ShieldCheck;

  return (
    <div className="escalation-panel">
      {/* High Risk Overlay / Warning Banner */}
      {isHighRisk && (
        <div className="escalation-alert-banner">
          <div className="flex-inline-gap">
            <AlertCircle size={20} className="alert-icon-pulse" />
            <div>
              <p className="font-bold">CRITICAL ESCALATION RISK</p>
              <p className="text-sm">
                Severe customer dissatisfaction detected. Initiate de-escalation protocol immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Risk Gauge Card */}
      <div className="card risk-card">
        <div className="card-header">
          <div className="flex-inline-gap">
            <RiskIcon size={18} style={{ color: config.color }} />
            <h4 className="card-title">Escalation Risk Monitor</h4>
          </div>
          <span
            className="badge font-bold"
            style={{
              backgroundColor: config.bg,
              color: config.color,
              borderColor: config.border,
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          >
            {config.label}
          </span>
        </div>

        {/* Visual 3-Level Risk Bar */}
        <div className="risk-meter-container">
          <div className="risk-segments">
            <div
              className={`risk-segment seg-low ${
                currentRisk === "Low" || currentRisk === "Medium" || currentRisk === "High"
                  ? "active"
                  : ""
              }`}
            >
              Low
            </div>
            <div
              className={`risk-segment seg-medium ${
                currentRisk === "Medium" || currentRisk === "High" ? "active" : ""
              }`}
            >
              Medium
            </div>
            <div
              className={`risk-segment seg-high ${
                currentRisk === "High" ? "active" : ""
              }`}
            >
              High
            </div>
          </div>
        </div>

        {/* Escalation Reasoning */}
        <div className="risk-reason-box">
          <p className="risk-reason-label">Escalation Analysis Reason:</p>
          <p className="risk-reason-text">
            {reason || "Monitoring turns for negative sentiment, dissatisfaction, or cancellation signals."}
          </p>
        </div>
      </div>

      {/* Session Management Action */}
      <div className="card end-session-card">
        <h4 className="end-session-title">Session Management</h4>
        <p className="end-session-desc">
          Conclude this interaction to run the Post-Interaction Summary Agent and generate your performance report.
        </p>
        <Button
          variant="danger"
          size="md"
          icon={LogOut}
          onClick={onEndSession}
          loading={loading}
          className="full-width"
        >
          End Session & Generate Report
        </Button>
      </div>
    </div>
  );
}

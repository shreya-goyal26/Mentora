import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

export default function ErrorMessage({
  message = "An error occurred while communicating with the backend.",
  onRetry,
}) {
  return (
    <div className="error-banner">
      <div className="error-banner-icon">
        <AlertCircle size={20} />
      </div>
      <div className="error-banner-content">
        <p className="error-banner-text">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" icon={RefreshCw} onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

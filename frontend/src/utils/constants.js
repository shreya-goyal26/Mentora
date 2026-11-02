export const INTERACTION_MODES = [
  {
    id: "simulator",
    title: "Simulator Mode",
    description: "AI Customer Simulator generates realistic customer turns based on persona and scenario.",
    badge: "Automated",
  },
  {
    id: "manual",
    title: "Manual Mode",
    description: "Paste incoming customer messages in real-time to receive instant AI coaching guidance.",
    badge: "Live Assist",
  },
  {
    id: "replay",
    title: "Replay Mode",
    description: "Step message-by-message through a recorded support transcript for post-call training.",
    badge: "Training",
  },
];

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Fashion",
  "Banking",
  "Travel",
  "General Support",
];

export const SCENARIOS = [
  "Late Delivery",
  "Refund Request",
  "Payment Issue",
  "Product Complaint",
  "General Query",
];

export const COMMUNICATION_STYLES = [
  { value: "polite", label: "Polite & Inquisitive" },
  { value: "neutral", label: "Neutral & Direct" },
  { value: "impatient", label: "Impatient & Demanding" },
];

export const PATIENCE_LEVELS = [
  { value: "high", label: "High (Tolerant of delays)" },
  { value: "medium", label: "Medium (Expects prompt help)" },
  { value: "low", label: "Low (Easily triggered)" },
];

export const ESCALATION_LEVELS = {
  Low: {
    color: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    label: "Low Risk",
    description: "Conversation is proceeding normally.",
  },
  Medium: {
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    label: "Medium Risk",
    description: "Customer expressing dissatisfaction. Monitor closely.",
  },
  High: {
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
    label: "High Risk",
    description: "Critical escalation risk detected. De-escalate immediately.",
  },
};

export const SENTIMENT_CONFIG = {
  Positive: {
    color: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    label: "Positive",
  },
  Neutral: {
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
    label: "Neutral",
  },
  Negative: {
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
    label: "Negative",
  },
};

import { request } from "./api";

/**
 * Checks FastAPI backend health and connectivity via /api/status.
 * Preserves the original working check from App.jsx.
 */
export async function checkBackendStatus(signal) {
  return request("/api/status", { signal });
}

/**
 * Retrieves all registered coaching sessions.
 */
export async function getSessions() {
  return request("/api/sessions");
}

/**
 * Retrieves full details, history, and latest coaching state for a session.
 */
export async function getSessionById(sessionId) {
  return request(`/api/sessions/${sessionId}`);
}

/**
 * Creates a new coaching session.
 * @param {Object} payload { mode, product_category, scenario, customer_persona }
 */
export async function createSession(payload) {
  return request("/api/sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

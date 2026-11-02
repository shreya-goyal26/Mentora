import { request } from "./api";

/**
 * Sends a customer message in Manual or Replay mode to trigger the real-time coaching pipeline.
 * @param {string} sessionId
 * @param {string} content
 */
export async function sendCustomerMessage(sessionId, content) {
  return request(`/api/sessions/${sessionId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

/**
 * Records an actual agent message in conversation history.
 * @param {string} sessionId
 * @param {string} content
 */
export async function sendAgentMessage(sessionId, content) {
  return request(`/api/sessions/${sessionId}/agent-messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

/**
 * Triggers the Customer Simulator Agent to generate the next turn.
 * @param {string} sessionId
 */
export async function simulateNextTurn(sessionId) {
  return request(`/api/sessions/${sessionId}/simulate-turn`, {
    method: "POST",
  });
}

import { request } from "./api";

/**
 * Ends a session and executes the Post-Interaction Summary Agent.
 * @param {string} sessionId
 */
export async function endSession(sessionId) {
  return request(`/api/sessions/${sessionId}/end`, {
    method: "POST",
  });
}

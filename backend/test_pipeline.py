from orchestration.orchestrator import (
    run_coaching_pipeline,
    run_post_interaction_pipeline
)

state = {
    "session_id": "test-123",
    "customer_message": "My order has not arrived and I am very frustrated!",
    "agent_response": None,
    "intent": None,
    "sentiment": None,
    "retrieved_knowledge": [],
    "suggested_response": None,
    "escalation_risk": None,
    "escalation_reason": None,
    "conversation_history": [
        {
            "sender": "customer",
            "content": "My order has not arrived and I am very frustrated!"
        }
    ],
    "summary": None
}

result = run_coaching_pipeline(state)

print("\n--- LIVE COACHING RESULTS ---")
print("Intent:", result["intent"])
print("Sentiment:", result["sentiment"])
print("Knowledge:", result["retrieved_knowledge"])
print("Suggested Response:", result["suggested_response"])
print("Escalation Risk:", result["escalation_risk"])

result = run_post_interaction_pipeline(result)

print("\n--- POST INTERACTION REPORT ---")
print(result["summary"])
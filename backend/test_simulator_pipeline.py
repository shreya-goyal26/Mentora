from orchestration.orchestrator import run_simulator
from orchestration.conversation_manager import get_conversation_history

state = {
    "session_id": "test123",
    "scenario": "late delivery",
    "frustration_level": 4,
    "communication_style": "impatient",
    "customer_message": "",
    "agent_response": None,
    "intent": None,
    "sentiment": None,
    "retrieved_knowledge": [],
    "suggested_response": None,
    "escalation_risk": None,
    "escalation_reason": None,
    "conversation_history": [],
    "summary": None
}

result = run_simulator(state)

print("Customer Message:", result["customer_message"])
print("Intent:", result["intent"])
print("Sentiment:", result["sentiment"])
print("Suggested Response:", result["suggested_response"])
print("Escalation Risk:", result["escalation_risk"])

print("\n--- CONVERSATION HISTORY ---")

for message in get_conversation_history(result):
    print(message["sender"], ":", message["content"])
from agents.escalation_agent import monitor_escalation

state = {
    "session_id": "test-123",
    "customer_message": "I want to file a complaint immediately!",
    "agent_response": None,
    "intent": "General Query",
    "sentiment": "Negative",
    "retrieved_knowledge": [],
    "suggested_response": None,
    "escalation_risk": None,
    "escalation_reason": None,
    "conversation_history": []
}

result = monitor_escalation(state)

print("Escalation Risk:", result["escalation_risk"])
print("Reason:", result["escalation_reason"])
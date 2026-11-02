from agents.summary_agent import generate_summary

state = {
    "session_id": "test-123",
    "customer_message": "My order has not arrived!",
    "agent_response": "Let me check your order.",
    "intent": "Order Tracking",
    "sentiment": "Negative",
    "retrieved_knowledge": [],
    "suggested_response": "I understand your concern.",
    "escalation_risk": "Medium",
    "escalation_reason": "Customer is dissatisfied.",
    "conversation_history": [
        {"sender": "customer", "content": "My order has not arrived!"},
        {"sender": "agent", "content": "Let me check your order."}
    ],
    "summary": None
}

result = generate_summary(state)

print("Post Interaction Report:")
for key, value in result["summary"].items():
    print(key, ":", value)
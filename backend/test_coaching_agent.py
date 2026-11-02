from agents.coaching_agent import generate_suggestion

state = {
    "session_id": "test-123",
    "customer_message": "My order has not arrived!",
    "agent_response": None,
    "intent": "Order Tracking",
    "sentiment": "Negative",
    "retrieved_knowledge": [
        "Orders are usually delivered within 3-5 business days."
    ],
    "suggested_response": None,
    "escalation_risk": None,
    "escalation_reason": None,
    "conversation_history": []
}

result = generate_suggestion(state)

print("Suggested Response:")
print(result["suggested_response"])
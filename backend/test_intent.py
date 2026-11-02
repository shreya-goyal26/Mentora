from agents.intent_agent import analyze_intent_and_sentiment

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
    "conversation_history": []
}

result = analyze_intent_and_sentiment(state)

print("Intent:", result["intent"])
print("Sentiment:", result["sentiment"])
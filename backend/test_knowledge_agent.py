from agents.knowledge_agent import recommend_knowledge

state = {
    "session_id": "test-123",
    "customer_message": "Can I return my order?",
    "agent_response": None,
    "intent": "Refund or Return",
    "sentiment": "Neutral",
    "retrieved_knowledge": [],
    "suggested_response": None,
    "escalation_risk": None,
    "escalation_reason": None,
    "conversation_history": []
}

result = recommend_knowledge(state)

print("Retrieved Knowledge:")
for item in result["retrieved_knowledge"]:
    print("-", item)
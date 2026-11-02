
def generate_summary(state):
    history = state["conversation_history"]
    sentiment = state["sentiment"]
    risk = state["escalation_risk"]

    total_messages = len(history)

    score = 100

    if sentiment == "Negative":
        score -= 15
    elif sentiment == "Neutral":
        score -= 5

    if risk == "High":
        score -= 35
    elif risk == "Medium":
        score -= 20

    agent_messages = [
        msg for msg in history
        if msg["sender"] == "agent"
    ]

    if not agent_messages:
        score -= 20

    score = max(0, min(100, score))

    if sentiment == "Negative":
        recommendation = "Improve empathy and acknowledge customer frustration."
    elif sentiment == "Positive":
        recommendation = "Maintain the positive communication style."
    else:
        recommendation = "Continue using clear and helpful communication."

    summary = {
        "total_messages": total_messages,
        "intent": state["intent"],
        "sentiment": sentiment,
        "escalation_risk": risk,
        "resolution_quality_score": score,
        "coaching_recommendation": recommendation
    }

    state["summary"] = summary

    return state

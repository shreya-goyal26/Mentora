def monitor_escalation(state):
    message = (state.get("customer_message") or "").lower()
    sentiment = state.get("sentiment", "Neutral")

    high_risk_words = [
        "complaint",
        "legal action",
        "lawsuit",
        "fraud",
        "cancel",
        "supervisor",
        "manager"
    ]

    medium_risk_words = [
        "angry",
        "frustrated",
        "disappointed",
        "unacceptable",
        "third time",
        "delayed",
        "annoying"
    ]

    if any(word in message for word in high_risk_words):
        risk = "High"
        reason = "Customer has expressed a cancellation, complaint, or escalation request."

    elif sentiment == "Negative" or any(word in message for word in medium_risk_words):
        risk = "Medium"
        reason = "Customer is showing dissatisfaction or reporting delays."

    else:
        risk = "Low"
        reason = "No significant escalation signals detected."

    state["escalation_risk"] = risk
    state["escalation_reason"] = reason

    return state

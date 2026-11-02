def analyze_intent_and_sentiment(state):
    message = (state.get("customer_message") or "").lower().strip()
    history = state.get("conversation_history") or []

    # Recent customer messages for contextual awareness
    recent_customer_messages = [
        m.get("content", "").lower() 
        for m in history 
        if m.get("sender") == "customer"
    ]

    # 1. Confirmation / Closing Intent
    confirmation_phrases = [
        "thank you", "thanks", "helps a lot", "that helps a lot", 
        "all set", "that is all", "great, thank you", "appreciate your help"
    ]

    # 2. Cancellation Intent
    cancellation_keywords = [
        "cancel", "cancellation", "cancel my order", "cancel the order", 
        "don't want it anymore", "abort order", "stop the order"
    ]
    
    # 3. Refund Intent (Explicitly prioritized over generic queries)
    refund_keywords = [
        "refund", "money back", "reimbursement", "reimburse", 
        "credit back", "return for refund", "refund to my card", 
        "refund status", "get my refund"
    ]

    # 4. Payment Issue Intent
    payment_keywords = [
        "charged", "payment failed", "payment issue", "transaction failed", 
        "deducted", "double charged", "billing", "invoice", "bank statement"
    ]

    # 5. Delivery Delay & Courier Follow-up Intent
    delay_keywords = [
        "courier", "delayed", "delay", "late", "sorting hub", "held up", 
        "stuck in transit", "expedite", "check with the courier", 
        "running late", "not received on time", "still waiting"
    ]

    # 6. Order Tracking Intent
    tracking_keywords = [
        "track", "tracking", "tracking id", "tracking number", 
        "where is my order", "order status", "shipment status", 
        "has it shipped", "where has it reached"
    ]

    # 7. Product Complaint Intent
    complaint_keywords = [
        "damaged", "defective", "broken", "wrong item", "faulty", 
        "torn packaging", "poor quality", "not working"
    ]

    # Sentiment Analysis first to detect resolution / satisfaction
    negative_words = [
        "angry", "frustrated", "frustrating", "disappointed", "annoying", 
        "unacceptable", "terrible", "delayed", "horrible", "upset", "worst", 
        "ridiculous", "hurry"
    ]
    positive_words = [
        "happy", "great", "good", "thank", "thanks", "satisfied", 
        "appreciate", "helpful", "perfect", "wonderful", "excellent", "helps a lot"
    ]

    if any(word in message for word in negative_words):
        sentiment = "Negative"
    elif any(word in message for word in positive_words):
        sentiment = "Positive"
    else:
        sentiment = "Neutral"

    # Intent Classification Logic
    # If the customer is thanking the agent or expressing resolution satisfaction:
    is_thanking = any(phrase in message for phrase in confirmation_phrases)
    if is_thanking and sentiment == "Positive":
        intent = "Confirmation"
    elif any(word in message for word in refund_keywords) and not is_thanking:
        intent = "Refund"
    elif any(word in message for word in cancellation_keywords) and not is_thanking:
        intent = "Cancellation"
    elif any(word in message for word in payment_keywords):
        intent = "Payment Issue"
    elif any(word in message for word in delay_keywords):
        intent = "Delivery Delay"
    elif any(word in message for word in tracking_keywords):
        intent = "Order Tracking"
    elif any(word in message for word in complaint_keywords):
        intent = "Product Complaint"
    elif is_thanking:
        intent = "Confirmation"
    else:
        # Contextual fallback check
        if any("refund" in prev for prev in recent_customer_messages[-2:]):
            if any(w in message for w in ["money", "card", "account", "when"]):
                intent = "Refund"
            else:
                intent = "General Query"
        elif any("cancel" in prev for prev in recent_customer_messages[-2:]):
            intent = "Cancellation"
        else:
            intent = "General Query"

    state["intent"] = intent
    state["sentiment"] = sentiment

    return state

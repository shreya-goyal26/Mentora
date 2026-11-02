def generate_suggestion(state):
    intent = state.get("intent") or "General Query"
    sentiment = state.get("sentiment", "Neutral")
    knowledge = state.get("retrieved_knowledge", [])
    history = state.get("conversation_history") or []

    # Count previous agent turns to avoid repeating introductory apologies
    agent_message_count = len([m for m in history if m.get("sender") == "agent"])
    is_frustrated = sentiment == "Negative" or state.get("escalation_risk") == "High"

    # Select primary knowledge snippet
    knowledge_fact = knowledge[0] if knowledge else ""

    # Tailored, context-aware suggestions directly addressing customer request
    # Note: Avoid making unsupported claims about completed backend actions (e.g. real payment/refund executions)
    if intent == "Cancellation":
        if is_frustrated:
            response = (
                "I understand your frustration with this delay, and I apologize for the trouble. "
                "I am happy to assist you with submitting a cancellation request for your order so it can be processed for a full refund."
            )
        else:
            response = (
                "I can certainly help you submit a cancellation request for this order. "
                "Orders cancelled prior to delivery qualify for a full refund with zero cancellation fees."
            )
        if knowledge_fact and "cancelled" in knowledge_fact:
            response += f" {knowledge_fact}"

    elif intent == "Refund":
        if is_frustrated:
            response = (
                "I understand how important this is to you, and I'm happy to help with your refund request. "
                "Once the cancellation and refund are processed, the amount should return to your original payment method within 5–7 business days."
            )
        else:
            response = (
                "I'm happy to help with your refund. "
                "Once the cancellation and refund are processed, the amount should return to your original payment method within 5–7 business days."
            )
        if knowledge_fact and "reference ID" in knowledge_fact:
            response += f" {knowledge_fact}"

    elif intent == "Delivery Delay":
        if is_frustrated or agent_message_count > 0:
            response = (
                "I apologize for the continued delay with your shipment. "
                "I can submit an expedited inquiry with our courier partner to request an urgent transit update for you."
            )
        else:
            response = (
                "I understand your package is running behind schedule. "
                "Let me initiate an inquiry with our courier partner to check on the delivery timeline."
            )
        if knowledge_fact and "courier" in knowledge_fact:
            response += f" {knowledge_fact}"

    elif intent == "Order Tracking":
        if is_frustrated:
            response = (
                "I'm sorry for the inconvenience and understand your concern. "
                "Let me look up your order status and provide the latest tracking details."
            )
        elif agent_message_count > 0:
            response = "Here are the latest tracking details for your order."
        else:
            response = (
                "Thank you for contacting us. "
                "Let me help you check your order status."
            )
        if knowledge_fact and "delivered within" in knowledge_fact:
            response += f" {knowledge_fact}"

    elif intent == "Payment Issue":
        if is_frustrated:
            response = (
                "I understand your concern regarding the deducted payment. "
                "I can help escalate a payment verification ticket with our billing team to review this transaction."
            )
        else:
            response = (
                "I can help you review your payment details. "
                "Please share your transaction reference number so our billing team can verify it."
            )
        if knowledge_fact and "transaction" in knowledge_fact:
            response += f" {knowledge_fact}"

    elif intent == "Product Complaint":
        response = (
            "I am very sorry that the item you received is not in acceptable condition. "
            "I can help submit a request for a free replacement and arrange return pickup for you."
        )
        if knowledge_fact and "replacement" in knowledge_fact:
            response += f" {knowledge_fact}"

    elif intent == "Confirmation":
        response = (
            "You are very welcome! I'm glad I could provide those details and help with your request. "
            "Please feel free to reach out if you need anything else. Have a wonderful day!"
        )

    else:
        # General query
        if agent_message_count > 0:
            response = "I'd be happy to clarify that for you."
        else:
            response = "Thank you for reaching out to customer support. How can I assist you today?"
        if knowledge_fact:
            response += f" {knowledge_fact}"

    state["suggested_response"] = response
    return state

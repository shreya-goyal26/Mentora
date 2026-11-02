def simulate_customer(state):
    scenario = (state.get("scenario") or "general query").lower()
    frustration = state.get("frustration_level", 3)
    style = (state.get("communication_style") or "polite").lower()

    # Determine turn count based on previous customer messages in history
    history = state.get("conversation_history") or []
    customer_turn = len([m for m in history if m.get("sender") == "customer"])

    # Multi-turn progressive dialogue scripts per scenario
    dialogues = {
        "late delivery": [
            "Where is my order? It was supposed to arrive yesterday and I'm very frustrated!",
            "The tracking ID shows delayed at the sorting hub. Can you check with the courier partner to expedite it?",
            "If it cannot be delivered by this evening, please cancel my order immediately.",
            "Since the order is cancelled, when will I get my refund back to my card?",
            "Great, thank you for explaining the refund process and submitting the request. That helps a lot."
        ],
        "refund": [
            "I want a refund for my recent purchase.",
            "I already sent the item back 3 days ago. How long will the money take to reach my account?",
            "Could you send me an email confirmation with the refund transaction reference?",
            "Great, thank you for verifying the refund details."
        ],
        "refund request": [
            "I want a refund for my recent purchase.",
            "I already sent the item back 3 days ago. How long will the money take to reach my account?",
            "Could you send me an email confirmation with the refund transaction reference?",
            "Great, thank you for verifying the refund details."
        ],
        "payment issue": [
            "I was charged but my payment is showing as failed.",
            "My bank statement confirmed the deduction. The transaction reference is #TXN-8892.",
            "Please make sure my order is not cancelled while you verify this payment with finance.",
            "Great, thank you for verifying the transaction."
        ],
        "product complaint": [
            "The item I received is defective and not working as advertised.",
            "The packaging was damaged and the device does not turn on. I need a replacement or refund.",
            "How do I arrange for a courier return pickup for this damaged unit?",
            "Thank you, I will prepare the package for pickup."
        ]
    }

    # Match scenario script or fallback to general query
    script = dialogues.get(scenario)
    if not script:
        for key, turns in dialogues.items():
            if key in scenario:
                script = turns
                break

    if not script:
        script = [
            "I need help tracking my recent order.",
            "Can you check with the courier why it is delayed?",
            "Please cancel the order if it cannot be delivered.",
            "How soon will my refund be processed?",
            "Thank you for confirming everything."
        ]

    # Select message based on current customer turn index
    idx = min(customer_turn, len(script) - 1)
    message = script[idx]

    # Dynamic styling for turn 0 if frustration / impatient
    if customer_turn == 0 and frustration >= 4 and "frustrated" not in message:
        message += " I am really frustrated and disappointed!"
        if style == "impatient":
            message += " Please resolve this quickly."

    return message

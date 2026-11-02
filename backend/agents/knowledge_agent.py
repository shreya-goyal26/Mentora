def recommend_knowledge(state):
    intent = state.get("intent") or "General Query"
    message = (state.get("customer_message") or "").lower()

    # Domain Knowledge Repository categorized by intent
    knowledge_catalog = {
        "Refund": [
            "Refunds are processed back to the original payment method within 5-7 business days after initiation.",
            "Customers receive an automated refund transaction reference ID via email once processed."
        ],
        "Cancellation": [
            "Orders can be cancelled prior to final delivery for a 100% full refund with zero penalty fees.",
            "If the package is already with the courier, a return-to-sender request is immediately dispatched upon cancellation."
        ],
        "Delivery Delay": [
            "For shipments delayed in transit, support agents can trigger an expedited inquiry ticket with the courier partner.",
            "Transit updates are refreshed every 12 hours by the carrier sorting hubs."
        ],
        "Order Tracking": [
            "Orders are usually delivered within 3-5 business days. Customers can track live status using their tracking ID.",
            "Live dispatch tracking and courier contact details are available on the carrier tracking portal."
        ],
        "Payment Issue": [
            "If an amount is deducted for a failed transaction, banking networks auto-reconcile within 24-48 business hours.",
            "Support agents can manually verify transactions using the customer's payment reference number (#TXN)."
        ],
        "Product Complaint": [
            "Defective or damaged items qualify for free return pickup and immediate replacement within 7 days of delivery.",
            "Customers should keep the original packaging and invoice for courier replacement verification."
        ],
        "Confirmation": [
            "Customer support is available 24/7 across chat, email, and phone channels.",
            "Interaction summaries and reference IDs are securely logged in the customer account."
        ],
        "General Query": [
            "Customer service representatives are available 24/7 to assist with product inquiries, warranty, and account questions.",
            "Standard policies include a 30-day quality assurance on all verified purchases."
        ]
    }

    # Primary Knowledge Retrieval strictly matching customer's latest intent
    results = list(knowledge_catalog.get(intent, knowledge_catalog["General Query"]))

    # Optional secondary matching only if customer message explicitly references secondary topics
    # Note: Do NOT attach delivery information to refund or cancellation requests!
    if intent not in ["Refund", "Cancellation"]:
        if "courier" in message and intent != "Delivery Delay":
            results.extend(knowledge_catalog["Delivery Delay"])
        elif "payment" in message and intent != "Payment Issue":
            results.extend(knowledge_catalog["Payment Issue"])

    # Ensure uniqueness and preserve relevance order
    seen = set()
    ordered_results = []
    for item in results:
        if item not in seen:
            seen.add(item)
            ordered_results.append(item)

    state["retrieved_knowledge"] = ordered_results
    return state

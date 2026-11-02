import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import main as m

def test_five_turns():
    print("======================================================================")
    print("FIVE CONSECUTIVE TURNS TEST: Delivery Tracking -> Courier Follow-up ->")
    print("Cancellation -> Refund -> Confirmation")
    print("======================================================================\n")

    # Initialize a new session in simulator mode
    session_req = m.SessionCreateRequest(
        mode="simulator",
        product_category="Electronics",
        scenario="Late Delivery",
        customer_persona={
            "frustration_level": 4,
            "communication_style": "impatient",
            "patience_level": "low"
        }
    )
    session = m.create_session(session_req)
    sid = session.session_id
    print(f"Session Created Successfully: {sid}\n")

    expected_stages = [
        {"turn": 1, "topic": "Delivery Tracking", "expected_intent": "Order Tracking"},
        {"turn": 2, "topic": "Courier Follow-up", "expected_intent": "Delivery Delay"},
        {"turn": 3, "topic": "Cancellation", "expected_intent": "Cancellation"},
        {"turn": 4, "topic": "Refund", "expected_intent": "Refund"},
        {"turn": 5, "topic": "Confirmation", "expected_intent": "Confirmation"},
    ]

    for stage in expected_stages:
        turn_num = stage["turn"]
        topic = stage["topic"]
        expected_intent = stage["expected_intent"]

        print(f"----------------------------------------------------------------------")
        print(f"TURN {turn_num}: [{topic}]")
        print(f"----------------------------------------------------------------------")

        # Simulate customer turn
        result = m.simulate_turn(sid)

        customer_msg = result["customer_message"]
        intent = result["intent"]
        sentiment = result["sentiment"]
        risk = result["escalation_risk"]
        suggested = result["suggested_response"]
        knowledge = result["retrieved_knowledge"]
        history = result["conversation_history"]

        print(f"Customer Message : \"{customer_msg}\"")
        print(f"Classified Intent: {intent}")
        print(f"Sentiment        : {sentiment}")
        print(f"Escalation Risk  : {risk}")
        print(f"Retrieved Knowledge:")
        for idx, k in enumerate(knowledge, 1):
            print(f"  [{idx}] {k}")
        print(f"Suggested Agent Response:")
        print(f"  \"{suggested}\"")
        print(f"History Message Count: {len(history)} (Only real customer & agent messages)")

        # Verify Assertions
        assert intent == expected_intent, f"Expected intent {expected_intent}, got {intent}"
        assert len(knowledge) > 0, "Expected knowledge articles to be retrieved"
        
        # Verify that delivery info is not attached to refund or cancellation
        if intent in ["Refund", "Cancellation"]:
            for k in knowledge:
                assert "delivered within 3-5 business days" not in k.lower(), \
                    f"Delivery info incorrectly attached to {intent}: {k}"

        print(f"STATUS: PASS (Intent matched '{expected_intent}' & knowledge relevant)\n")

    print("======================================================================")
    print("ALL 5 CONSECUTIVE TURNS PASSED VERIFICATION WITH ZERO ERRORS!")
    print("======================================================================")

if __name__ == "__main__":
    test_five_turns()

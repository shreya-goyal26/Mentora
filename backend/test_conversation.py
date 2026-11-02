
from orchestration.conversation_manager import add_message, get_conversation_history

state = {
    "conversation_history": []
}

add_message(state, "customer", "Where is my order?")
add_message(state, "agent", "Let me check your order status.")
add_message(state, "customer", "It has been delayed for three days.")

history = get_conversation_history(state)

for message in history:
    print(message["sender"], ":", message["content"])

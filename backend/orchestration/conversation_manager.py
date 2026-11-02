
def add_message(state, sender, content):
    message = {
        "sender": sender,
        "content": content
    }

    state["conversation_history"].append(message)

    return state


def get_conversation_history(state):
    return state["conversation_history"]

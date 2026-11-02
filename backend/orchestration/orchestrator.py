from agents.customer_simulator import simulate_customer
from agents.intent_agent import analyze_intent_and_sentiment
from agents.knowledge_agent import recommend_knowledge
from agents.coaching_agent import generate_suggestion
from agents.escalation_agent import monitor_escalation
from agents.summary_agent import generate_summary
from orchestration.conversation_manager import add_message
from typing import Optional, List, Dict, Any, TypedDict


class ConversationState(TypedDict):
    session_id: str
    customer_message: str
    agent_response: Optional[str]

    intent: Optional[str]
    sentiment: Optional[str]

    retrieved_knowledge: List[str]
    suggested_response: Optional[str]

    escalation_risk: Optional[str]
    escalation_reason: Optional[str]

    conversation_history: List[Dict[str, Any]]

    summary: Optional[Dict[str, Any]]

    scenario: str
    frustration_level: int
    communication_style: str


def run_coaching_pipeline(state: ConversationState) -> ConversationState:
    """
    Executes the multi-agent real-time coaching pipeline:
    1. Intent & Sentiment Analysis
    2. Knowledge Retrieval (RAG)
    3. Coaching & Response Suggestion
    4. Escalation Risk Monitoring

    Note: The AI suggested response is stored in state['suggested_response']
    and kept strictly separate from actual support agent messages.
    """
    state = analyze_intent_and_sentiment(state)
    state = recommend_knowledge(state)
    state = generate_suggestion(state)
    state = monitor_escalation(state)

    return state


def run_post_interaction_pipeline(state: ConversationState) -> ConversationState:
    """Runs the Post-Interaction Summary Agent on session conclusion."""
    state = generate_summary(state)
    return state


def run_simulator(state: ConversationState) -> ConversationState:
    """
    Triggers Customer Simulator Agent to produce the next customer turn,
    records customer message in conversation history, and runs coaching pipeline.
    """
    message = simulate_customer(state)
    state["customer_message"] = message

    add_message(state, "customer", message)

    return run_coaching_pipeline(state)

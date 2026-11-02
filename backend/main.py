import sys
from pathlib import Path

# Ensure backend directory is in sys.path regardless of execution directory
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models.session import SessionCreateRequest, SessionResponse
from orchestration.orchestrator import (
    run_coaching_pipeline,
    run_simulator,
    run_post_interaction_pipeline
)
from orchestration.conversation_manager import add_message, get_conversation_history

app = FastAPI(title="AI Customer Support Coach")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sessions = {}


class CustomerMessageRequest(BaseModel):
    content: str


class AgentMessageRequest(BaseModel):
    content: str


@app.get("/")
def home():
    return {"message": "Backend is running!"}


@app.get("/api/status")
def status():
    return {
        "status": "success",
        "message": "React and Python are connected!"
    }


@app.get("/api/sessions")
def list_sessions():
    return [
        {
            "session_id": sid,
            "mode": data["session"].mode,
            "product_category": data["session"].product_category,
            "scenario": data["session"].scenario,
            "status": data["session"].status,
            "created_at": data["session"].created_at
        }
        for sid, data in sessions.items()
    ]


@app.post("/api/sessions")
def create_session(request: SessionCreateRequest):
    session = SessionResponse(**request.model_dump())

    state = {
        "session_id": session.session_id,
        "mode": session.mode,
        "product_category": session.product_category,
        "scenario": session.scenario,
        "frustration_level": (
            session.customer_persona.frustration_level
            if session.customer_persona else 3
        ),
        "communication_style": (
            session.customer_persona.communication_style
            if session.customer_persona else "polite"
        ),
        "customer_message": "",
        "agent_response": None,
        "intent": None,
        "sentiment": None,
        "retrieved_knowledge": [],
        "suggested_response": None,
        "escalation_risk": None,
        "escalation_reason": None,
        "conversation_history": [],
        "summary": None
    }

    sessions[session.session_id] = {
        "session": session,
        "state": state
    }

    return session


@app.get("/api/sessions/{session_id}")
def get_session(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session_entry = sessions[session_id]
    state = session_entry["state"]

    return {
        "session": session_entry["session"],
        "latest_state": {
            "intent": state["intent"],
            "sentiment": state["sentiment"],
            "suggested_response": state["suggested_response"],
            "escalation_risk": state["escalation_risk"],
            "escalation_reason": state["escalation_reason"],
            "retrieved_knowledge": state["retrieved_knowledge"],
        },
        "conversation_history": state["conversation_history"],
        "summary": state["summary"]
    }


@app.post("/api/sessions/{session_id}/messages")
def send_message(session_id: str, request: CustomerMessageRequest):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    state = sessions[session_id]["state"]

    state["customer_message"] = request.content
    # Record incoming customer message into conversation history
    add_message(state, "customer", request.content)

    result = run_coaching_pipeline(state)

    return {
        "customer_message": result["customer_message"],
        "intent": result["intent"],
        "sentiment": result["sentiment"],
        "retrieved_knowledge": result["retrieved_knowledge"],
        "suggested_response": result["suggested_response"],
        "escalation_risk": result["escalation_risk"],
        "escalation_reason": result["escalation_reason"],
        "conversation_history": result["conversation_history"]
    }


@app.post("/api/sessions/{session_id}/agent-messages")
def send_agent_message(session_id: str, request: AgentMessageRequest):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    state = sessions[session_id]["state"]
    add_message(state, "agent", request.content)

    return {
        "status": "success",
        "conversation_history": state["conversation_history"]
    }


@app.post("/api/sessions/{session_id}/simulate-turn")
def simulate_turn(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    state = sessions[session_id]["state"]
    result = run_simulator(state)

    return {
        "customer_message": result["customer_message"],
        "intent": result["intent"],
        "sentiment": result["sentiment"],
        "retrieved_knowledge": result["retrieved_knowledge"],
        "suggested_response": result["suggested_response"],
        "escalation_risk": result["escalation_risk"],
        "escalation_reason": result["escalation_reason"],
        "conversation_history": result["conversation_history"]
    }


@app.post("/api/sessions/{session_id}/end")
def end_session(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session_entry = sessions[session_id]
    session_entry["session"].status = "completed"
    state = session_entry["state"]

    result = run_post_interaction_pipeline(state)

    return {
        "session_id": session_id,
        "status": "completed",
        "summary": result["summary"],
        "conversation_history": result["conversation_history"]
    }

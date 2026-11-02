# AI Customer Support Coaching Assistant

An intelligent platform that coaches customer service agents in real time during live text-based support interactions.

---

## 🚀 Key Features

- **Multi-Agent AI Pipeline**:
  1. **Customer Simulator Agent**: Realistic, scenario-based turn-by-turn customer simulation with configurable emotional progression.
  2. **Intent & Sentiment Analysis Agent**: Real-time intent detection and emotional state classification (Positive, Neutral, Negative).
  3. **Knowledge Recommendation Agent (RAG)**: Context-aware retrieval of FAQs and policy documents.
  4. **Coaching & Response Suggestion Agent**: Instant response generation and communication feedback for support agents.
  5. **Escalation Risk Monitor Agent**: Real-time scoring (Low, Medium, High) with warning alerts for de-escalation.
  6. **Post-Interaction Summary Agent**: Comprehensive performance scoring (0–100), sentiment journey, and personalized recommendations.
- **Three Interaction Modes**:
  - **Simulator Mode**: AI customer generation turn-by-turn.
  - **Manual Mode**: Real-time message pasting and live agent coaching.
  - **Replay Mode**: Transcript playback for post-call training.
- **Three-Panel Coaching Console**:
  - Panel 1: Customer Conversation Feed & Input Controls.
  - Panel 2: Live Multi-Agent Coaching Feed & RAG Knowledge Articles.
  - Panel 3: Escalation Risk Monitor & Session Management.
- **Post-Interaction Performance Evaluation**:
  - Resolution quality score, metrics breakdown, printable report.

---

## 🛠️ Architecture & Tech Stack

- **Backend**: Python 3.13+, FastAPI, Pydantic v2, Uvicorn.
- **Frontend**: React 19, Vite, React Router 7, Lucide React, Modern SaaS Design System.

---

## 📦 Getting Started

### 1. Backend Setup

```bash
cd backend

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Start FastAPI server (runs on http://127.0.0.1:8000)
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

Open your browser at `http://localhost:5173`. The header pill will indicate `Backend Connected` via the live `/api/status` endpoint.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | Backend health & connection verification |
| `GET` | `/api/sessions` | List all coaching sessions |
| `POST` | `/api/sessions` | Create a new session (Simulator, Manual, or Replay) |
| `GET` | `/api/sessions/{session_id}` | Retrieve session state, history, and summary |
| `POST` | `/api/sessions/{session_id}/messages` | Submit customer message; runs coaching pipeline |
| `POST` | `/api/sessions/{session_id}/simulate-turn` | Trigger next turn from Customer Simulator Agent |
| `POST` | `/api/sessions/{session_id}/end` | Conclude session; generates evaluation report |

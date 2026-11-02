from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4


class Sender(str, Enum):
    CUSTOMER = "customer"
    AGENT = "agent"


class MessageCreateRequest(BaseModel):
    session_id: str
    sender: Sender
    content: str = Field(min_length=1)
    sentiment: Optional[str] = None


class MessageResponse(BaseModel):
    message_id: str = Field(default_factory=lambda: str(uuid4()))
    session_id: str
    sender: Sender
    content: str
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    sentiment: Optional[str] = None
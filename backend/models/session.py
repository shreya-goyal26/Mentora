
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4


class InteractionMode(str, Enum):
    SIMULATOR = "simulator"
    MANUAL = "manual"
    REPLAY = "replay"


class CustomerPersona(BaseModel):
    frustration_level: int = Field(ge=1, le=5)
    communication_style: str
    patience_level: str


class SessionCreateRequest(BaseModel):
    mode: InteractionMode
    product_category: str
    scenario: str
    customer_persona: Optional[CustomerPersona] = None


class SessionResponse(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid4()))
    mode: InteractionMode
    product_category: str
    scenario: str
    customer_persona: Optional[CustomerPersona] = None
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    status: str = "active"

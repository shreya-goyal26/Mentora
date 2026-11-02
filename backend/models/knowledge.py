from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Optional, List
from uuid import uuid4


class KnowledgeChunk(BaseModel):
    chunk_id: str = Field(default_factory=lambda: str(uuid4()))
    document_name: str
    content: str = Field(min_length=1)
    category: str
    embedding: Optional[List[float]] = None
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
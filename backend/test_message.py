from models.message import MessageCreateRequest, MessageResponse

data = MessageCreateRequest(
    session_id="test-session-123",
    sender="customer",
    content="My order has not arrived yet.",
    sentiment="negative"
)

message = MessageResponse(**data.model_dump())

print(message)
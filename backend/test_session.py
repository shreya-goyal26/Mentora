
from models.session import SessionCreateRequest, SessionResponse

data = SessionCreateRequest(
    mode="manual",
    product_category="Electronics",
    scenario="Late delivery",
)

session = SessionResponse(**data.model_dump())

print(session)

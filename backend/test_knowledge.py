from models.knowledge import KnowledgeChunk

chunk = KnowledgeChunk(
    document_name="Return Policy",
    content="Customers can return products within 7 days of delivery.",
    category="Returns"
)

print(chunk)
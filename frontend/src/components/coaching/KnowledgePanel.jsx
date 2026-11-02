import { BookOpen, FileText } from "lucide-react";

export default function KnowledgePanel({ knowledge = [] }) {
  return (
    <div className="card knowledge-card">
      <div className="card-header">
        <div className="flex-inline-gap">
          <BookOpen size={16} className="text-primary" />
          <h4 className="card-title">Retrieved Knowledge Base (RAG)</h4>
        </div>
        <span className="badge badge-neutral">
          {knowledge.length} {knowledge.length === 1 ? "Article" : "Articles"}
        </span>
      </div>

      <div className="knowledge-list">
        {knowledge.length === 0 ? (
          <div className="knowledge-empty">
            <FileText size={24} className="text-muted" />
            <p>No knowledge articles retrieved yet for this conversation context.</p>
          </div>
        ) : (
          knowledge.map((item, idx) => (
            <div key={idx} className="knowledge-item">
              <div className="knowledge-item-bullet" />
              <div className="knowledge-item-content">
                <p className="knowledge-text">{item}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

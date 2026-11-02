import { COMMUNICATION_STYLES, PATIENCE_LEVELS } from "../../utils/constants";
import { User, Flame, Clock } from "lucide-react";

export default function PersonaSelector({ persona, onChange }) {
  const handleFrustrationChange = (e) => {
    onChange({
      ...persona,
      frustration_level: parseInt(e.target.value, 10),
    });
  };

  const handleStyleChange = (e) => {
    onChange({
      ...persona,
      communication_style: e.target.value,
    });
  };

  const handlePatienceChange = (e) => {
    onChange({
      ...persona,
      patience_level: e.target.value,
    });
  };

  const getFrustrationColor = (level) => {
    if (level <= 2) return "#10b981";
    if (level === 3) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="persona-card">
      <div className="persona-header">
        <User size={18} className="persona-header-icon" />
        <div>
          <h4 className="persona-title">Customer Simulator Persona</h4>
          <p className="persona-subtitle">
            Configure emotional tone, impatience, and behavioral progression.
          </p>
        </div>
      </div>

      <div className="persona-grid">
        {/* Frustration Level */}
        <div className="form-group">
          <div className="flex-between">
            <label className="form-label flex-inline-gap">
              <Flame
                size={14}
                style={{ color: getFrustrationColor(persona.frustration_level) }}
              />
              Initial Frustration Level
            </label>
            <span
              className="badge font-bold"
              style={{
                backgroundColor: `${getFrustrationColor(persona.frustration_level)}15`,
                color: getFrustrationColor(persona.frustration_level),
              }}
            >
              Level {persona.frustration_level} of 5
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={persona.frustration_level}
            onChange={handleFrustrationChange}
            className="slider"
          />
          <div className="slider-labels">
            <span>1 - Calm</span>
            <span>3 - Irritated</span>
            <span>5 - Furious</span>
          </div>
        </div>

        {/* Communication Style */}
        <div className="form-group">
          <label className="form-label flex-inline-gap">
            Communication Style
          </label>
          <select
            className="form-select"
            value={persona.communication_style}
            onChange={handleStyleChange}
          >
            {COMMUNICATION_STYLES.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        {/* Patience Level */}
        <div className="form-group">
          <label className="form-label flex-inline-gap">
            <Clock size={14} /> Patience Level
          </label>
          <select
            className="form-select"
            value={persona.patience_level}
            onChange={handlePatienceChange}
          >
            {PATIENCE_LEVELS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

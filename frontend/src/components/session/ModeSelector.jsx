import { INTERACTION_MODES } from "../../utils/constants";
import { Bot, UserCheck, PlaySquare, Check } from "lucide-react";

const MODE_ICONS = {
  simulator: Bot,
  manual: UserCheck,
  replay: PlaySquare,
};

export default function ModeSelector({ selectedMode, onChange }) {
  return (
    <div className="mode-selector-grid">
      {INTERACTION_MODES.map((mode) => {
        const Icon = MODE_ICONS[mode.id] || Bot;
        const isSelected = selectedMode === mode.id;

        return (
          <div
            key={mode.id}
            className={`mode-card ${isSelected ? "mode-card-selected" : ""}`}
            onClick={() => onChange(mode.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onChange(mode.id);
            }}
          >
            <div className="mode-card-top">
              <div className="mode-icon-wrapper">
                <Icon size={24} />
              </div>
              <span className="mode-badge">{mode.badge}</span>
            </div>

            <h4 className="mode-title">{mode.title}</h4>
            <p className="mode-description">{mode.description}</p>

            <div className="mode-indicator">
              {isSelected ? (
                <span className="mode-selected-badge">
                  <Check size={14} /> Selected
                </span>
              ) : (
                <span className="mode-select-label">Select Mode</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

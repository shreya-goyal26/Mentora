import { useState } from "react";
import { PRODUCT_CATEGORIES, SCENARIOS } from "../../utils/constants";
import ModeSelector from "./ModeSelector";
import PersonaSelector from "./PersonaSelector";
import Button from "../common/Button";
import { ArrowRight, Layers, FileQuestion } from "lucide-react";

export default function SessionForm({ onSubmit, loading = false }) {
  const [mode, setMode] = useState("simulator");
  const [productCategory, setProductCategory] = useState("Electronics");
  const [scenario, setScenario] = useState("Late Delivery");
  const [persona, setPersona] = useState({
    frustration_level: 4,
    communication_style: "impatient",
    patience_level: "low",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      mode,
      product_category: productCategory,
      scenario,
      customer_persona: mode === "simulator" ? persona : null,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="session-form">
      {/* 1. Mode Selection */}
      <div className="form-section">
        <label className="section-title">1. Select Interaction Mode</label>
        <p className="section-desc">
          Choose how customer conversation turns are introduced into the coaching console.
        </p>
        <ModeSelector selectedMode={mode} onChange={setMode} />
      </div>

      {/* 2. Context & Scenario */}
      <div className="form-section">
        <label className="section-title">2. Context & Problem Scenario</label>
        <p className="section-desc">
          Sets up the domain context and scenario for RAG knowledge retrieval and coaching guidance.
        </p>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label flex-inline-gap">
              <Layers size={14} /> Product Category
            </label>
            <select
              className="form-select"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label flex-inline-gap">
              <FileQuestion size={14} /> Customer Scenario
            </label>
            <select
              className="form-select"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
            >
              {SCENARIOS.map((scen) => (
                <option key={scen} value={scen}>
                  {scen}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Customer Persona (Shown for Simulator Mode) */}
      {mode === "simulator" && (
        <div className="form-section">
          <label className="section-title">3. Customer Simulation Configuration</label>
          <PersonaSelector persona={persona} onChange={setPersona} />
        </div>
      )}

      {/* Replay Mode Note */}
      {mode === "replay" && (
        <div className="info-banner">
          <p className="info-banner-title">Replay Mode Selected</p>
          <p className="info-banner-desc">
            You will be able to load support transcripts and step through them message-by-message once the session console opens.
          </p>
        </div>
      )}

      <div className="form-actions">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={ArrowRight}
          loading={loading}
        >
          Initialize Live Coaching Session
        </Button>
      </div>
    </form>
  );
}

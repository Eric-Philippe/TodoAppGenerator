import { useState } from "react";
import type { DeploymentInstructions } from "../types";
import "./InstructionsDisplay.css";

interface InstructionsDisplayProps {
  instructions: DeploymentInstructions;
}

const InstructionsDisplay: React.FC<InstructionsDisplayProps> = ({
  instructions,
}) => {
  const [activeTab, setActiveTab] = useState<
    "setup" | "development" | "production" | "docker"
  >("setup");

  const renderInstructionList = (instructionList: string[]) => {
    return (
      <div className="instruction-content">
        {instructionList.map((instruction, index) => {
          if (instruction.startsWith("#")) {
            return (
              <h4 key={index} className="instruction-heading">
                {instruction}
              </h4>
            );
          }
          if (instruction.startsWith("##")) {
            return (
              <h5 key={index} className="instruction-subheading">
                {instruction}
              </h5>
            );
          }
          if (instruction.trim() === "") {
            return <br key={index} />;
          }
          if (instruction.startsWith("-")) {
            return (
              <li key={index} className="instruction-item">
                {instruction.slice(1).trim()}
              </li>
            );
          }
          return (
            <code key={index} className="instruction-command">
              {instruction}
            </code>
          );
        })}
      </div>
    );
  };

  return (
    <div className="instructions">
      <h4>📖 Instructions de déploiement</h4>

      <div className="instruction-tabs">
        <button
          className={`tab ${activeTab === "setup" ? "active" : ""}`}
          onClick={() => setActiveTab("setup")}
        >
          Setup
        </button>
        <button
          className={`tab ${activeTab === "development" ? "active" : ""}`}
          onClick={() => setActiveTab("development")}
        >
          Développement
        </button>
        <button
          className={`tab ${activeTab === "production" ? "active" : ""}`}
          onClick={() => setActiveTab("production")}
        >
          Production
        </button>
        {instructions.docker && (
          <button
            className={`tab ${activeTab === "docker" ? "active" : ""}`}
            onClick={() => setActiveTab("docker")}
          >
            Docker
          </button>
        )}
      </div>

      <div className="instruction-panel">
        {activeTab === "setup" && renderInstructionList(instructions.setup)}
        {activeTab === "development" &&
          renderInstructionList(instructions.development)}
        {activeTab === "production" &&
          renderInstructionList(instructions.production)}
        {activeTab === "docker" &&
          instructions.docker &&
          renderInstructionList(instructions.docker)}
      </div>
    </div>
  );
};

export default InstructionsDisplay;

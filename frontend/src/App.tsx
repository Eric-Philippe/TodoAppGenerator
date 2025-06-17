import { useState } from "react";
import "./App.css";
import GeneratorForm from "./components/GeneratorForm";
import OutputSection from "./components/OutputSection";
import type { ProjectConfig, GeneratedProject } from "./types";
import {
  generateFileStructure,
  generateInstructions,
  generateTechStack,
} from "./utils/projectGenerator";

function App() {
  const [generatedProject, setGeneratedProject] =
    useState<GeneratedProject | null>(null);

  const handleGenerate = (config: ProjectConfig) => {
    const project: GeneratedProject = {
      techStack: generateTechStack(config),
      fileStructure: generateFileStructure(config),
      instructions: generateInstructions(config),
    };

    setGeneratedProject(project);
  };

  return (
    <div className="app-container">
      {/* Header fixe en haut */}
      <div className="header">
        <h1>🚀 TodoApp Generator</h1>
        <p>Générez votre application TodoList complète en quelques clics</p>
      </div>

      {/* Container principal pour les formulaires */}
      <div className="main-container">
        <div className="forms-container">
          <GeneratorForm onGenerate={handleGenerate} />
        </div>

        {/* Section de sortie en pleine largeur */}
        {generatedProject && (
          <div className="output-container">
            <OutputSection project={generatedProject} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

import React, { useState } from "react";
import GeneratorForm from "../components/GeneratorForm";
import OutputSection from "../components/OutputSection";
import type { ProjectConfig, GeneratedProject } from "../types";
import {
  generateFileStructure,
  generateInstructions,
  generateTechStack,
} from "../utils/projectGenerator";

const HomePage: React.FC = () => {
  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null);

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
      <header className="header">
        <h1>TodoApp Generator</h1>
        <p>Générez votre application TodoList complète en quelques clics</p>
      </header>

      <main className="main-container">
        <div className="forms-container">
          <GeneratorForm onGenerate={handleGenerate} />
        </div>

        {generatedProject && (
          <div className="output-container">
            <OutputSection project={generatedProject} />
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
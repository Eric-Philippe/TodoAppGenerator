import type { GeneratedProject } from "../types";
import TechStackDisplay from "./TechStackDisplay";
import FileStructureDisplay from "./FileStructureDisplay";
import InstructionsDisplay from "./InstructionsDisplay";
import "./OutputSection.css";

interface OutputSectionProps {
  project: GeneratedProject;
}

const OutputSection: React.FC<OutputSectionProps> = ({ project }) => {
  const handleDownload = () => {
    // TODO: Implémenter le téléchargement du projet
    console.log("Téléchargement du projet...", project);
  };

  const handleCopyInstructions = async () => {
    const instructionsText = [
      ...project.instructions.setup,
      "",
      ...project.instructions.development,
      "",
      ...project.instructions.production,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(instructionsText);
      alert("Instructions copiées dans le presse-papiers !");
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  return (
    <div className="output-section">
      <h3>🎉 Votre TodoApp est prête !</h3>

      <TechStackDisplay techStack={project.techStack} />
      <FileStructureDisplay fileStructure={project.fileStructure} />
      <InstructionsDisplay instructions={project.instructions} />

      <div className="action-buttons">
        <button className="download-btn" onClick={handleDownload}>
          📦 Télécharger le projet
        </button>
        <button className="download-btn" onClick={handleCopyInstructions}>
          📋 Copier les instructions
        </button>
      </div>
    </div>
  );
};

export default OutputSection;

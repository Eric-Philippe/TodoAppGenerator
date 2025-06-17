import type { TechStackInfo } from "../types";
import "./TechStackDisplay.css";

interface TechStackDisplayProps {
  techStack: TechStackInfo;
}

const TechStackDisplay: React.FC<TechStackDisplayProps> = ({ techStack }) => {
  return (
    <div className="tech-stack">
      <h4>🛠️ Stack Technologique</h4>

      <div className="tech-categories">
        <div className="tech-category">
          <h5>Backend</h5>
          <div className="tech-badges">
            <span className="tech-badge backend">
              {techStack.backend.language}
            </span>
            <span className="tech-badge architecture">
              {techStack.backend.architecture}
            </span>
          </div>
        </div>

        <div className="tech-category">
          <h5>Frontend</h5>
          <div className="tech-badges">
            <span className="tech-badge frontend">
              {techStack.frontend.framework}
            </span>
            <span className="tech-badge styling">
              {techStack.frontend.styling}
            </span>
          </div>
        </div>

        <div className="tech-category">
          <h5>Base de données</h5>
          <div className="tech-badges">
            <span className="tech-badge database">
              {techStack.database.type}
            </span>
          </div>
        </div>

        {techStack.features.length > 0 && (
          <div className="tech-category">
            <h5>Fonctionnalités</h5>
            <div className="tech-badges">
              {techStack.features.map((feature, index) => (
                <span key={index} className="tech-badge feature">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechStackDisplay;

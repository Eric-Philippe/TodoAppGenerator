import { useState } from "react";
import type { ProjectConfig } from "../types";
import "./GeneratorForm.css";

interface GeneratorFormProps {
  onGenerate: (config: ProjectConfig) => void;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate }) => {
  const [config, setConfig] = useState<ProjectConfig>({
    backendLang: "node",
    architecture: "mvc",
    database: "sqlite",
    frontendType: "spa",
    frontendFramework: "react",
    styling: "tailwind",
    projectName: "my-todo-app",
    includeAuth: false,
    includeTests: true,
    includeDocker: true,
    includeCI: false,
    includeAPI: true,
  });

  const handleInputChange = (
    field: keyof ProjectConfig,
    value: string | boolean
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(config);
  };

  const shouldShowFramework = config.frontendType !== "mvp";

  return (
    <form onSubmit={handleSubmit} className="generator-form">
      <div className="form-grid">
        {/* Configuration Backend */}
        <div className="form-section">
          <h3>Backend Configuration</h3>

          <div className="form-group">
            <label htmlFor="backendLang">Langage Backend</label>
            <select
              id="backendLang"
              value={config.backendLang}
              onChange={(e) => handleInputChange("backendLang", e.target.value)}
            >
              <option value="node">Node.js</option>
              <option value="python">Python (FastAPI)</option>
              <option value="java">Java (Spring Boot)</option>
              <option value="csharp">C# (.NET)</option>
              <option value="go">Go (Gin)</option>
              <option value="php">PHP (Laravel)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="architecture">Architecture</label>
            <select
              id="architecture"
              value={config.architecture}
              onChange={(e) =>
                handleInputChange("architecture", e.target.value)
              }
            >
              <option value="mvc">MVC</option>
              <option value="clean">Clean Architecture</option>
              <option value="hexagonal">Hexagonal</option>
              <option value="layered">Layered Architecture</option>
              <option value="microservices">Microservices</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="database">Base de données</label>
            <select
              id="database"
              value={config.database}
              onChange={(e) => handleInputChange("database", e.target.value)}
            >
              <option value="sqlite">SQLite</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="mongodb">MongoDB</option>
              <option value="redis">Redis</option>
            </select>
          </div>
        </div>

        {/* Configuration Frontend */}
        <div className="form-section">
          <h3>Frontend Configuration</h3>

          <div className="form-group">
            <label htmlFor="frontendType">Type Frontend</label>
            <select
              id="frontendType"
              value={config.frontendType}
              onChange={(e) =>
                handleInputChange("frontendType", e.target.value)
              }
            >
              <option value="mvp">MVP (Templates serveur)</option>
              <option value="spa">SPA (Single Page App)</option>
              <option value="ssr">SSR (Server Side Rendering)</option>
            </select>
          </div>

          {shouldShowFramework && (
            <div className="form-group">
              <label htmlFor="frontendFramework">Framework Frontend</label>
              <select
                id="frontendFramework"
                value={config.frontendFramework}
                onChange={(e) =>
                  handleInputChange("frontendFramework", e.target.value)
                }
              >
                <option value="react">React</option>
                <option value="vue">Vue.js</option>
                <option value="angular">Angular</option>
                <option value="svelte">Svelte</option>
                <option value="nextjs">Next.js</option>
                <option value="nuxt">Nuxt.js</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="styling">Styling</label>
            <select
              id="styling"
              value={config.styling}
              onChange={(e) => handleInputChange("styling", e.target.value)}
            >
              <option value="tailwind">Tailwind CSS</option>
              <option value="bootstrap">Bootstrap</option>
              <option value="material">Material UI</option>
              <option value="chakra">Chakra UI</option>
              <option value="css">CSS Vanilla</option>
            </select>
          </div>
        </div>

        {/* Configuration Projet */}
        <div className="form-section">
          <h3>Configuration Projet</h3>

          <div className="form-group">
            <label htmlFor="projectName">Nom du projet</label>
            <input
              type="text"
              id="projectName"
              value={config.projectName}
              onChange={(e) => handleInputChange("projectName", e.target.value)}
              placeholder="mon-super-todo"
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="includeAuth"
              checked={config.includeAuth}
              onChange={(e) =>
                handleInputChange("includeAuth", e.target.checked)
              }
            />
            <label htmlFor="includeAuth">Inclure l'authentification</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="includeTests"
              checked={config.includeTests}
              onChange={(e) =>
                handleInputChange("includeTests", e.target.checked)
              }
            />
            <label htmlFor="includeTests">Tests unitaires</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="includeDocker"
              checked={config.includeDocker}
              onChange={(e) =>
                handleInputChange("includeDocker", e.target.checked)
              }
            />
            <label htmlFor="includeDocker">Docker Compose</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="includeCI"
              checked={config.includeCI}
              onChange={(e) => handleInputChange("includeCI", e.target.checked)}
            />
            <label htmlFor="includeCI">CI/CD (GitHub Actions)</label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="includeAPI"
              checked={config.includeAPI}
              onChange={(e) =>
                handleInputChange("includeAPI", e.target.checked)
              }
            />
            <label htmlFor="includeAPI">Documentation API</label>
          </div>
        </div>
      </div>

      <button type="submit" className="generate-btn">
        🎯 Générer l'application
      </button>
    </form>
  );
};

export default GeneratorForm;

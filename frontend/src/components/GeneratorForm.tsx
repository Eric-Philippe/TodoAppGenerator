import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ProjectConfig } from "../types";
import { usePremium } from "../hooks/usePremium";
import {
  getResources,
  Resources,
  type ResourceItem,
} from "../services/ressourcesService";
import PremiumFeatureBox from "./PremiumFeatureBox";
import PremiumIcon from "./PremiumIcon";
import "./GeneratorForm.css";

interface GeneratorFormProps {
  onGenerate: (config: ProjectConfig) => void;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userPremium, canAccess } = usePremium();
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<{
    languages: ResourceItem[];
    architectures: ResourceItem[];
    databases: ResourceItem[];
    frontendArchitectures: ResourceItem[];
    frontendFrameworks: ResourceItem[];
    frontendStylings: ResourceItem[];
  }>({
    languages: [],
    architectures: [],
    databases: [],
    frontendArchitectures: [],
    frontendFrameworks: [],
    frontendStylings: [],
  });
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
    includeDocker: false, // Désactivé par défaut pour les utilisateurs gratuits
    includeCI: false,
    includeAPI: true,
  });

  useEffect(() => {
    // Afficher le message de succès s'il y en a un
    if (location.state?.message) {
      setShowMessage(true);
      // Masquer le message après 5 secondes
      setTimeout(() => setShowMessage(false), 5000);
    }
  }, [location.state]);

  useEffect(() => {
    // Charger toutes les ressources au montage du composant
    const loadResources = async () => {
      try {
        setLoading(true);
        const [
          languages,
          architectures,
          databases,
          frontendArchitectures,
          frontendFrameworks,
          frontendStylings,
        ] = await Promise.all([
          getResources(Resources.BACKEND_LANGUAGES),
          getResources(Resources.BACKEND_ARCHITECTURES),
          getResources(Resources.DATABASES),
          getResources(Resources.FRONTEND_ARCHITECTURES),
          getResources(Resources.FRONTEND_FRAMEWORKS),
          getResources(Resources.FRONTEND_STYLINGS),
        ]);

        setResources({
          languages,
          architectures,
          databases,
          frontendArchitectures,
          frontendFrameworks,
          frontendStylings,
        });
      } catch (error) {
        console.error("Error loading resources:", error);
        // En cas d'erreur, garder les valeurs par défaut
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

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

  const handleUpgradeClick = () => {
    // Rediriger vers la page d'upgrade premium
    navigate("/upgrade");
  };

  const shouldShowFramework = config.frontendType !== "mvp";

  // Fonction pour filtrer les ressources selon le niveau premium de l'utilisateur
  const getFilteredResources = (
    resources: ResourceItem[],
    premiumLevel: number
  ) => {
    if (canAccess(premiumLevel)) {
      return resources;
    }
    // Si l'utilisateur n'a pas accès, ne montrer que les ressources gratuites
    return resources.filter((resource) => resource.requiredTier === 0);
  };

  return (
    <div className="generator-container">
      {/* Message de succès */}
      {showMessage && location.state?.message && (
        <div className={`success-message ${location.state.type || "info"}`}>
          <span>{location.state.message}</span>
          <button
            className="close-message"
            onClick={() => setShowMessage(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header avec statut premium */}

      <form onSubmit={handleSubmit} className="generator-form">
        <div className="form-grid">
          {/* Configuration Backend */}
          <div className="form-section">
            <h3>🔧 Backend Configuration</h3>

            <div className="form-group">
              <label htmlFor="backendLang">Langage Backend</label>
              <select
                id="backendLang"
                value={config.backendLang}
                onChange={(e) =>
                  handleInputChange("backendLang", e.target.value)
                }
                disabled={loading}
              >
                {loading ? (
                  <option>Chargement...</option>
                ) : (
                  resources.languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <PremiumFeatureBox
              requiredPremiumLevel={1}
              userPremiumLevel={userPremium.premiumLevel}
              onUpgradeClick={handleUpgradeClick}
            >
              <div className="form-group">
                <label htmlFor="architecture">
                  Architecture
                  <PremiumIcon premiumLevel={1} size={16} />
                </label>
                <select
                  id="architecture"
                  value={config.architecture}
                  onChange={(e) =>
                    handleInputChange("architecture", e.target.value)
                  }
                  disabled={!canAccess(1) || loading}
                >
                  {loading ? (
                    <option>Chargement...</option>
                  ) : (
                    getFilteredResources(resources.architectures, 1).map(
                      (arch) => (
                        <option key={arch.code} value={arch.code}>
                          {arch.name}
                        </option>
                      )
                    )
                  )}
                </select>
              </div>
            </PremiumFeatureBox>

            <PremiumFeatureBox
              requiredPremiumLevel={2}
              userPremiumLevel={userPremium.premiumLevel}
              onUpgradeClick={handleUpgradeClick}
            >
              <div className="form-group">
                <label htmlFor="database">
                  Base de données
                  <PremiumIcon premiumLevel={2} size={16} />
                </label>
                <select
                  id="database"
                  value={config.database}
                  onChange={(e) =>
                    handleInputChange("database", e.target.value)
                  }
                  disabled={!canAccess(2) || loading}
                >
                  {loading ? (
                    <option>Chargement...</option>
                  ) : (
                    getFilteredResources(resources.databases, 2).map((db) => (
                      <option key={db.code} value={db.code}>
                        {db.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </PremiumFeatureBox>

            {/* Configuration Frontend */}

            <h3>🎨 Frontend Configuration</h3>

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
              <PremiumFeatureBox
                requiredPremiumLevel={1}
                userPremiumLevel={userPremium.premiumLevel}
                onUpgradeClick={handleUpgradeClick}
              >
                <div className="form-group">
                  <label htmlFor="frontendFramework">
                    Framework Frontend
                    <PremiumIcon premiumLevel={1} size={16} />
                  </label>
                  <select
                    id="frontendFramework"
                    value={config.frontendFramework}
                    onChange={(e) =>
                      handleInputChange("frontendFramework", e.target.value)
                    }
                    disabled={!canAccess(1) || loading}
                  >
                    {loading ? (
                      <option>Chargement...</option>
                    ) : (
                      getFilteredResources(resources.frontendFrameworks, 1).map(
                        (framework) => (
                          <option key={framework.code} value={framework.code}>
                            {framework.name}
                          </option>
                        )
                      )
                    )}
                  </select>
                </div>
              </PremiumFeatureBox>
            )}

            <div className="form-group">
              <label htmlFor="styling">Styling</label>
              <select
                id="styling"
                value={config.styling}
                onChange={(e) => handleInputChange("styling", e.target.value)}
                disabled={loading}
              >
                {loading ? (
                  <option>Chargement...</option>
                ) : (
                  resources.frontendStylings.map((styling) => (
                    <option key={styling.code} value={styling.code}>
                      {styling.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Configuration Projet */}

            <h3>⚙️ Configuration Projet</h3>

            <div className="form-group">
              <label htmlFor="projectName">Nom du projet</label>
              <input
                type="text"
                id="projectName"
                value={config.projectName}
                onChange={(e) =>
                  handleInputChange("projectName", e.target.value)
                }
                placeholder="mon-super-todo"
              />
            </div>

            <PremiumFeatureBox
              requiredPremiumLevel={1}
              userPremiumLevel={userPremium.premiumLevel}
              onUpgradeClick={handleUpgradeClick}
            >
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="includeAuth"
                  checked={config.includeAuth}
                  onChange={(e) =>
                    handleInputChange("includeAuth", e.target.checked)
                  }
                  disabled={!canAccess(1)}
                />
                <label htmlFor="includeAuth">
                  Inclure l'authentification
                  <PremiumIcon premiumLevel={1} size={14} />
                </label>
              </div>
            </PremiumFeatureBox>
            <PremiumFeatureBox
              requiredPremiumLevel={1}
              userPremiumLevel={userPremium.premiumLevel}
              onUpgradeClick={handleUpgradeClick}
            >
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="includeTests"
                  checked={config.includeTests}
                  onChange={(e) =>
                    handleInputChange("includeTests", e.target.checked)
                  }
                  disabled={!canAccess(1)}
                />{" "}
                <label htmlFor="includeTests">Tests unitaires</label>
                <PremiumIcon premiumLevel={1} size={14} />
              </div>
            </PremiumFeatureBox>

            <PremiumFeatureBox
              requiredPremiumLevel={2}
              userPremiumLevel={userPremium.premiumLevel}
              onUpgradeClick={handleUpgradeClick}
            >
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="includeDocker"
                  checked={config.includeDocker}
                  onChange={(e) =>
                    handleInputChange("includeDocker", e.target.checked)
                  }
                  disabled={!canAccess(2)}
                />
                <label htmlFor="includeDocker">
                  Docker Compose
                  <PremiumIcon premiumLevel={2} size={14} className="ml-2" />
                </label>
              </div>
            </PremiumFeatureBox>

            <PremiumFeatureBox
              requiredPremiumLevel={2}
              userPremiumLevel={userPremium.premiumLevel}
              onUpgradeClick={handleUpgradeClick}
            >
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="includeCI"
                  checked={config.includeCI}
                  onChange={(e) =>
                    handleInputChange("includeCI", e.target.checked)
                  }
                  disabled={!canAccess(2)}
                />
                <label htmlFor="includeCI">
                  CI/CD (GitHub Actions)
                  <PremiumIcon premiumLevel={2} size={14} className="ml-2" />
                </label>
              </div>
            </PremiumFeatureBox>

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
    </div>
  );
};

export default GeneratorForm;

import type {
  ProjectConfig,
  FileStructure,
  DeploymentInstructions,
  TechStackInfo,
  BackendLanguage,
  FrontendFramework,
  Database,
} from "../types";

// Mapping des technologies vers leurs noms d'affichage
export const BACKEND_LABELS: Record<BackendLanguage, string> = {
  node: "Node.js + Express",
  python: "Python + FastAPI",
  java: "Java + Spring Boot",
  csharp: "C# + .NET Core",
  go: "Go + Gin",
  php: "PHP + Laravel",
};

export const FRONTEND_LABELS: Record<FrontendFramework, string> = {
  react: "React + TypeScript",
  vue: "Vue.js 3 + TypeScript",
  angular: "Angular + TypeScript",
  svelte: "Svelte + TypeScript",
  nextjs: "Next.js + React",
  nuxt: "Nuxt.js + Vue",
};

export const DATABASE_LABELS: Record<Database, string> = {
  sqlite: "SQLite (Embedded)",
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  mongodb: "MongoDB",
  redis: "Redis (Cache + Data)",
};

// Génération de la structure de fichiers
export function generateFileStructure(config: ProjectConfig): FileStructure {
  const {
    projectName,
    backendLang,
    frontendType,
    frontendFramework,
    includeDocker,
    includeTests,
  } = config;

  const structure: FileStructure = {
    name: projectName,
    type: "folder",
    children: [],
  };

  // Structure backend
  const backendFolder = generateBackendStructure(backendLang, includeTests);
  structure.children!.push(backendFolder);

  // Structure frontend (si ce n'est pas MVP)
  if (frontendType !== "mvp") {
    const frontendFolder = generateFrontendStructure(
      frontendFramework,
      includeTests
    );
    structure.children!.push(frontendFolder);
  }

  // Fichiers racine
  structure.children!.push(
    { name: "README.md", type: "file" },
    { name: ".gitignore", type: "file" }
  );

  // Docker
  if (includeDocker) {
    structure.children!.push(
      { name: "docker-compose.yml", type: "file" },
      { name: "Dockerfile.backend", type: "file" }
    );

    if (frontendType !== "mvp") {
      structure.children!.push({ name: "Dockerfile.frontend", type: "file" });
    }
  }

  return structure;
}

function generateBackendStructure(
  backendLang: BackendLanguage,
  includeTests: boolean
): FileStructure {
  const commonFiles = [
    {
      name: "src",
      type: "folder" as const,
      children: [
        { name: "controllers", type: "folder" as const },
        { name: "models", type: "folder" as const },
        { name: "routes", type: "folder" as const },
        { name: "middleware", type: "folder" as const },
        { name: "services", type: "folder" as const },
        { name: "utils", type: "folder" as const },
      ],
    },
    { name: "config", type: "folder" as const },
  ];

  if (includeTests) {
    commonFiles.push({ name: "tests", type: "folder" as const });
  }

  const backendStructures: Record<BackendLanguage, FileStructure> = {
    node: {
      name: "backend",
      type: "folder",
      children: [
        ...commonFiles,
        { name: "package.json", type: "file" },
        { name: "server.js", type: "file" },
        { name: ".env.example", type: "file" },
      ],
    },
    python: {
      name: "backend",
      type: "folder",
      children: [
        ...commonFiles,
        { name: "requirements.txt", type: "file" },
        { name: "main.py", type: "file" },
        { name: ".env.example", type: "file" },
      ],
    },
    java: {
      name: "backend",
      type: "folder",
      children: [
        { name: "src/main/java", type: "folder" },
        { name: "src/main/resources", type: "folder" },
        { name: "pom.xml", type: "file" },
        { name: "application.properties", type: "file" },
      ],
    },
    csharp: {
      name: "backend",
      type: "folder",
      children: [
        { name: "Controllers", type: "folder" },
        { name: "Models", type: "folder" },
        { name: "Services", type: "folder" },
        { name: "Program.cs", type: "file" },
        { name: "appsettings.json", type: "file" },
      ],
    },
    go: {
      name: "backend",
      type: "folder",
      children: [
        ...commonFiles,
        { name: "go.mod", type: "file" },
        { name: "main.go", type: "file" },
        { name: ".env.example", type: "file" },
      ],
    },
    php: {
      name: "backend",
      type: "folder",
      children: [
        { name: "app", type: "folder" },
        { name: "routes", type: "folder" },
        { name: "database", type: "folder" },
        { name: "composer.json", type: "file" },
        { name: ".env.example", type: "file" },
      ],
    },
  };

  return backendStructures[backendLang];
}

function generateFrontendStructure(
  framework: FrontendFramework,
  includeTests: boolean
): FileStructure {
  const commonFiles = [
    {
      name: "src",
      type: "folder" as const,
      children: [
        { name: "components", type: "folder" as const },
        { name: "pages", type: "folder" as const },
        { name: "hooks", type: "folder" as const },
        { name: "utils", type: "folder" as const },
        { name: "assets", type: "folder" as const },
      ],
    },
    { name: "public", type: "folder" as const },
  ];

  if (includeTests) {
    commonFiles[0].children!.push({
      name: "__tests__",
      type: "folder" as const,
    });
  }

  const frontendStructures: Record<FrontendFramework, FileStructure> = {
    react: {
      name: "frontend",
      type: "folder",
      children: [
        ...commonFiles,
        { name: "package.json", type: "file" },
        { name: "index.html", type: "file" },
        { name: "vite.config.ts", type: "file" },
      ],
    },
    vue: {
      name: "frontend",
      type: "folder",
      children: [
        ...commonFiles,
        { name: "package.json", type: "file" },
        { name: "index.html", type: "file" },
        { name: "vite.config.ts", type: "file" },
      ],
    },
    angular: {
      name: "frontend",
      type: "folder",
      children: [
        { name: "src", type: "folder" },
        { name: "package.json", type: "file" },
        { name: "angular.json", type: "file" },
        { name: "tsconfig.json", type: "file" },
      ],
    },
    svelte: {
      name: "frontend",
      type: "folder",
      children: [
        ...commonFiles,
        { name: "package.json", type: "file" },
        { name: "svelte.config.js", type: "file" },
        { name: "vite.config.js", type: "file" },
      ],
    },
    nextjs: {
      name: "frontend",
      type: "folder",
      children: [
        { name: "src/app", type: "folder" },
        { name: "src/components", type: "folder" },
        { name: "package.json", type: "file" },
        { name: "next.config.js", type: "file" },
      ],
    },
    nuxt: {
      name: "frontend",
      type: "folder",
      children: [
        { name: "pages", type: "folder" },
        { name: "components", type: "folder" },
        { name: "package.json", type: "file" },
        { name: "nuxt.config.ts", type: "file" },
      ],
    },
  };

  return frontendStructures[framework];
}

// Génération des instructions de déploiement
export function generateInstructions(
  config: ProjectConfig
): DeploymentInstructions {
  const {
    backendLang,
    frontendType,
    frontendFramework,
    includeDocker,
    database,
  } = config;

  const instructions: DeploymentInstructions = {
    setup: [],
    development: [],
    production: [],
  };

  // Instructions de setup
  instructions.setup = [
    "# Setup du projet",
    "",
    "## Prérequis",
    ...getPrerequisites(backendLang, frontendFramework),
    "",
    "## Installation",
    "git clone <your-repo>",
    `cd ${config.projectName}`,
    "",
  ];

  // Instructions backend
  instructions.setup.push(...getBackendSetup(backendLang, database));

  // Instructions frontend
  if (frontendType !== "mvp") {
    instructions.setup.push(...getFrontendSetup(frontendFramework));
  }

  // Instructions de développement
  instructions.development = [
    "# Développement",
    "",
    "## Démarrer le backend",
    ...getBackendDevCommands(backendLang),
    "",
  ];

  if (frontendType !== "mvp") {
    instructions.development.push(
      "## Démarrer le frontend",
      ...getFrontendDevCommands(frontendFramework),
      ""
    );
  }

  // Instructions de production
  instructions.production = [
    "# Production",
    "",
    ...getProductionCommands(backendLang, frontendFramework, frontendType),
  ];

  // Instructions Docker
  if (includeDocker) {
    instructions.docker = [
      "# Docker",
      "",
      "docker-compose up -d",
      "",
      "# Logs",
      "docker-compose logs -f",
    ];
  }

  return instructions;
}

function getPrerequisites(
  backendLang: BackendLanguage,
  frontendFramework?: FrontendFramework
): string[] {
  const prerequisites = [];

  switch (backendLang) {
    case "node":
      prerequisites.push("- Node.js 18+", "- npm ou yarn");
      break;
    case "python":
      prerequisites.push("- Python 3.9+", "- pip");
      break;
    case "java":
      prerequisites.push("- Java 17+", "- Maven 3.6+");
      break;
    case "csharp":
      prerequisites.push("- .NET 6.0+");
      break;
    case "go":
      prerequisites.push("- Go 1.19+");
      break;
    case "php":
      prerequisites.push("- PHP 8.1+", "- Composer");
      break;
  }

  if (frontendFramework && frontendFramework !== "react") {
    prerequisites.push("- Node.js 18+", "- npm ou yarn");
  }

  return prerequisites;
}

function getBackendSetup(
  backendLang: BackendLanguage,
  database: Database
): string[] {
  const commands = ["## Backend"];

  switch (backendLang) {
    case "node":
      commands.push("cd backend", "npm install");
      break;
    case "python":
      commands.push("cd backend", "pip install -r requirements.txt");
      break;
    case "java":
      commands.push("cd backend", "mvn clean install");
      break;
    case "csharp":
      commands.push("cd backend", "dotnet restore");
      break;
    case "go":
      commands.push("cd backend", "go mod tidy");
      break;
    case "php":
      commands.push("cd backend", "composer install");
      break;
  }

  // Configuration base de données
  commands.push("", "## Base de données");
  switch (database) {
    case "postgresql":
      commands.push("createdb todoapp_db");
      break;
    case "mysql":
      commands.push('mysql -u root -p -e "CREATE DATABASE todoapp_db;"');
      break;
    case "mongodb":
      commands.push("# MongoDB démarrera automatiquement");
      break;
    case "sqlite":
      commands.push("# SQLite se créera automatiquement");
      break;
    case "redis":
      commands.push("# Démarrer Redis server");
      break;
  }

  return commands;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFrontendSetup(_framework: FrontendFramework): string[] {
  return ["", "## Frontend", "cd frontend", "npm install"];
}

function getBackendDevCommands(backendLang: BackendLanguage): string[] {
  switch (backendLang) {
    case "node":
      return ["cd backend", "npm run dev"];
    case "python":
      return ["cd backend", "uvicorn main:app --reload"];
    case "java":
      return ["cd backend", "mvn spring-boot:run"];
    case "csharp":
      return ["cd backend", "dotnet run"];
    case "go":
      return ["cd backend", "go run main.go"];
    case "php":
      return ["cd backend", "php artisan serve"];
    default:
      return [];
  }
}

function getFrontendDevCommands(framework: FrontendFramework): string[] {
  switch (framework) {
    case "react":
    case "vue":
    case "svelte":
      return ["cd frontend", "npm run dev"];
    case "angular":
      return ["cd frontend", "ng serve"];
    case "nextjs":
      return ["cd frontend", "npm run dev"];
    case "nuxt":
      return ["cd frontend", "npm run dev"];
    default:
      return [];
  }
}

function getProductionCommands(
  backendLang: BackendLanguage,
  frontendFramework?: FrontendFramework,
  frontendType?: string
): string[] {
  const commands = [];

  if (frontendType !== "mvp" && frontendFramework) {
    commands.push("## Build Frontend", "cd frontend", "npm run build", "");
  }

  commands.push("## Déployer Backend");
  switch (backendLang) {
    case "node":
      commands.push("cd backend", "npm run build", "npm start");
      break;
    case "python":
      commands.push("cd backend", "gunicorn main:app");
      break;
    case "java":
      commands.push(
        "cd backend",
        "mvn clean package",
        "java -jar target/*.jar"
      );
      break;
    case "csharp":
      commands.push(
        "cd backend",
        "dotnet publish -c Release",
        "dotnet bin/Release/net6.0/*.dll"
      );
      break;
    case "go":
      commands.push("cd backend", "go build -o app", "./app");
      break;
    case "php":
      commands.push(
        "cd backend",
        "composer install --optimize-autoloader --no-dev"
      );
      break;
  }

  return commands;
}

// Génération du tech stack
export function generateTechStack(config: ProjectConfig): TechStackInfo {
  const features = [];

  if (config.includeAuth) features.push("Authentification JWT");
  if (config.includeTests) features.push("Tests unitaires");
  if (config.includeDocker) features.push("Docker & Docker Compose");
  if (config.includeCI) features.push("CI/CD GitHub Actions");
  if (config.includeAPI) features.push("Documentation API (Swagger/OpenAPI)");

  return {
    backend: {
      language: BACKEND_LABELS[config.backendLang],
      framework: config.architecture,
      architecture: config.architecture,
    },
    frontend: {
      type:
        config.frontendType === "mvp"
          ? "Templates serveur"
          : config.frontendType === "spa"
          ? "Single Page Application"
          : "Server Side Rendering",
      framework:
        config.frontendType === "mvp"
          ? "Templates serveur"
          : FRONTEND_LABELS[config.frontendFramework],
      styling: config.styling,
    },
    database: {
      type: DATABASE_LABELS[config.database],
      name: config.database,
    },
    features,
  };
}


// Gestion du formulaire
document.getElementById('frontendType').addEventListener('change', function() {
    const frameworkGroup = document.getElementById('frontendFrameworkGroup');
    frameworkGroup.style.display = this.value === 'mvp' ? 'none' : 'block';
});

document.getElementById('generatorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generateProject();
});

function generateProject() {
    const formData = new FormData(document.getElementById('generatorForm'));
    const config = Object.fromEntries(formData.entries());
    
    // Récupération des checkboxes
    config.includeAuth = document.getElementById('includeAuth').checked;
    config.includeTests = document.getElementById('includeTests').checked;
    config.includeDocker = document.getElementById('includeDocker').checked;
    config.includeCI = document.getElementById('includeCI').checked;
    config.includeAPI = document.getElementById('includeAPI').checked;

    displayResults(config);
}

function displayResults(config) {
    const outputSection = document.getElementById('outputSection');
    const techStack = document.getElementById('techStack');
    const fileStructure = document.getElementById('fileStructure');
    const instructions = document.getElementById('instructions');

    // Affichage de la stack technique
    let techStackHTML = '<h4>Stack Technique:</h4>';
    techStackHTML += `<span class="tech-badge">${getBackendTech(config.backendLang)}</span>`;
    techStackHTML += `<span class="tech-badge">${config.database.toUpperCase()}</span>`;
    if (config.frontendType !== 'mvp') {
        techStackHTML += `<span class="tech-badge">${config.frontendFramework}</span>`;
    }
    techStackHTML += `<span class="tech-badge">${config.styling}</span>`;
    techStackHTML += `<span class="tech-badge">${config.architecture}</span>`;
    if (config.includeDocker) techStackHTML += '<span class="tech-badge">Docker</span>';
    if (config.includeAuth) techStackHTML += '<span class="tech-badge">Auth</span>';
    
    techStack.innerHTML = techStackHTML;

    // Structure des fichiers
    fileStructure.innerHTML = `<h4>Structure du projet:</h4><div class="file-structure">${generateFileStructure(config)}</div>`;

    // Instructions
    instructions.innerHTML = `<h4>Instructions de démarrage:</h4><div class="code-block">${generateInstructions(config)}</div>`;

    outputSection.classList.add('active');
    outputSection.scrollIntoView({ behavior: 'smooth' });
}

function getBackendTech(lang) {
    const map = {
        'node': 'Node.js',
        'python': 'Python/FastAPI',
        'java': 'Java/Spring',
        'csharp': 'C#/.NET',
        'go': 'Go/Gin',
        'php': 'PHP/Laravel'
    };
    return map[lang] || lang;
}

function generateFileStructure(config) {
    const projectName = config.projectName || 'my-todo-app';
    let structure = `${projectName}/
├── README.md
├── .gitignore`;

    if (config.includeDocker) {
        structure += `
├── docker-compose.yml
├── Dockerfile`;
    }

    if (config.includeCI) {
        structure += `
├── .github/
│   └── workflows/
│       └── ci.yml`;
    }

    // Backend structure
    structure += `
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── routes/`;

    if (config.architecture === 'clean') {
        structure += `
│   │   ├── entities/
│   │   ├── usecases/
│   │   └── adapters/`;
    }

    structure += `
│   │   └── app.${getFileExtension(config.backendLang)}
│   ├── tests/`;

    if (config.includeAPI) {
        structure += `
│   ├── docs/
│   │   └── api.yml`;
    }

    structure += `
│   └── package.json`;

    // Frontend structure (si pas MVP)
    if (config.frontendType !== 'mvp') {
        structure += `
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.${config.frontendFramework === 'svelte' ? 'svelte' : 'jsx'}
│   ├── public/
│   └── package.json`;
    }

    return structure;
}

function getFileExtension(lang) {
    const map = {
        'node': 'js',
        'python': 'py',
        'java': 'java',
        'csharp': 'cs',
        'go': 'go',
        'php': 'php'
    };
    return map[lang] || 'js';
}

function generateInstructions(config) {
    let instructions = `# Instructions de démarrage pour ${config.projectName}

## Prérequis`;

    if (config.includeDocker) {
        instructions += `
- Docker et Docker Compose installés`;
    } else {
        instructions += `
- ${getBackendTech(config.backendLang)} installé
- ${config.database} installé`;
    }

    instructions += `

## Démarrage rapide`;

    if (config.includeDocker) {
        instructions += `
1. Cloner le projet
2. Se placer dans le dossier du projet
3. Lancer avec Docker:
docker-compose up -d

L'application sera disponible sur:
- Backend API: http://localhost:3000
- Frontend: http://localhost:3001 (si SPA)
- Base de données: localhost:5432 (PostgreSQL) ou selon config`;
    } else {
        instructions += `
1. Installation Backend:
cd backend
${getInstallCommand(config.backendLang)}
${getStartCommand(config.backendLang)}

2. Installation Frontend: ${config.frontendType !== 'mvp' ? `
cd frontend
npm install
npm run dev` : '(Intégré au backend)'}

3. Configuration base de données:
- Créer une base de données ${config.database}
- Modifier le fichier de configuration
- Lancer les migrations`;
    }

    instructions += `

## Fonctionnalités incluses
- ✅ CRUD des todos (Create, Read, Update, Delete)
- ✅ Architecture ${config.architecture}`;

    if (config.includeAuth) instructions += `
- ✅ Système d'authentification`;
    if (config.includeTests) instructions += `
- ✅ Tests unitaires`;
    if (config.includeAPI) instructions += `
- ✅ Documentation API Swagger`;

    instructions += `

## API Endpoints
- GET /api/todos - Lister les todos
- POST /api/todos - Créer un todo
- PUT /api/todos/:id - Modifier un todo
- DELETE /api/todos/:id - Supprimer un todo`;

    if (config.includeAuth) {
        instructions += `
- POST /api/auth/login - Connexion
- POST /api/auth/register - Inscription`;
    }

    return instructions;
}

function getInstallCommand(lang) {
    const map = {
        'node': 'npm install',
        'python': 'pip install -r requirements.txt',
        'java': 'mvn install',
        'csharp': 'dotnet restore',
        'go': 'go mod tidy',
        'php': 'composer install'
    };
    return map[lang] || 'npm install';
}

function getStartCommand(lang) {
    const map = {
        'node': 'npm start',
        'python': 'uvicorn main:app --reload',
        'java': 'mvn spring-boot:run',
        'csharp': 'dotnet run',
        'go': 'go run main.go',
        'php': 'php artisan serve'
    };
    return map[lang] || 'npm start';
}

function downloadProject() {
    alert('🚧 Fonctionnalité en développement!\nLe téléchargement automatique sera bientôt disponible.');
}

function copyToClipboard() {
    const instructions = document.querySelector('.code-block').textContent;
    navigator.clipboard.writeText(instructions).then(() => {
        alert('📋 Instructions copiées dans le presse-papier !');
    });
}

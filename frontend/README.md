# 🚀 TodoApp Generator

Une application React moderne qui génère automatiquement des applications TodoList complètes avec différentes stacks technologiques.

## ✨ Fonctionnalités

- **Configuration Backend** : Node.js, Python, Java, C#, Go, PHP
- **Configuration Frontend** : React, Vue.js, Angular, Svelte, Next.js, Nuxt.js
- **Base de données** : SQLite, PostgreSQL, MySQL, MongoDB, Redis
- **Architecture** : MVC, Clean Architecture, Hexagonal, Layered, Microservices
- **Fonctionnalités optionnelles** : Authentification, Tests, Docker, CI/CD, Documentation API

## 🛠️ Technologies utilisées

- **Frontend** : React 18 + TypeScript
- **Build Tool** : Vite
- **Styling** : CSS moderne avec glass-morphism et gradients
- **State Management** : React Hooks

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone <your-repo>
cd TodoAppGenerator/frontend

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Compiler pour la production
npm run build
```

## 📁 Structure du projet

```
frontend/
├── src/
│   ├── components/          # Composants React
│   │   ├── GeneratorForm.tsx
│   │   ├── OutputSection.tsx
│   │   ├── TechStackDisplay.tsx
│   │   ├── FileStructureDisplay.tsx
│   │   └── InstructionsDisplay.tsx
│   ├── types/               # Types TypeScript
│   │   └── index.ts
│   ├── utils/               # Utilitaires
│   │   └── projectGenerator.ts
│   ├── App.tsx              # Composant principal
│   ├── App.css              # Styles principaux
│   └── main.tsx             # Point d'entrée
├── public/                  # Assets statiques
├── .github/                 # Configuration GitHub
│   └── copilot-instructions.md
└── package.json
```

## 🎯 Utilisation

1. **Configurer le Backend** : Choisissez le langage, l'architecture et la base de données
2. **Configurer le Frontend** : Sélectionnez le type (MVP/SPA/SSR), le framework et le styling
3. **Options du Projet** : Activez les fonctionnalités optionnelles (Auth, Tests, Docker, etc.)
4. **Générer** : Cliquez sur "Générer l'application" pour obtenir la structure complète
5. **Télécharger ou Copier** : Récupérez les fichiers générés et les instructions

## 🎨 Design

L'application utilise un design moderne avec :

- **Glass-morphism** : Effets de verre avec backdrop-blur
- **Gradients** : Dégradés colorés pour un aspect moderne
- **Responsive** : Interface adaptée à tous les écrans
- **Animations** : Transitions fluides et effets hover

## 🔧 Développement

### Scripts disponibles

- `npm run dev` : Démarrer le serveur de développement
- `npm run build` : Compiler pour la production
- `npm run preview` : Prévisualiser la build de production
- `npm run lint` : Linter le code

### Architecture

- **Composants fonctionnels** avec TypeScript strict
- **Hooks personnalisés** pour la logique métier
- **CSS modules** pour les styles
- **Types TypeScript** pour une meilleure DX

## 📝 Fonctionnalités futures

- [ ] Téléchargement réel des fichiers générés
- [ ] Intégration avec des APIs de déploiement
- [ ] Templates personnalisables
- [ ] Sauvegarde des configurations
- [ ] Partage de configurations

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

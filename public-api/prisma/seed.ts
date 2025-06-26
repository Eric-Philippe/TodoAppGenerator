import { PrismaClient } from "@prisma/client";

declare const process: {
  exit: (code: number) => never;
};

const prisma = new PrismaClient();

// Languages data
const languages = [
  {
    code: "node",
    name: "Node.js",
    description: "JavaScript runtime pour le backend avec Express.js",
    requiredTier: 0,
    isActive: true,
  },
  {
    code: "python",
    name: "Python (FastAPI)",
    description: "Framework web moderne et rapide pour Python",
    requiredTier: 0,
    isActive: true,
  },
  {
    code: "java",
    name: "Java (Spring Boot)",
    description: "Framework robuste pour applications Java",
    requiredTier: 1,
    isActive: true,
  },
  {
    code: "csharp",
    name: "C# (.NET)",
    description: "Framework Microsoft pour applications web",
    requiredTier: 1,
    isActive: true,
  },
  {
    code: "go",
    name: "Go (Gin)",
    description: "Langage performant avec framework Gin",
    requiredTier: 2,
    isActive: true,
  },
  {
    code: "php",
    name: "PHP (Laravel)",
    description: "Framework élégant pour applications PHP",
    requiredTier: 1,
    isActive: true,
  },
];

// Backend Architectures data
const backendArchitectures = [
  {
    code: "mvc",
    name: "MVC",
    description: "Architecture Model-View-Controller classique",
    requiredTier: 0,
    isActive: true,
  },
  {
    code: "clean",
    name: "Clean Architecture",
    description: "Architecture hexagonale avec séparation des couches",
    requiredTier: 1,
    isActive: true,
  },
  {
    code: "hexagonal",
    name: "Hexagonal",
    description: "Architecture ports et adaptateurs",
    requiredTier: 1,
    isActive: true,
  },
  {
    code: "layered",
    name: "Layered Architecture",
    description: "Architecture en couches traditionnelle",
    requiredTier: 1,
    isActive: true,
  },
  {
    code: "microserv",
    name: "Microservices",
    description: "Architecture distribuée en microservices",
    requiredTier: 2,
    isActive: true,
  },
];

// Databases data
const databases = [
  {
    code: "sqlite",
    name: "SQLite",
    description: "Base de données légère intégrée",
    requiredTier: 0,
    isActive: true,
  },
  {
    code: "postgresql",
    name: "PostgreSQL",
    description: "Base de données relationnelle avancée",
    requiredTier: 2,
    isActive: true,
  },
  {
    code: "mysql",
    name: "MySQL",
    description: "Base de données relationnelle populaire",
    requiredTier: 2,
    isActive: true,
  },
  {
    code: "mongodb",
    name: "MongoDB",
    description: "Base de données NoSQL orientée documents",
    requiredTier: 2,
    isActive: true,
  },
  {
    code: "redis",
    name: "Redis",
    description: "Base de données en mémoire pour cache",
    requiredTier: 2,
    isActive: true,
  },
];

// Frontend Architectures data
const frontendArchitectures = [
  {
    code: "mvp",
    name: "MVP (Templates serveur)",
    description: "Pages générées côté serveur",
    requiredTier: 0,
    isActive: true,
  },
  {
    code: "spa",
    name: "SPA (Single Page App)",
    description: "Application monopage côté client",
    requiredTier: 0,
    isActive: true,
  },
  {
    code: "ssr",
    name: "SSR (Server Side Rendering)",
    description: "Rendu côté serveur avec hydratation client",
    requiredTier: 1,
    isActive: true,
  },
];

// Frontend Frameworks data
const frontendFrameworks = [
  {
    code: "react",
    name: "React",
    description: "Bibliothèque JavaScript pour interfaces utilisateur",
    requiredTier: 0,
    isActive: true,
  },
  {
    code: "vue",
    name: "Vue.js",
    description: "Framework progressif pour interfaces utilisateur",
    requiredTier: 1,
    isActive: true,
  },
  {
    code: "angular",
    name: "Angular",
    description: "Framework complet pour applications web",
    requiredTier: 1,
    isActive: true,
  },
  {
    code: "svelte",
    name: "Svelte",
    description: "Framework compilé pour interfaces réactives",
    requiredTier: 1,
    isActive: true,
  },
  {
    code: "nextjs",
    name: "Next.js",
    description: "Framework React avec SSR et optimisations",
    requiredTier: 2,
    isActive: true,
  },
  {
    code: "nuxt",
    name: "Nuxt.js",
    description: "Framework Vue.js avec SSR et optimisations",
    requiredTier: 2,
    isActive: true,
  },
];

// Frontend Stylings data
const frontendStylings = [
  {
    code: "tailwind",
    name: "Tailwind CSS",
    description: "Framework CSS utilitaire",
    requiredTier: 0,
    isActive: true,
  },
  {
    code: "bootstrap",
    name: "Bootstrap",
    description: "Framework CSS responsive populaire",
    requiredTier: 0,
    isActive: true,
  },
  {
    code: "material",
    name: "Material UI",
    description: "Composants React Material Design",
    requiredTier: 1,
    isActive: true,
  },
  {
    code: "chakra",
    name: "Chakra UI",
    description: "Bibliothèque de composants React modulaires",
    requiredTier: 1,
    isActive: true,
  },
  {
    code: "css",
    name: "CSS Vanilla",
    description: "CSS pur sans framework",
    requiredTier: 0,
    isActive: true,
  },
];

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await prisma.frontendStyling.deleteMany();
    await prisma.frontendFramework.deleteMany();
    await prisma.frontendArchitecture.deleteMany();
    await prisma.database.deleteMany();
    await prisma.backendArchitecture.deleteMany();
    await prisma.language.deleteMany();

    // Seed Languages
    console.log("📝 Seeding languages...");
    for (const language of languages) {
      await prisma.language.create({
        data: language,
      });
    }

    // Seed Backend Architectures
    console.log("🏗️ Seeding backend architectures...");
    for (const architecture of backendArchitectures) {
      await prisma.backendArchitecture.create({
        data: architecture,
      });
    }

    // Seed Databases
    console.log("🗃️ Seeding databases...");
    for (const database of databases) {
      await prisma.database.create({
        data: database,
      });
    }

    // Seed Frontend Architectures
    console.log("🎨 Seeding frontend architectures...");
    for (const architecture of frontendArchitectures) {
      await prisma.frontendArchitecture.create({
        data: architecture,
      });
    }

    // Seed Frontend Frameworks
    console.log("⚛️ Seeding frontend frameworks...");
    for (const framework of frontendFrameworks) {
      await prisma.frontendFramework.create({
        data: framework,
      });
    }

    // Seed Frontend Stylings
    console.log("💅 Seeding frontend stylings...");
    for (const styling of frontendStylings) {
      await prisma.frontendStyling.create({
        data: styling,
      });
    }

    console.log("✅ Database seeding completed successfully!");

    // Display summary
    const counts = {
      languages: await prisma.language.count(),
      backendArchitectures: await prisma.backendArchitecture.count(),
      databases: await prisma.database.count(),
      frontendArchitectures: await prisma.frontendArchitecture.count(),
      frontendFrameworks: await prisma.frontendFramework.count(),
      frontendStylings: await prisma.frontendStyling.count(),
    };

    console.log("\n📊 Seeding Summary:");
    console.log(`Languages: ${counts.languages}`);
    console.log(`Backend Architectures: ${counts.backendArchitectures}`);
    console.log(`Databases: ${counts.databases}`);
    console.log(`Frontend Architectures: ${counts.frontendArchitectures}`);
    console.log(`Frontend Frameworks: ${counts.frontendFrameworks}`);
    console.log(`Frontend Stylings: ${counts.frontendStylings}`);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

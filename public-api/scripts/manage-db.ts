import { PrismaClient } from "@prisma/client";

declare const process: {
  argv: string[];
  exit: (code: number) => never;
};

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log("🔄 Resetting database...");

  try {
    // Clear all tables
    await prisma.frontendStyling.deleteMany();
    await prisma.frontendFramework.deleteMany();
    await prisma.frontendArchitecture.deleteMany();
    await prisma.database.deleteMany();
    await prisma.backendArchitecture.deleteMany();
    await prisma.language.deleteMany();

    console.log("✅ Database reset completed!");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw error;
  }
}

async function checkTables() {
  console.log("📊 Checking table contents...");

  try {
    const counts = {
      languages: await prisma.language.count(),
      backendArchitectures: await prisma.backendArchitecture.count(),
      databases: await prisma.database.count(),
      frontendArchitectures: await prisma.frontendArchitecture.count(),
      frontendFrameworks: await prisma.frontendFramework.count(),
      frontendStylings: await prisma.frontendStyling.count(),
    };

    console.log("\n📋 Table Counts:");
    console.log(`Languages: ${counts.languages}`);
    console.log(`Backend Architectures: ${counts.backendArchitectures}`);
    console.log(`Databases: ${counts.databases}`);
    console.log(`Frontend Architectures: ${counts.frontendArchitectures}`);
    console.log(`Frontend Frameworks: ${counts.frontendFrameworks}`);
    console.log(`Frontend Stylings: ${counts.frontendStylings}`);

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    console.log(`\nTotal records: ${total}`);

    return counts;
  } catch (error) {
    console.error("❌ Error checking tables:", error);
    throw error;
  }
}

async function main() {
  const command = process.argv[2];

  switch (command) {
    case "reset":
      await resetDatabase();
      break;
    case "check":
      await checkTables();
      break;
    case "status":
      await checkTables();
      break;
    default:
      console.log("📖 Usage:");
      console.log("npm run db:manage reset  - Reset all tables");
      console.log("npm run db:manage check  - Check table contents");
      console.log("npm run db:manage status - Show table status");
      break;
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

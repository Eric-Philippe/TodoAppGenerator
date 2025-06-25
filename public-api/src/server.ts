import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { PrismaClient } from "@prisma/client";

import languageRoutes from "./routes/languages";
import backendArchitectureRoutes from "./routes/backend-architectures";
import databaseRoutes from "./routes/databases";
import frontendArchitectureRoutes from "./routes/frontend-architectures";
import frontendFrameworkRoutes from "./routes/frontend-frameworks";
import frontendStylingRoutes from "./routes/frontend-stylings";

const app = express();
const port = process.env.PORT || 3001;

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TodoApp Generator Public API",
      version: "1.0.0",
      description:
        "Public API for TodoApp Generator - Provides read-only access to configuration data",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Language: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", maxLength: 100 },
            description: { type: "string", nullable: true },
            requiredTier: { type: "integer", minimum: 0 },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            code: { type: "string", maxLength: 10 },
          },
        },
        BackendArchitecture: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", maxLength: 100 },
            description: { type: "string", nullable: true },
            requiredTier: { type: "integer", minimum: 0 },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            code: { type: "string", maxLength: 10 },
          },
        },
        Database: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", maxLength: 100 },
            description: { type: "string", nullable: true },
            requiredTier: { type: "integer", minimum: 0 },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            code: { type: "string", maxLength: 10 },
          },
        },
        FrontendArchitecture: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", maxLength: 100 },
            description: { type: "string", nullable: true },
            requiredTier: { type: "integer", minimum: 0 },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            code: { type: "string", maxLength: 10 },
          },
        },
        FrontendFramework: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", maxLength: 100 },
            description: { type: "string", nullable: true },
            requiredTier: { type: "integer", minimum: 0 },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            code: { type: "string", maxLength: 10 },
          },
        },
        FrontendStyling: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", maxLength: 100 },
            description: { type: "string", nullable: true },
            requiredTier: { type: "integer", minimum: 0 },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            code: { type: "string", maxLength: 10 },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/v1/languages", languageRoutes);
app.use("/api/v1/backend-architectures", backendArchitectureRoutes);
app.use("/api/v1/databases", databaseRoutes);
app.use("/api/v1/frontend-architectures", frontendArchitectureRoutes);
app.use("/api/v1/frontend-frameworks", frontendFrameworkRoutes);
app.use("/api/v1/frontend-stylings", frontendStylingRoutes);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
);

// 404 handler
app.use("*", (req, res) => {
  res
    .status(404)
    .json({
      error: "Not Found",
      message: "The requested resource was not found",
    });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`🚀 Public API server running on port ${port}`);
  console.log(
    `📚 API Documentation available at http://localhost:${port}/api-docs`
  );
});

export default app;

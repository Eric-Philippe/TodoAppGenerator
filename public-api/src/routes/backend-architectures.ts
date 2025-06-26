import { Router } from "express";
import { prisma } from "../server";

const router = Router();

/**
 * @swagger
 * /api/v1/backend-architectures:
 *   get:
 *     summary: Get all backend architectures
 *     tags: [Backend Architectures]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: tier
 *         schema:
 *           type: integer
 *         description: Filter by required tier (0 = free, 1+ = premium)
 *     responses:
 *       200:
 *         description: List of backend architectures
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BackendArchitecture'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", async (req, res) => {
  try {
    const { active, tier } = req.query;

    const where: any = {};

    if (active !== undefined) {
      where.isActive = active === "true";
    }

    if (tier !== undefined) {
      where.requiredTier = parseInt(tier as string);
    }

    const architectures = await prisma.backendArchitecture.findMany({
      where,
      orderBy: { name: "asc" },
    });

    res.json(architectures);
  } catch (error) {
    console.error("Error fetching backend architectures:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch backend architectures",
    });
  }
});

/**
 * @swagger
 * /api/v1/backend-architectures/{id}:
 *   get:
 *     summary: Get a specific backend architecture by ID
 *     tags: [Backend Architectures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Backend architecture ID
 *     responses:
 *       200:
 *         description: Backend architecture details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BackendArchitecture'
 *       404:
 *         description: Backend architecture not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const architecture = await prisma.backendArchitecture.findUnique({
      where: { id },
    });

    if (!architecture) {
      return res.status(404).json({
        error: "Not Found",
        message: "Backend architecture not found",
      });
    }

    res.json(architecture);
  } catch (error) {
    console.error("Error fetching backend architecture:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch backend architecture",
    });
  }
});

/**
 * @swagger
 * /api/v1/backend-architectures/code/{code}:
 *   get:
 *     summary: Get a specific backend architecture by code
 *     tags: [Backend Architectures]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Backend architecture code
 *     responses:
 *       200:
 *         description: Backend architecture details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BackendArchitecture'
 *       404:
 *         description: Backend architecture not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/code/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const architecture = await prisma.backendArchitecture.findUnique({
      where: { code },
    });

    if (!architecture) {
      return res.status(404).json({
        error: "Not Found",
        message: "Backend architecture not found",
      });
    }

    res.json(architecture);
  } catch (error) {
    console.error("Error fetching backend architecture:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch backend architecture",
    });
  }
});

export default router;

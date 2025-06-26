import { Router } from "express";
import { prisma } from "../server";

const router = Router();

/**
 * @swagger
 * /api/v1/frontend-architectures:
 *   get:
 *     summary: Get all frontend architectures
 *     tags: [Frontend Architectures]
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
 *         description: List of frontend architectures
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FrontendArchitecture'
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

    const architectures = await prisma.frontendArchitecture.findMany({
      where,
      orderBy: { name: "asc" },
    });

    res.json(architectures);
  } catch (error) {
    console.error("Error fetching frontend architectures:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch frontend architectures",
    });
  }
});

/**
 * @swagger
 * /api/v1/frontend-architectures/{id}:
 *   get:
 *     summary: Get a specific frontend architecture by ID
 *     tags: [Frontend Architectures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Frontend architecture ID
 *     responses:
 *       200:
 *         description: Frontend architecture details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FrontendArchitecture'
 *       404:
 *         description: Frontend architecture not found
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

    const architecture = await prisma.frontendArchitecture.findUnique({
      where: { id },
    });

    if (!architecture) {
      return res.status(404).json({
        error: "Not Found",
        message: "Frontend architecture not found",
      });
    }

    res.json(architecture);
  } catch (error) {
    console.error("Error fetching frontend architecture:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch frontend architecture",
    });
  }
});

/**
 * @swagger
 * /api/v1/frontend-architectures/code/{code}:
 *   get:
 *     summary: Get a specific frontend architecture by code
 *     tags: [Frontend Architectures]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Frontend architecture code
 *     responses:
 *       200:
 *         description: Frontend architecture details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FrontendArchitecture'
 *       404:
 *         description: Frontend architecture not found
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

    const architecture = await prisma.frontendArchitecture.findUnique({
      where: { code },
    });

    if (!architecture) {
      return res.status(404).json({
        error: "Not Found",
        message: "Frontend architecture not found",
      });
    }

    res.json(architecture);
  } catch (error) {
    console.error("Error fetching frontend architecture:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch frontend architecture",
    });
  }
});

export default router;

import { Router } from "express";
import { prisma } from "../server";

const router = Router();

/**
 * @swagger
 * /api/v1/frontend-frameworks:
 *   get:
 *     summary: Get all frontend frameworks
 *     tags: [Frontend Frameworks]
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
 *         description: List of frontend frameworks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FrontendFramework'
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

    const frameworks = await prisma.frontendFramework.findMany({
      where,
      orderBy: { name: "asc" },
    });

    res.json(frameworks);
  } catch (error) {
    console.error("Error fetching frontend frameworks:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch frontend frameworks",
    });
  }
});

/**
 * @swagger
 * /api/v1/frontend-frameworks/{id}:
 *   get:
 *     summary: Get a specific frontend framework by ID
 *     tags: [Frontend Frameworks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Frontend framework ID
 *     responses:
 *       200:
 *         description: Frontend framework details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FrontendFramework'
 *       404:
 *         description: Frontend framework not found
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

    const framework = await prisma.frontendFramework.findUnique({
      where: { id },
    });

    if (!framework) {
      return res.status(404).json({
        error: "Not Found",
        message: "Frontend framework not found",
      });
    }

    res.json(framework);
  } catch (error) {
    console.error("Error fetching frontend framework:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch frontend framework",
    });
  }
});

/**
 * @swagger
 * /api/v1/frontend-frameworks/code/{code}:
 *   get:
 *     summary: Get a specific frontend framework by code
 *     tags: [Frontend Frameworks]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Frontend framework code
 *     responses:
 *       200:
 *         description: Frontend framework details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FrontendFramework'
 *       404:
 *         description: Frontend framework not found
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

    const framework = await prisma.frontendFramework.findUnique({
      where: { code },
    });

    if (!framework) {
      return res.status(404).json({
        error: "Not Found",
        message: "Frontend framework not found",
      });
    }

    res.json(framework);
  } catch (error) {
    console.error("Error fetching frontend framework:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch frontend framework",
    });
  }
});

export default router;

import { Router } from "express";
import { prisma } from "../server";

const router = Router();

/**
 * @swagger
 * /api/v1/frontend-stylings:
 *   get:
 *     summary: Get all frontend styling options
 *     tags: [Frontend Stylings]
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
 *         description: List of frontend styling options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FrontendStyling'
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

    const stylings = await prisma.frontendStyling.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return res.json(stylings);
  } catch (error) {
    console.error("Error fetching frontend stylings:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch frontend stylings",
    });
  }
});

/**
 * @swagger
 * /api/v1/frontend-stylings/{id}:
 *   get:
 *     summary: Get a specific frontend styling by ID
 *     tags: [Frontend Stylings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Frontend styling ID
 *     responses:
 *       200:
 *         description: Frontend styling details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FrontendStyling'
 *       404:
 *         description: Frontend styling not found
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

    const styling = await prisma.frontendStyling.findUnique({
      where: { id },
    });

    if (!styling) {
      return res.status(404).json({
        error: "Not Found",
        message: "Frontend styling not found",
      });
    }

    return res.json(styling);
  } catch (error) {
    console.error("Error fetching frontend styling:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch frontend styling",
    });
  }
});

/**
 * @swagger
 * /api/v1/frontend-stylings/code/{code}:
 *   get:
 *     summary: Get a specific frontend styling by code
 *     tags: [Frontend Stylings]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Frontend styling code
 *     responses:
 *       200:
 *         description: Frontend styling details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FrontendStyling'
 *       404:
 *         description: Frontend styling not found
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

    const styling = await prisma.frontendStyling.findUnique({
      where: { code },
    });

    if (!styling) {
      return res.status(404).json({
        error: "Not Found",
        message: "Frontend styling not found",
      });
    }

    return res.json(styling);
  } catch (error) {
    console.error("Error fetching frontend styling:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch frontend styling",
    });
  }
});

export default router;

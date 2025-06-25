import { Router } from "express";
import { prisma } from "../server";

const router = Router();

/**
 * @swagger
 * /api/v1/languages:
 *   get:
 *     summary: Get all programming languages
 *     tags: [Languages]
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
 *         description: List of programming languages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Language'
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

    const languages = await prisma.language.findMany({
      where,
      orderBy: { name: "asc" },
    });

    res.json(languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch languages",
    });
  }
});

/**
 * @swagger
 * /api/v1/languages/{id}:
 *   get:
 *     summary: Get a specific programming language by ID
 *     tags: [Languages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Language ID
 *     responses:
 *       200:
 *         description: Programming language details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Language'
 *       404:
 *         description: Language not found
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

    const language = await prisma.language.findUnique({
      where: { id },
    });

    if (!language) {
      return res.status(404).json({
        error: "Not Found",
        message: "Language not found",
      });
    }

    res.json(language);
  } catch (error) {
    console.error("Error fetching language:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch language",
    });
  }
});

/**
 * @swagger
 * /api/v1/languages/code/{code}:
 *   get:
 *     summary: Get a specific programming language by code
 *     tags: [Languages]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Language code
 *     responses:
 *       200:
 *         description: Programming language details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Language'
 *       404:
 *         description: Language not found
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

    const language = await prisma.language.findUnique({
      where: { code },
    });

    if (!language) {
      return res.status(404).json({
        error: "Not Found",
        message: "Language not found",
      });
    }

    res.json(language);
  } catch (error) {
    console.error("Error fetching language:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch language",
    });
  }
});

export default router;

import { Router } from "express";
import { prisma } from "../server";

const router = Router();

/**
 * @swagger
 * /api/v1/databases:
 *   get:
 *     summary: Get all available databases
 *     tags: [Databases]
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
 *         description: List of available databases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Database'
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

    const databases = await prisma.database.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return res.json(databases);
  } catch (error) {
    console.error("Error fetching databases:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch databases",
    });
  }
});

/**
 * @swagger
 * /api/v1/databases/{id}:
 *   get:
 *     summary: Get a specific database by ID
 *     tags: [Databases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Database ID
 *     responses:
 *       200:
 *         description: Database details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Database'
 *       404:
 *         description: Database not found
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

    const database = await prisma.database.findUnique({
      where: { id },
    });

    if (!database) {
      return res.status(404).json({
        error: "Not Found",
        message: "Database not found",
      });
    }

    return res.json(database);
  } catch (error) {
    console.error("Error fetching database:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch database",
    });
  }
});

/**
 * @swagger
 * /api/v1/databases/code/{code}:
 *   get:
 *     summary: Get a specific database by code
 *     tags: [Databases]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Database code
 *     responses:
 *       200:
 *         description: Database details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Database'
 *       404:
 *         description: Database not found
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

    const database = await prisma.database.findUnique({
      where: { code },
    });

    if (!database) {
      return res.status(404).json({
        error: "Not Found",
        message: "Database not found",
      });
    }

    return res.json(database);
  } catch (error) {
    console.error("Error fetching database:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch database",
    });
  }
});

export default router;

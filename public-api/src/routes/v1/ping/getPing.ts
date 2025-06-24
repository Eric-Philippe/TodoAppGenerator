import { Request, Response } from "express";

/**
 * @swagger
 * /api/v1/ping:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns a simple pong response to verify the API is running
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Successfully pinged the API
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PingResponse'
 *             example:
 *               message: "pong"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "error"
 */
export const getPing = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "pong" });
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
};

import * as express from "express";

import { v1Routes } from "./v1/routesV1";

export const routes = express.Router();

routes.use("/v1", v1Routes);

/**
 * @swagger
 * /api/*:
 *   get:
 *     summary: Catch-all route for undefined endpoints
 *     description: Returns 404 error for any undefined API endpoint
 *     tags:
 *       - API Info
 *     responses:
 *       404:
 *         description: Page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "404 No page found"
 */
routes.get("*", (req, res) => {
  res.send({ error: "404 No page found" });
});

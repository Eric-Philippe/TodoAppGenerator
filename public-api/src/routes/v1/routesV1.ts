import * as express from "express";
export const v1Routes = express.Router();

/**
 * @swagger
 * /api/v1:
 *   get:
 *     summary: Get API version information
 *     description: Returns welcome message and version information for the v1 API
 *     tags:
 *       - API Info
 *     responses:
 *       200:
 *         description: Successfully retrieved API information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               message: "Welcome to the v1 API"
 *               version: "1.0.0"
 */
v1Routes.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the v1 API",
    version: "1.0.0",
  });
});

v1Routes.use("/ping", require("./ping/pingRouter").typesRouter);

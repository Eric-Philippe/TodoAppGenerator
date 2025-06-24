import * as express from "express";

import { v1Routes } from "./v1/routesV1";

export const routes = express.Router();

routes.use("/v1", v1Routes);

routes.get("*", (req, res) => {
  res.send({ error: "404 No page found" });
});

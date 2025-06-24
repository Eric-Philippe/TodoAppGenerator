import express from "express";
import { getPing } from "./getPing";

export const typesRouter = express.Router();

typesRouter.get("/", getPing);

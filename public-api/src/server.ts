import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

import { routes } from "./routes/routes";
import { AppDataSource } from "./data-source";

import * as dotenv from "dotenv";
import { DB_HOST, DB_PORT, PORT } from "./env";
import { Events } from "./Events";

dotenv.config();

const app: Express = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle POST requests that come in formatted as JSON
app.use(express.json({ limit: "50mb" }));
app.use("/api", routes);

const port = PORT || 3000;

console.log(`[INFO] 🚀  Starting server on port ${port}`);
console.log(
  `[INFO] 📡  Connecting to Postgres Database on ${DB_HOST}:${DB_PORT}`
);
app.listen(port, () => {
  AppDataSource.initialize().then(() => {
    app.emit(Events.APP_STARTED, port);
  });
});

const readyHandler = async () => {};

app.on(Events.APP_STARTED, () => {
  const date = new Date();
  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  console.log(
    `%c[INFO] %c${time} %c📠  Server listening on port ${port}`,
    "color: #0077FF;",
    "color: #66FF66;;",
    "color: green;"
  );
  console.log(
    `%c[INFO] %c${time} %c💾  Postgres Database Connected`,
    "color: #0077FF;",
    "color: #66FF66;;",
    "color: green;"
  );

  readyHandler();
});

export default app;

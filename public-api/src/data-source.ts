import "reflect-metadata";

import { DataSource } from "typeorm";
import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } from "./env";

/** ORM DataSource Main Access / Setup */
export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: [],
  migrations: [],
  subscribers: [],
});

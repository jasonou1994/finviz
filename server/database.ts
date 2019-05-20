import knex from "knex";
import { connection } from "./constants";

export const dbClient = knex({ client: "pg", connection });

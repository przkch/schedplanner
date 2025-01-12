import { PSQL_CONN } from "astro:env/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const client = postgres(PSQL_CONN || "");
export const db = drizzle(client);

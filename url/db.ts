import { SQLDatabase } from "encore.dev/storage/sqldb";

export const db = new SQLDatabase("url", { migrations: "./migrations" });

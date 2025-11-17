import { drizzle } from "drizzle-orm/d1";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema";

// For development with better-sqlite3
let dbInstance: DrizzleD1Database<typeof schema> | null = null;

export function getDb(d1Database?: D1Database) {
  if (d1Database) {
    // Production: Use Cloudflare D1
    return drizzle(d1Database, { schema });
  }

  // Development: Use better-sqlite3 (for local development)
  if (!dbInstance) {
    const Database = require("better-sqlite3");
    const sqlite = new Database("./local.db");
    const { drizzle: drizzleSqlite } = require("drizzle-orm/better-sqlite3");
    dbInstance = drizzleSqlite(sqlite, { schema }) as DrizzleD1Database<
      typeof schema
    >;
  }

  return dbInstance;
}

export type DbType = ReturnType<typeof getDb>;

// Helper to get DB from request context in route handlers
export function getDbFromRequest(request: Request): DbType {
  // Try to get D1 from Cloudflare Workers environment using OpenNext
  try {
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const { env } = getCloudflareContext();

    if (env?.DB) {
      // Production: Use Cloudflare D1
      return getDb(env.DB as D1Database);
    }
  } catch (error) {
    // Not in Cloudflare environment or getCloudflareContext not available
    console.log("Not in Cloudflare environment, using local DB");
  }

  // Development: Use local SQLite
  return getDb();
}

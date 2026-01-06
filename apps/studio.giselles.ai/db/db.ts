
import { sql } from "@vercel/postgres";
import { drizzle, type VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import * as schema from "./schema";

// We export a "lazy" db instance. 
let dbInstance: VercelPgDatabase<typeof schema> | null = null;

function getDb() {
    if (dbInstance) return dbInstance;
    
    const url = process.env.POSTGRES_URL;

    if (!url || url.trim() === "" || url === "undefined") {
        // Build time safe guard - return a proxy that throws on actual access.
        return new Proxy({} as VercelPgDatabase<typeof schema>, {
            get: (_target, prop) => {
                throw new Error(`POSTGRES_URL is missing or invalid. Cannot access database property: ${String(prop)}`);
            }
        });
    }

    dbInstance = drizzle(sql, { schema, logger: false });
    return dbInstance;
}

export const db = new Proxy({} as VercelPgDatabase<typeof schema>, {
    get: (_target, prop) => {
        const instance = getDb();
        // @ts-ignore
        const value = instance[prop];
        if (typeof value === "function") {
            // @ts-ignore
            return value.bind(instance);
        }
        return value;
    }
});

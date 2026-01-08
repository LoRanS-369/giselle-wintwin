
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// We export a "lazy" db instance.
let dbInstance: NodePgDatabase<typeof schema> | null = null;

function getDb() {
	if (dbInstance) return dbInstance;

	const connectionString = process.env.POSTGRES_URL;

	if (
		!connectionString ||
		connectionString.trim() === "" ||
		connectionString === "undefined"
	) {
		// Build time safe guard - return a proxy that throws on actual access.
		return new Proxy({} as NodePgDatabase<typeof schema>, {
			get: (_target, prop) => {
				throw new Error(
					`POSTGRES_URL is missing or invalid. Cannot access database property: ${String(prop)}`,
				);
			},
		});
	}

	const pool = new Pool({
		connectionString,
		ssl: { rejectUnauthorized: false }, // Force SSL for Neon
	});

	dbInstance = drizzle(pool, { schema, logger: false });
	return dbInstance;
}

export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
	get: (_target, prop) => {
		const instance = getDb();
		// @ts-ignore
		const value = instance[prop];
		if (typeof value === "function") {
			// @ts-ignore
			return value.bind(instance);
		}
		return value;
	},
});

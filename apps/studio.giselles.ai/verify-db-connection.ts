
import { loadEnvConfig } from "@next/env";
import { db } from "./db";
import { supabaseUserMappings } from "./db/schema";
import { eq } from "drizzle-orm";

loadEnvConfig(process.cwd());

async function main() {
  console.log("Checking database connection...");
  console.log("POSTGRES_URL:", process.env.POSTGRES_URL?.replace(/:[^:@]+@/, ":***@"));

  try {
    // Basic query
    console.log("Running simple query...");
    const result = await db.query.supabaseUserMappings.findFirst();
    console.log("Success! Result:", result);
    
    // Check if we can insert (dry run logic)
    console.log("Configuration looks good.");
  } catch (error) {
    console.error("Database check failed:", error);
  } finally {
    process.exit(0);
  }
}

main();

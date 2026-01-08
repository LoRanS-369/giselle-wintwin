
import { db, supabaseUserMappings } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const result: any[] = [];
  const append = (msg: string, data?: any) => {
    console.log(msg, data);
    result.push({ msg, data });
  };

  append("Checking Environment Variables...");
  const url = process.env.POSTGRES_URL;
  const nonPoolingUrl = process.env.POSTGRES_URL_NON_POOLING; // Check explicit non-pooling var
  
  append("POSTGRES_URL defined?", !!url);
  append("POSTGRES_URL_NON_POOLING defined?", !!nonPoolingUrl);

  if (url) {
    // mask password
    append("POSTGRES_URL host", url.split("@")[1]?.split("/")[0]);
  }

  append("Checking Supabase Environment Variables...");
  append("NEXT_PUBLIC_SUPABASE_URL defined?", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  append("NEXT_PUBLIC_SUPABASE_ANON_KEY defined?", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  append("NEXT_PUBLIC_SITE_URL defined?", !!process.env.NEXT_PUBLIC_SITE_URL);
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    append("NEXT_PUBLIC_SITE_URL value", process.env.NEXT_PUBLIC_SITE_URL);
  } else {
    append("POSTGRES_URL is missing!");
  }

  try {
    append("Test 1: Simple Select from users...");
    const userCount = await db.select({ count: users.dbId }).from(users).limit(1);
    append("Success Test 1", userCount);
  } catch (e: any) {
    append("Error Test 1", { message: e.message, stack: e.stack });
  }

  try {
    append("Test 2: Query Builder findFirst...");
    const mapping = await db.query.supabaseUserMappings.findFirst();
    append("Success Test 2", mapping);
  } catch (e: any) {
    append("Error Test 2", { message: e.message, stack: e.stack });
  }

  return NextResponse.json({
    status: "ok",
    results: result,
  });
}

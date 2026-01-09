import { NextResponse } from "next/server";

export async function GET() {
  const envStatus = {
    GITHUB_APP_ID: {
      exists: !!process.env.GITHUB_APP_ID,
      value: process.env.GITHUB_APP_ID ? "(hidden value)" : undefined,
      isNumber: process.env.GITHUB_APP_ID ? !isNaN(Number(process.env.GITHUB_APP_ID)) : false
    },
    GITHUB_APP_PRIVATE_KEY: {
      exists: !!process.env.GITHUB_APP_PRIVATE_KEY,
      length: process.env.GITHUB_APP_PRIVATE_KEY?.length || 0,
      startsWithBegin: process.env.GITHUB_APP_PRIVATE_KEY?.trim().startsWith("-----BEGIN RSA PRIVATE KEY"),
    },
    GITHUB_APP_CLIENT_ID: {
      exists: !!process.env.GITHUB_APP_CLIENT_ID,
      length: process.env.GITHUB_APP_CLIENT_ID?.length || 0
    },
    GITHUB_APP_CLIENT_SECRET: {
      exists: !!process.env.GITHUB_APP_CLIENT_SECRET,
      length: process.env.GITHUB_APP_CLIENT_SECRET?.length || 0
    },
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    VERCEL_ENV: process.env.VERCEL_ENV
  };

  return NextResponse.json(envStatus);
}

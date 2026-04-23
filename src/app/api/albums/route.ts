import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Connect Prisma in this route when DATABASE_URL is configured. The UI uses Zustand mock data for instant local preview."
  });
}

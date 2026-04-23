import { NextResponse } from "next/server";
import { exchangeWechatCode } from "@/lib/auth/providers";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code?: string };
    if (!body.code) {
      return NextResponse.json({ error: "Missing WeChat code." }, { status: 400 });
    }
    const user = await exchangeWechatCode(body.code);
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "WeChat login failed." }, { status: 500 });
  }
}

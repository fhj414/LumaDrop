import { NextResponse } from "next/server";
import { createWechatAuthUrl } from "@/lib/auth/providers";

export async function GET() {
  const authUrl = createWechatAuthUrl();
  if (!authUrl) {
    return NextResponse.json(
      {
        error: "WeChat Open Platform is not configured.",
        requiredEnv: ["WECHAT_OPEN_APP_ID", "WECHAT_REDIRECT_URI"]
      },
      { status: 501 }
    );
  }
  return NextResponse.json({ authUrl });
}

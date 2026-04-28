import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/auth/otp-store";

type VerifyOtpBody = {
  channel?: "phone" | "email";
  target?: string;
  email?: string;
  phone?: string;
  code?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as VerifyOtpBody;
  const channel = body.channel ?? (body.email ? "email" : body.phone ? "phone" : undefined);
  const target = (body.target ?? body.email ?? body.phone)?.trim();
  const code = body.code?.trim();

  if (!channel || !target || !code) {
    return NextResponse.json({ error: "Missing channel, target or code." }, { status: 400 });
  }

  const normalizedTarget = channel === "email" ? target.toLowerCase() : target;
  const ok = await verifyOtp(channel, normalizedTarget, code);
  if (!ok) {
    return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    user: {
      id: "u-authenticated",
      name: channel === "phone" ? `手机用户 ${normalizedTarget.slice(-4)}` : normalizedTarget.split("@")[0],
      email: channel === "email" ? normalizedTarget : undefined,
      phone: channel === "phone" ? normalizedTarget : undefined,
      provider: channel
    }
  });
}

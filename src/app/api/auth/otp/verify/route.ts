import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/auth/otp-store";

type VerifyOtpBody = {
  channel?: "phone" | "email";
  target?: string;
  code?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as VerifyOtpBody;
  if (!body.channel || !body.target || !body.code) {
    return NextResponse.json({ error: "Missing channel, target or code." }, { status: 400 });
  }

  const ok = await verifyOtp(body.channel, body.target, body.code);
  if (!ok) {
    return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    user: {
      id: "u-authenticated",
      name: body.channel === "phone" ? `手机用户 ${body.target.slice(-4)}` : body.target.split("@")[0],
      email: body.channel === "email" ? body.target : undefined,
      phone: body.channel === "phone" ? body.target : undefined,
      provider: body.channel
    }
  });
}

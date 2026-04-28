import { NextResponse } from "next/server";
import { createOtp } from "@/lib/auth/otp-store";
import { sendEmailCode, sendSmsCode } from "@/lib/auth/providers";

type SendOtpBody = {
  channel?: "phone" | "email";
  target?: string;
  email?: string;
  phone?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SendOtpBody;
    const channel = body.channel ?? (body.email ? "email" : body.phone ? "phone" : undefined);
    const target = (body.target ?? body.email ?? body.phone)?.trim();

    if (!channel || !target) {
      return NextResponse.json({ error: "Missing channel or target." }, { status: 400 });
    }

    if (channel === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const normalizedTarget = channel === "email" ? target.toLowerCase() : target;
    const code = await createOtp(channel, normalizedTarget);
    const result =
      channel === "phone"
        ? await sendSmsCode(normalizedTarget, code)
        : await sendEmailCode(normalizedTarget, code);

    return NextResponse.json({
      ok: true,
      sent: result.sent,
      devCode: "devCode" in result ? result.devCode : undefined
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to send code." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createOtp } from "@/lib/auth/otp-store";
import { sendEmailCode, sendSmsCode } from "@/lib/auth/providers";

type SendOtpBody = {
  channel?: "phone" | "email";
  target?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SendOtpBody;
    if (!body.channel || !body.target) {
      return NextResponse.json({ error: "Missing channel or target." }, { status: 400 });
    }

    const code = await createOtp(body.channel, body.target);
    const result =
      body.channel === "phone"
        ? await sendSmsCode(body.target, code)
        : await sendEmailCode(body.target, code);

    return NextResponse.json({
      ok: true,
      sent: result.sent,
      devCode: "devCode" in result ? result.devCode : undefined
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to send code." }, { status: 500 });
  }
}

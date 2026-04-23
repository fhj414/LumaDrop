import { NextResponse } from "next/server";
import { createOtp } from "@/lib/auth/otp-store";
import { sendEmailCode } from "@/lib/auth/providers";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as
      | { email?: string }
      | { channel?: "phone" | "email"; target?: string };

    const email = "email" in body ? body.email : body.channel === "email" ? body.target : undefined;
    if (!email) {
      return NextResponse.json({ error: "Missing email." }, { status: 400 });
    }
    const code = await createOtp("email", email);
    const result = await sendEmailCode(email, code);
    return NextResponse.json({
      ok: true,
      sent: result.sent
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to send code." }, { status: 500 });
  }
}

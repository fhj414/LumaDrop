import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/auth/otp-store";

export async function POST(request: Request) {
  const body = (await request.json()) as
    | { email?: string; code?: string }
    | { channel?: "phone" | "email"; target?: string; code?: string };

  const email = "email" in body ? body.email : body.channel === "email" ? body.target : undefined;
  const code = body.code;

  if (!email || !code) {
    return NextResponse.json({ error: "Missing email or code." }, { status: 400 });
  }
  const ok = await verifyOtp("email", email, code);
  if (!ok) {
    return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    user: {
      id: "u-authenticated",
      name: email.split("@")[0] || "Luma Creator",
      email,
      provider: "email"
    }
  });
}

import crypto from "crypto";
import { prisma } from "@/lib/prisma";

type OtpRecord = {
  target: string;
  channel: "phone" | "email";
  codeHash: string;
  expiresAt: number;
};

const globalForOtp = globalThis as unknown as { lumaOtpStore?: Map<string, OtpRecord> };

const otpStore = globalForOtp.lumaOtpStore ?? new Map<string, OtpRecord>();

if (process.env.NODE_ENV !== "production") {
  globalForOtp.lumaOtpStore = otpStore;
}

function hashCode(code: string) {
  return crypto.createHash("sha256").update(`${code}:${process.env.AUTH_SECRET ?? "lumadrop-dev"}`).digest("hex");
}

export async function createOtp(channel: "phone" | "email", target: string) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const key = `${channel}:${target}`;
  const expiresAt = Date.now() + 5 * 60 * 1000;

  if (process.env.DATABASE_URL) {
    await prisma.verificationCode.deleteMany({ where: { channel, target } });
    await prisma.verificationCode.create({
      data: {
        channel,
        target,
        codeHash: hashCode(code),
        expiresAt: new Date(expiresAt)
      }
    });
  } else {
    otpStore.set(key, {
      target,
      channel,
      codeHash: hashCode(code),
      expiresAt
    });
  }
  return code;
}

export async function verifyOtp(channel: "phone" | "email", target: string, code: string) {
  if (process.env.DATABASE_URL) {
    const record = await prisma.verificationCode.findFirst({
      where: { channel, target },
      orderBy: { createdAt: "desc" }
    });
    if (!record) return false;
    if (Date.now() > record.expiresAt.getTime()) {
      await prisma.verificationCode.delete({ where: { id: record.id } });
      return false;
    }
    const ok = record.codeHash === hashCode(code);
    if (ok) await prisma.verificationCode.delete({ where: { id: record.id } });
    return ok;
  }

  const key = `${channel}:${target}`;
  const record = otpStore.get(key);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return false;
  }
  const ok = record.codeHash === hashCode(code);
  if (ok) otpStore.delete(key);
  return ok;
}

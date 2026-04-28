"use client";

import { useRouter } from "next/navigation";
import { Camera, Loader2, LogOut, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLumaStore } from "@/store/luma-store";

export default function LoginPage() {
  const router = useRouter();
  const loginWithUser = useLumaStore((state) => state.loginWithUser);
  const user = useLumaStore((state) => state.user);
  const logout = useLumaStore((state) => state.logout);
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const normalizedEmail = email.trim().toLowerCase();
  const canSendEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  if (user) {
    return (
      <div className="mx-auto flex min-h-[72dvh] max-w-md items-center">
        <Card className="w-full overflow-hidden">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
                <UserRound className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold">已登录</h1>
                <p className="truncate text-sm text-muted-foreground">{user.email ?? user.phone ?? user.name}</p>
              </div>
            </div>
            <Button className="w-full" onClick={() => router.push("/account")}>
              进入个人中心
            </Button>
            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={() => {
                logout();
                setMessage("已退出登录。");
              }}
            >
              <LogOut className="h-4 w-4" />
              退出登录
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function sendOtp(targetEmail: string) {
    const target = targetEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
      setMessage("请输入有效的邮箱地址。");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: "email", target })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "验证码发送失败");
      setEmailSent(true);
      setMessage(`验证码已发送到 ${target}，5 分钟内有效。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "验证码发送失败");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(targetEmail: string, code: string) {
    const target = targetEmail.trim().toLowerCase();
    const cleanCode = code.trim();
    if (!target || !cleanCode) {
      setMessage("请输入邮箱和验证码。");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: "email", target, code: cleanCode })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "验证码校验失败");
      loginWithUser(payload.user);
      router.push("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "验证码校验失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[72dvh] max-w-md items-center">
      <Card className="w-full overflow-hidden">
        <CardContent className="p-6">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background">
              <Camera className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold">欢迎回到 LumaDrop</h1>
              <p className="text-sm text-muted-foreground">使用邮箱验证码快速登录。</p>
            </div>
          </div>

          <div className="space-y-3">
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            <div className="flex gap-2">
              <Input
                inputMode="numeric"
                maxLength={6}
                value={emailCode}
                onChange={(event) => setEmailCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="邮箱验证码"
              />
              <Button variant="outline" onClick={() => sendOtp(email)} disabled={loading || !canSendEmail}>
                {emailSent ? "重发" : "获取"}
              </Button>
            </div>
            <Button className="w-full" onClick={() => verifyOtp(email, emailCode)} disabled={loading || !normalizedEmail || emailCode.length !== 6}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              邮箱登录
            </Button>
          </div>
          {message && <p className="mt-4 rounded-2xl bg-muted px-3 py-2 text-xs text-muted-foreground">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

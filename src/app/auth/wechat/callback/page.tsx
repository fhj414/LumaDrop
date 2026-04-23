"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, MessageCircle } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLumaStore } from "@/store/luma-store";

export default function WechatCallbackPage() {
  return (
    <Suspense fallback={<CallbackShell message="正在准备微信登录..." />}>
      <WechatCallbackContent />
    </Suspense>
  );
}

function WechatCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginWithUser = useLumaStore((state) => state.loginWithUser);
  const [message, setMessage] = useState("正在完成微信登录...");

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setMessage("微信回调缺少 code。");
      return;
    }
    async function finishLogin() {
      const response = await fetch("/api/auth/wechat/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.error ?? "微信登录失败");
        return;
      }
      loginWithUser(payload.user);
      router.replace("/");
    }
    finishLogin();
  }, [loginWithUser, router, searchParams]);

  return <CallbackShell message={message} onBack={() => router.push("/login")} />;
}

function CallbackShell({ message, onBack }: { message: string; onBack?: () => void }) {
  return (
    <div className="mx-auto flex min-h-[72dvh] max-w-md items-center">
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background">
            <MessageCircle className="h-7 w-7" />
          </div>
          <p className="mt-5 font-medium">{message}</p>
          <Loader2 className="mx-auto mt-4 h-5 w-5 animate-spin text-muted-foreground" />
          <Button className="mt-6 w-full" variant="outline" onClick={onBack}>
            返回登录
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

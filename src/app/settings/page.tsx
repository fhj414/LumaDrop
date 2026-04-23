"use client";

import { useTheme } from "next-themes";
import { Database, LogOut, Moon, RefreshCcw, Server, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLumaStore } from "@/store/luma-store";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout, resetDemoData } = useLumaStore();
  const dark = theme === "dark";

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-muted-foreground">Settings</p>
        <h1 className="text-3xl font-semibold tracking-normal">设置</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>账户</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-muted/60 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background">
              <User className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{user?.name ?? "Guest"}</p>
              <p className="truncate text-sm text-muted-foreground">{user?.email ?? "未登录"}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>体验偏好</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-muted/60 p-4">
            <span className="flex items-center gap-2 text-sm">
              {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              深色主题
            </span>
            <Switch checked={dark} onCheckedChange={(value) => setTheme(value ? "dark" : "light")} />
          </div>
          <Info icon={<Server />} title="对象存储" text="默认 local，本地上传到 public/uploads；生产环境可切到 S3 / Cloudflare R2。" />
          <Info icon={<Database />} title="数据库" text="Prisma + PostgreSQL schema 已生成，支持迁移和 seed 初始化。" />
          <div className="flex items-center justify-between gap-3 rounded-2xl border bg-background p-4">
            <div className="flex gap-3">
              <span className="mt-1 text-primary">
                <RefreshCcw className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">恢复演示数据</p>
                <p className="text-sm leading-6 text-muted-foreground">清掉浏览器里残留的上传、删除和分享状态，回到初始样例。</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={resetDemoData}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border bg-background p-4">
      <span className="mt-1 text-primary [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

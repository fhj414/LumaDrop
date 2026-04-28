"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Camera, Grid2X2, Home, Images, LogIn, Settings, Trash2, Upload, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLumaStore } from "@/store/luma-store";

const nav = [
  { href: "/", label: "首页", icon: Home },
  { href: "/photos", label: "照片", icon: Grid2X2 },
  { href: "/upload", label: "上传", icon: Upload },
  { href: "/albums", label: "相册", icon: Images },
  { href: "/trash", label: "回收站", icon: Trash2 },
  { href: "/settings", label: "设置", icon: Settings }
];

const desktopNav = [
  { href: "/photos", label: "照片筛选" },
  { href: "/albums", label: "相册" },
  { href: "/trash", label: "回收站" },
  { href: "/settings", label: "设置" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasPurgedTrash = useRef(false);
  const isImmersive = pathname.startsWith("/preview");
  const user = useLumaStore((state) => state.user);

  useEffect(() => {
    if (hasPurgedTrash.current) return;
    hasPurgedTrash.current = true;
    useLumaStore.getState().purgeExpiredTrash();
  }, []);

  if (isImmersive) return <>{children}</>;

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.14),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(245,158,11,0.12),transparent_28%)]">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background shadow-soft">
              <Camera className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-base font-semibold leading-5">LumaDrop</span>
              <span className="block text-xs text-muted-foreground">Private photo rooms</span>
            </span>
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            {desktopNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-medium transition",
                    active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={user ? "/account" : "/login"}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition",
                pathname.startsWith(user ? "/account" : "/login")
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {user ? user.name : "登录"}
            </Link>
            <Link
              href="/upload"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow"
            >
              上传照片
            </Link>
          </div>
          <Link
            href={user ? "/account" : "/login"}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-foreground sm:hidden"
            aria-label={user ? "个人中心" : "登录"}
          >
            {user ? <UserRound className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
          </Link>
        </div>
      </header>
      <main className="mx-auto min-h-[calc(100dvh-4rem)] max-w-5xl px-4 pb-28 pt-5 sm:pb-8">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/82 px-3 pb-[max(0.7rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-2xl sm:hidden">
        <div className="mx-auto grid max-w-md grid-cols-6 gap-1">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                href={item.href}
                key={item.href}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] transition",
                  active ? "bg-foreground text-background" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, Heart, Images, LogOut, Mail, Phone, Trash2, Upload, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatBytes } from "@/lib/utils";
import { useLumaStore } from "@/store/luma-store";

export default function AccountPage() {
  const router = useRouter();
  const { user, photos, albums, logout } = useLumaStore();

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[68dvh] max-w-md items-center">
        <Card className="w-full">
          <CardContent className="p-6 text-center">
            <UserRound className="mx-auto h-10 w-10 text-muted-foreground" />
            <h1 className="mt-4 text-2xl font-semibold">登录后查看个人中心</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">你的上传记录、相册和收藏会归到当前账号下。</p>
            <Button asChild className="mt-5 w-full">
              <Link href="/login">去登录</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const myPhotos = photos.filter((photo) => photo.userId === user.id);
  const activePhotos = myPhotos.filter((photo) => !photo.deletedAt);
  const myAlbums = albums.filter((album) => album.userId === user.id);
  const recent = activePhotos.slice(0, 4);
  const totalSize = activePhotos.reduce((sum, photo) => sum + photo.size, 0);
  const identity = user.email ?? user.phone ?? "微信账号";

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border bg-card p-5 shadow-soft">
        <div className="flex items-start gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-foreground text-background">
            <UserRound className="h-8 w-8" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Account</p>
            <h1 className="truncate text-3xl font-semibold tracking-normal">{user.name}</h1>
            <p className="mt-1 flex items-center gap-2 truncate text-sm text-muted-foreground">
              {user.provider === "phone" ? <Phone className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
              {identity}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label="退出登录"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <AccountStat icon={<Camera />} label="照片" value={`${activePhotos.length}`} />
          <AccountStat icon={<Images />} label="相册" value={`${myAlbums.length}`} />
          <AccountStat icon={<Heart />} label="收藏" value={`${activePhotos.filter((photo) => photo.favorite).length}`} />
          <AccountStat icon={<Trash2 />} label="回收站" value={`${myPhotos.filter((photo) => photo.deletedAt).length}`} />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">最近上传</p>
                <h2 className="text-2xl font-semibold">你的照片库</h2>
              </div>
              <Button asChild size="sm">
                <Link href="/upload">
                  <Upload className="h-4 w-4" />
                  上传
                </Link>
              </Button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {recent.map((photo) => (
                <Link href={`/preview/${photo.id}`} key={photo.id} className="overflow-hidden rounded-2xl bg-muted shadow-soft">
                  <div className="relative aspect-square">
                    <Image src={photo.url} alt={photo.title} fill sizes="160px" className="object-cover" />
                  </div>
                  <p className="truncate px-3 py-2 text-xs font-medium">{photo.title}</p>
                </Link>
              ))}
            </div>
            {recent.length === 0 && (
              <div className="mt-5 rounded-3xl border border-dashed bg-background p-8 text-center">
                <p className="font-medium">还没有上传记录</p>
                <p className="mt-1 text-sm text-muted-foreground">上传几张照片，它们会出现在当前账号下。</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Info title="账号空间" value={formatBytes(totalSize)} />
          <Info title="登录方式" value={user.provider === "email" ? "邮箱验证码" : user.provider === "phone" ? "手机号验证码" : "微信扫码"} />
          <Button asChild variant="outline" className="w-full">
            <Link href="/photos">管理我的照片</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/albums">管理我的相册</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function AccountStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/60 p-4">
      <div className="mb-3 text-primary [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-soft">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

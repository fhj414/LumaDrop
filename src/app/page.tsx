"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Camera, Download, Filter, Heart, Images, Lock, LogIn, Share2, Sparkles, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLumaStore } from "@/store/luma-store";
import { formatBytes } from "@/lib/utils";

export default function HomePage() {
  const { photos, albums } = useLumaStore();
  const activePhotos = photos.filter((photo) => !photo.deletedAt);
  const recent = activePhotos.slice(0, 4);
  const totalSize = activePhotos.reduce((sum, photo) => sum + photo.size, 0);

  return (
    <div className="space-y-7">
      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border bg-card p-5 shadow-soft sm:p-8">
          <div className="flex items-center gap-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            Mobile-first photo delivery
          </div>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-normal sm:text-6xl">
            LumaDrop 让每一次交付都像一本高级相册。
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
            上传、预览、下载与私密分享在同一条顺滑路径里完成。适合摄影作品、客户交付、旅行相册和小范围私享页面。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/upload">
                <Upload className="h-4 w-4" />
                上传照片
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/share/SOFTDAY">
                预览分享页
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/photos">
                <Filter className="h-4 w-4" />
                照片筛选
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                邮箱登录
              </Link>
            </Button>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
          {recent.map((photo, index) => (
            <Link
              href={`/preview/${photo.id}`}
              key={photo.id}
              className="relative overflow-hidden rounded-[1.6rem] bg-muted shadow-soft"
              style={{ marginTop: index % 2 ? 28 : 0 }}
            >
              <div className="relative aspect-[3/4]">
                <Image src={photo.url} alt={photo.title} fill sizes="50vw" className="object-cover" priority={index < 2} />
              </div>
            </Link>
          ))}
        </motion.div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={<Camera />} label="照片" value={`${activePhotos.length}`} />
        <Stat icon={<Images />} label="相册" value={`${albums.length}`} />
        <Stat icon={<Heart />} label="收藏" value={`${activePhotos.filter((photo) => photo.favorite).length}`} />
        <Stat icon={<Download />} label="容量" value={formatBytes(totalSize)} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">最近上传</p>
                <h2 className="text-2xl font-semibold">Fresh drops</h2>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/photos">查看全部</Link>
              </Button>
            </div>
            <div className="mt-5 space-y-3">
              {recent.map((photo) => (
                <Link href={`/preview/${photo.id}`} key={photo.id} className="flex items-center gap-3 rounded-2xl bg-muted/60 p-2">
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl">
                    <Image src={photo.url} alt={photo.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{photo.title}</p>
                    <p className="text-xs text-muted-foreground">{photo.width} x {photo.height}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-3 sm:grid-cols-2">
          <Quick href="/upload" icon={<Upload />} title="上传成册" text="多图进度、自动相册、AI 描述接口预留" />
          <Quick href="/photos" icon={<Filter />} title="照片筛选" text="按时间、收藏、人物、动物、植物等分类浏览" />
          <Quick href="/albums" icon={<Share2 />} title="私密分享" text="公开/密码/下载权限一处配置" />
          <Quick href="/trash" icon={<Trash2 />} title="回收站" text="删除后保留 7 天，支持恢复、永久删除和清空" />
          <Quick href="/settings" icon={<Lock />} title="品牌设置" text="浅色深色、存储驱动和隐私偏好" />
          <Quick href="/login" icon={<LogIn />} title="登录方式" text="邮箱验证码登录（需配置 Resend）" />
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-primary [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function Quick({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Link href={href} className="rounded-3xl border bg-card p-5 shadow-soft transition hover:-translate-y-1">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
      <h3 className="mt-5 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </Link>
  );
}

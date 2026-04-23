"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { Download, Lock, Palette, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLumaStore } from "@/store/luma-store";

export default function SharePage() {
  const params = useParams<{ token: string }>();
  const { shares, albums, photos, downloadPhotos } = useLumaStore();
  const share = shares.find((item) => item.token.toLowerCase() === params.token.toLowerCase()) ?? shares[0];
  const album = albums.find((item) => item.id === share?.albumId);
  const sharedPhotos = useMemo(() => photos.filter((photo) => photo.albumId === album?.id && !photo.deletedAt), [photos, album?.id]);
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(!share?.password);
  const [theme, setTheme] = useState(share?.theme ?? "editorial");

  if (!share || !album) return <div className="rounded-3xl border bg-card p-8">分享页不存在</div>;

  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-[74dvh] max-w-md items-center">
        <div className="w-full rounded-[2rem] border bg-card p-6 shadow-soft">
          <Lock className="h-9 w-9 text-primary" />
          <h1 className="mt-5 text-3xl font-semibold">这是一个私密分享页</h1>
          <p className="mt-2 text-sm text-muted-foreground">输入访问密码后即可浏览照片。</p>
          <div className="mt-5 space-y-3">
            <Input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="访问密码" type="password" />
            <Button className="w-full" onClick={() => setUnlocked(password === share.password)}>
              解锁
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", theme === "noir" && "rounded-[2rem] bg-zinc-950 p-4 text-white", theme === "minimal" && "bg-background")}>
      <section className="relative overflow-hidden rounded-[2rem] bg-card shadow-soft">
        <div className="relative aspect-[4/5] sm:aspect-[16/7]">
          {sharedPhotos[0] && <Image src={sharedPhotos[0].url} alt={album.title} fill priority className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-xs backdrop-blur-md">
              <Sparkles className="h-3 w-3" />
              LumaDrop share
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-normal sm:text-6xl">{share.title}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/72">{album.description}</p>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <div className="flex rounded-2xl bg-muted p-1">
          {(["editorial", "minimal", "noir"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTheme(item)}
              className={cn("rounded-xl px-3 py-2 text-xs", theme === item && "bg-background shadow-sm dark:text-foreground")}
            >
              {item}
            </button>
          ))}
        </div>
        {share.allowDownload && (
          <Button onClick={() => downloadPhotos(sharedPhotos.map((photo) => photo.id), album.title)}>
            <Download className="h-4 w-4" />
            ZIP
          </Button>
        )}
      </div>

      <div className="columns-2 gap-3 sm:columns-3">
        {sharedPhotos.map((photo) => (
          <div key={photo.id} className="mb-3 break-inside-avoid overflow-hidden rounded-3xl bg-muted shadow-soft">
            <div className="relative aspect-[3/4]">
              <Image src={photo.url} alt={photo.title} fill sizes="50vw" className="object-cover" />
            </div>
            <div className="flex items-center justify-between p-3 text-sm">
              <span className="truncate font-medium">{photo.title}</span>
              <Palette className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

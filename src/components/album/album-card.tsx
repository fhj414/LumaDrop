"use client";

import Image from "next/image";
import Link from "next/link";
import { Lock, Share2 } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useLumaStore } from "@/store/luma-store";
import type { Album } from "@/types/lumadrop";

export function AlbumCard({ album }: { album: Album }) {
  const allPhotos = useLumaStore((state) => state.photos);
  const user = useLumaStore((state) => state.user);
  const photos = useMemo(
    () => allPhotos.filter((photo) => photo.albumId === album.id && !photo.deletedAt && (!user || photo.userId === user.id)),
    [allPhotos, album.id, user]
  );
  const cover = photos.find((photo) => photo.id === album.coverPhotoId) ?? photos[0];

  return (
    <Link href={`/albums/${album.id}`} className="group block overflow-hidden rounded-3xl border bg-card shadow-soft">
      <div className="relative aspect-[4/3] bg-muted">
        {cover && <Image src={cover.url} alt={album.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="mb-2 flex gap-2">
            {album.isPrivate && <Badge className="border-white/30 bg-black/20 text-white"><Lock className="mr-1 h-3 w-3" />私密</Badge>}
            <Badge className="border-white/30 bg-black/20 text-white"><Share2 className="mr-1 h-3 w-3" />{album.theme}</Badge>
          </div>
          <h3 className="text-xl font-semibold">{album.title}</h3>
          <p className="line-clamp-2 text-sm text-white/74">{album.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 text-sm">
        <span className="text-muted-foreground">{photos.length} 张照片</span>
        <span className="font-medium text-primary">打开相册</span>
      </div>
    </Link>
  );
}

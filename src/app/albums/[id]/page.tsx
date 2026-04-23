"use client";

import { useParams } from "next/navigation";
import { PhotoGrid } from "@/components/photo/photo-grid";
import { SharePanel } from "@/components/share/share-panel";
import { Badge } from "@/components/ui/badge";
import { useLumaStore } from "@/store/luma-store";

export default function AlbumDetailPage() {
  const params = useParams<{ id: string }>();
  const { albums, photos } = useLumaStore();
  const album = albums.find((item) => item.id === params.id);
  const albumPhotos = photos.filter((photo) => photo.albumId === params.id);

  if (!album) return <div className="rounded-3xl border bg-card p-8">相册不存在</div>;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border bg-card p-5 shadow-soft">
        <div className="flex flex-wrap gap-2">
          <Badge>{album.theme}</Badge>
          <Badge>{album.isPrivate ? "私密相册" : "公开相册"}</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal">{album.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{album.description}</p>
      </section>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <PhotoGrid photos={albumPhotos} />
        <SharePanel album={album} />
      </div>
    </div>
  );
}

"use client";

import { AlbumCard } from "@/components/album/album-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLumaStore } from "@/store/luma-store";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

export default function AlbumsPage() {
  const { albums, createAlbum, user } = useLumaStore();
  const myAlbums = useMemo(() => albums.filter((album) => !user || album.userId === user.id), [albums, user]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Albums</p>
          <h1 className="text-3xl font-semibold tracking-normal">我的相册</h1>
        </div>
        <Button onClick={() => setOpen(!open)} size="icon" aria-label="创建相册">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {open && (
        <div className="grid gap-3 rounded-3xl border bg-card p-4 shadow-soft">
          <Input placeholder="相册标题" value={title} onChange={(event) => setTitle(event.target.value)} />
          <Textarea placeholder="描述这组照片的氛围、用途或交付说明" value={description} onChange={(event) => setDescription(event.target.value)} />
          <Button
            onClick={() => {
              createAlbum({ title: title || "Untitled Album", description, theme: "editorial", isPrivate: true });
              setTitle("");
              setDescription("");
              setOpen(false);
            }}
          >
            创建相册
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>

      {myAlbums.length === 0 && (
        <div className="rounded-3xl border border-dashed bg-card p-8 text-center">
          <p className="font-medium">还没有相册</p>
          <p className="mt-1 text-sm text-muted-foreground">上传照片后，LumaDrop 会自动为当前账号生成相册。</p>
        </div>
      )}
    </div>
  );
}

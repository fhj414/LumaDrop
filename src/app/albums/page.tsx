"use client";

import { AlbumCard } from "@/components/album/album-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLumaStore } from "@/store/luma-store";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AlbumsPage() {
  const { albums, createAlbum } = useLumaStore();
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
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}

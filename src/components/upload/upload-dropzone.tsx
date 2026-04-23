"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ImagePlus, Sparkles, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/upload/upload-progress";
import { useLumaStore } from "@/store/luma-store";
import type { Photo } from "@/types/lumadrop";

export function UploadDropzone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const addPhotos = useLumaStore((state) => state.addPhotos);
  const createAlbum = useLumaStore((state) => state.createAlbum);
  const [previews, setPreviews] = useState<{ file: File; url: string; progress: number }[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const next = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({ file, url: URL.createObjectURL(file), progress: 0 }));
    setPreviews(next);
    setUploading(true);

    for (let tick = 0; tick <= 100; tick += 10) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      setPreviews((items) => items.map((item, index) => ({ ...item, progress: Math.min(100, tick + index * 4) })));
    }

    const formData = new FormData();
    next.forEach((item) => formData.append("files", item.file));
    const response = await fetch("/api/photos", { method: "POST", body: formData });
    const payload = (await response.json()) as { photos: Photo[] };
    addPhotos(payload.photos);

    let albumDescription =
      "LumaDrop 自动根据刚上传的照片生成了这个相册，你可以继续调整封面与分享权限。";
    try {
      const aiResponse = await fetch("/api/ai/album/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoTitles: payload.photos.map((photo) => photo.title) })
      });
      const aiPayload = (await aiResponse.json()) as { description?: string; error?: string };
      if (aiResponse.ok && aiPayload.description) {
        albumDescription = aiPayload.description;
      }
    } catch {
      // Keep fallback copy.
    }

    const album = createAlbum(
      {
        title: "Fresh Drop",
        description: albumDescription,
        theme: "editorial",
        isPrivate: true
      },
      payload.photos.map((photo) => photo.id)
    );
    setUploading(false);
    router.push(`/albums/${album.id}`);
  }

  return (
    <div className="space-y-5">
      <Card
        className="overflow-hidden border-dashed"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
      >
        <CardContent className="p-4">
          <button
            onClick={() => inputRef.current?.click()}
            className="flex min-h-[280px] w-full flex-col items-center justify-center rounded-2xl bg-[linear-gradient(140deg,rgba(20,184,166,0.12),rgba(251,191,36,0.12),rgba(14,165,233,0.10))] p-6 text-center"
          >
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex h-16 w-16 items-center justify-center rounded-3xl bg-foreground text-background shadow-soft"
            >
              <UploadCloud className="h-8 w-8" />
            </motion.span>
            <h1 className="mt-5 text-3xl font-semibold tracking-normal">把照片轻放进来</h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              支持多图上传、自动生成相册和移动端沉浸预览。本地开发会存入 `public/uploads`。
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 text-sm font-medium shadow-sm">
              <ImagePlus className="h-4 w-4" />
              选择照片
            </span>
          </button>
          <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
        </CardContent>
      </Card>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previews.map((item) => (
            <div key={item.url} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
              <div className="relative aspect-square">
                <Image src={item.url} alt={item.file.name} fill className="object-cover" />
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-xs font-medium">{item.file.name}</p>
                <ProgressBar value={item.progress} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {["AI 封面推荐接口预留", "EXIF 扫描结构预留", "S3 / R2 存储可替换"].map((text) => (
          <div key={text} className="flex items-center gap-3 rounded-2xl border bg-card p-4 text-sm">
            <Sparkles className="h-5 w-5 text-primary" />
            {text}
          </div>
        ))}
      </div>

      {uploading && <Button className="w-full" disabled>正在生成高颜值相册...</Button>}
    </div>
  );
}

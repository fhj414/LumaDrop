"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Heart, Info, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes, formatDate } from "@/lib/utils";
import { useLumaStore } from "@/store/luma-store";

export function PreviewClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { photos, user, toggleFavorite, downloadPhotos } = useLumaStore();
  const visiblePhotos = photos.filter((photo) => !photo.deletedAt && (!user || photo.userId === user.id));
  const activeIndex = visiblePhotos.findIndex((photo) => photo.id === params.id);
  const photo = visiblePhotos[activeIndex] ?? visiblePhotos[0];
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 220], [1, 0.35]);
  const scale = useTransform(y, [0, 220], [1, 0.92]);

  if (!photo) return null;
  const displayIndex = Math.max(activeIndex, 0);
  const previous = visiblePhotos[(displayIndex - 1 + visiblePhotos.length) % visiblePhotos.length];
  const next = visiblePhotos[(displayIndex + 1) % visiblePhotos.length];

  return (
    <div className="fixed inset-0 z-50 bg-black text-white">
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.back()}>
          <X className="h-5 w-5" />
        </Button>
        <span className="text-sm text-white/72">
          {displayIndex + 1} / {visiblePhotos.length}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={() => toggleFavorite(photo.id)}
        >
          <Heart className={photo.favorite ? "h-5 w-5 fill-white" : "h-5 w-5"} />
        </Button>
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 260 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 160) router.back();
        }}
        onDoubleClick={(event) => {
          const target = event.currentTarget;
          target.style.transform = target.style.transform.includes("scale(1.8)") ? "scale(1)" : "scale(1.8)";
        }}
        className="flex h-full touch-pan-y items-center justify-center transition-transform duration-300"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="relative h-full w-full"
          >
            <Image src={photo.url} alt={photo.title} fill priority sizes="100vw" className="object-contain" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <Link
        href={`/preview/${previous.id}`}
        className="absolute left-2 top-1/2 z-20 rounded-full bg-white/10 p-2 backdrop-blur-md"
        aria-label="上一张"
      >
        <ChevronLeft className="h-6 w-6" />
      </Link>
      <Link
        href={`/preview/${next.id}`}
        className="absolute right-2 top-1/2 z-20 rounded-full bg-white/10 p-2 backdrop-blur-md"
        aria-label="下一张"
      >
        <ChevronRight className="h-6 w-6" />
      </Link>

      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/82 to-transparent p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-2xl space-y-4">
          <div>
            <h1 className="text-xl font-semibold">{photo.title}</h1>
            <p className="text-sm text-white/64">
              {photo.width} x {photo.height} · {formatBytes(photo.size)} · {formatDate(photo.uploadedAt)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary" onClick={() => downloadPhotos([photo.id])}>
              <Download className="h-4 w-4" />
              下载
            </Button>
            <Button variant="secondary" onClick={() => navigator.share?.({ title: photo.title, url: location.href })}>
              <Share2 className="h-4 w-4" />
              分享
            </Button>
            <Button variant="secondary">
              <Info className="h-4 w-4" />
              EXIF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

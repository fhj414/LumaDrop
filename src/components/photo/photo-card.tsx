"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Heart } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { useLumaStore } from "@/store/luma-store";
import type { Photo } from "@/types/lumadrop";

export function PhotoCard({ photo, compact = false }: { photo: Photo; compact?: boolean }) {
  const { selectedIds, selectionMode, toggleSelection, setSelectionMode, toggleFavorite } = useLumaStore();
  const selected = selectedIds.includes(photo.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-2xl bg-muted shadow-soft"
      onContextMenu={(event) => {
        event.preventDefault();
        setSelectionMode(true);
        toggleSelection(photo.id);
      }}
      onTouchStart={(event) => {
        const timer = window.setTimeout(() => {
          setSelectionMode(true);
          toggleSelection(photo.id);
        }, 420);
        const cancel = () => window.clearTimeout(timer);
        event.currentTarget.addEventListener("touchend", cancel, { once: true });
        event.currentTarget.addEventListener("touchmove", cancel, { once: true });
      }}
    >
      {selectionMode ? (
        <button className="block w-full text-left" onClick={() => toggleSelection(photo.id)}>
          <CardImage photo={photo} compact={compact} />
        </button>
      ) : (
        <Link href={`/preview/${photo.id}`} className="block">
          <CardImage photo={photo} compact={compact} />
        </Link>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 text-white">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{photo.title}</p>
            <p className="text-xs text-white/72">{formatBytes(photo.size)}</p>
          </div>
          <button
            className="pointer-events-auto rounded-full bg-white/16 p-2 backdrop-blur-md"
            onClick={(event) => {
              event.preventDefault();
              toggleFavorite(photo.id);
            }}
            aria-label="收藏照片"
          >
            <Heart className={cn("h-4 w-4", photo.favorite && "fill-white")} />
          </button>
        </div>
      </div>
      {selectionMode && (
        <span
          className={cn(
            "absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border backdrop-blur-xl",
            selected ? "border-primary bg-primary text-primary-foreground" : "border-white/70 bg-black/20 text-white"
          )}
        >
          {selected && <Check className="h-4 w-4" />}
        </span>
      )}
    </motion.div>
  );
}

function CardImage({ photo, compact }: { photo: Photo; compact: boolean }) {
  return (
    <div className={cn("relative w-full", compact ? "aspect-square" : photo.height > photo.width ? "aspect-[3/4]" : "aspect-[4/3]")}>
      <Image
        src={photo.url}
        alt={photo.title}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
    </div>
  );
}

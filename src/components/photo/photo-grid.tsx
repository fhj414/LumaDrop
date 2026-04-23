"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Archive, Download, Grid2X2, LayoutGrid, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoCard } from "@/components/photo/photo-card";
import { cn } from "@/lib/utils";
import { useLumaStore } from "@/store/luma-store";
import type { Photo } from "@/types/lumadrop";

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  const {
    selectedIds,
    selectionMode,
    clearSelection,
    gridMode,
    setGridMode,
    downloadPhotos,
    softDelete,
    createAlbum
  } = useLumaStore();
  const visiblePhotos = photos.filter((photo) => !photo.deletedAt);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{visiblePhotos.length} 张照片</p>
          <h2 className="text-2xl font-semibold tracking-normal">光影库</h2>
        </div>
        <div className="flex rounded-2xl bg-muted p-1">
          <button
            onClick={() => setGridMode("grid")}
            className={cn("rounded-xl p-2", gridMode === "grid" && "bg-background shadow-sm")}
            aria-label="宫格"
          >
            <Grid2X2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setGridMode("masonry")}
            className={cn("rounded-xl p-2", gridMode === "masonry" && "bg-background shadow-sm")}
            aria-label="瀑布流"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      <motion.div
        layout
        className={cn(
          "gap-3",
          gridMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "columns-2 space-y-3 sm:columns-3 lg:columns-4"
        )}
      >
        {visiblePhotos.map((photo) => (
          <div key={photo.id} className={gridMode === "masonry" ? "mb-3 break-inside-avoid" : ""}>
            <PhotoCard photo={photo} compact={gridMode === "grid"} />
          </div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectionMode && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed inset-x-3 bottom-24 z-50 mx-auto max-w-md rounded-3xl border bg-card/92 p-3 shadow-soft backdrop-blur-2xl sm:bottom-6"
          >
            <div className="flex items-center justify-between gap-2">
              <Button variant="ghost" size="icon" onClick={clearSelection} aria-label="退出选择">
                <X className="h-5 w-5" />
              </Button>
              <span className="text-sm font-medium">已选择 {selectedIds.length} 张</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => downloadPhotos(selectedIds, "lumadrop-selection")}
                  aria-label="批量下载"
                >
                  <Download className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    createAlbum(
                      {
                        title: "New Drop",
                        description: "由多选照片快速生成的相册，稍后可继续编辑标题、描述与封面。",
                        theme: "editorial",
                        isPrivate: true
                      },
                      selectedIds
                    )
                  }
                  aria-label="创建相册"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => softDelete(selectedIds)} aria-label="删除">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {visiblePhotos.length === 0 && (
        <div className="rounded-3xl border border-dashed bg-card p-8 text-center">
          <Archive className="mx-auto h-9 w-9 text-muted-foreground" />
          <p className="mt-3 font-medium">还没有照片</p>
          <p className="text-sm text-muted-foreground">上传几张照片，LumaDrop 会自动帮你生成可分享的精致相册。</p>
        </div>
      )}
    </div>
  );
}

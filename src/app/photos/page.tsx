"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { PhotoFilters, type SortMode, type TimeFilter } from "@/components/photo/photo-filters";
import { PhotoGrid } from "@/components/photo/photo-grid";
import { Button } from "@/components/ui/button";
import { useLumaStore } from "@/store/luma-store";
import type { PhotoCategory } from "@/types/lumadrop";

export default function PhotosPage() {
  const photos = useLumaStore((state) => state.photos);
  const user = useLumaStore((state) => state.user);
  const myPhotos = useMemo(() => photos.filter((photo) => !user || photo.userId === user.id), [photos, user]);
  const trashCount = myPhotos.filter((photo) => photo.deletedAt).length;
  const [query, setQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [category, setCategory] = useState<PhotoCategory | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const filteredPhotos = useMemo(() => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const keyword = query.trim().toLowerCase();

    return myPhotos
      .filter((photo) => {
        if (photo.deletedAt) return false;
        const taken = new Date(photo.takenAt ?? photo.uploadedAt).getTime();
        const inTime =
          timeFilter === "all" ||
          (timeFilter === "today" && now - taken <= day) ||
          (timeFilter === "week" && now - taken <= day * 7) ||
          (timeFilter === "month" && now - taken <= day * 30) ||
          (timeFilter === "favorite" && photo.favorite);
        const inCategory = category === "all" || (photo.category ?? "other") === category;
        const inQuery =
          !keyword ||
          photo.title.toLowerCase().includes(keyword) ||
          photo.tags?.some((tag) => tag.toLowerCase().includes(keyword));
        return inTime && inCategory && inQuery;
      })
      .sort((a, b) => {
        const left = new Date(a.takenAt ?? a.uploadedAt).getTime();
        const right = new Date(b.takenAt ?? b.uploadedAt).getTime();
        return sortMode === "newest" ? right - left : left - right;
      });
  }, [category, myPhotos, query, sortMode, timeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Photos</p>
          <h1 className="text-3xl font-semibold tracking-normal">我的照片</h1>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/trash">
            <Trash2 className="h-4 w-4" />
            回收站 {trashCount > 0 ? trashCount : ""}
          </Link>
        </Button>
      </div>
      <PhotoFilters
        query={query}
        onQueryChange={setQuery}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        category={category}
        onCategoryChange={setCategory}
        sortMode={sortMode}
        onSortModeChange={setSortMode}
      />
      <PhotoGrid photos={filteredPhotos} />
    </div>
  );
}

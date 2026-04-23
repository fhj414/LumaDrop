"use client";

import { ArrowDownAZ, ArrowUpAZ, Clock, Search, SlidersHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { PhotoCategory } from "@/types/lumadrop";

export type TimeFilter = "all" | "today" | "week" | "month" | "favorite";
export type SortMode = "newest" | "oldest";

export const categoryLabels: Record<PhotoCategory | "all", string> = {
  all: "全部",
  person: "人物",
  animal: "动物",
  plant: "植物",
  city: "城市",
  landscape: "风景",
  interior: "空间",
  food: "美食",
  other: "其他"
};

const timeFilters: { value: TimeFilter; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "全部时间", icon: <Clock className="h-4 w-4" /> },
  { value: "today", label: "今天", icon: <Clock className="h-4 w-4" /> },
  { value: "week", label: "本周", icon: <Clock className="h-4 w-4" /> },
  { value: "month", label: "本月", icon: <Clock className="h-4 w-4" /> },
  { value: "favorite", label: "收藏", icon: <Star className="h-4 w-4" /> }
];

export function PhotoFilters({
  query,
  onQueryChange,
  timeFilter,
  onTimeFilterChange,
  category,
  onCategoryChange,
  sortMode,
  onSortModeChange
}: {
  query: string;
  onQueryChange: (value: string) => void;
  timeFilter: TimeFilter;
  onTimeFilterChange: (value: TimeFilter) => void;
  category: PhotoCategory | "all";
  onCategoryChange: (value: PhotoCategory | "all") => void;
  sortMode: SortMode;
  onSortModeChange: (value: SortMode) => void;
}) {
  return (
    <div className="space-y-3 rounded-3xl border bg-card p-3 shadow-soft">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索标题、人物、动物、植物..."
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onSortModeChange(sortMode === "newest" ? "oldest" : "newest")}
          aria-label="切换排序"
        >
          {sortMode === "newest" ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />}
        </Button>
      </div>

      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        {timeFilters.map((item) => (
          <button
            key={item.value}
            onClick={() => onTimeFilterChange(item.value)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition",
              timeFilter === item.value ? "border-foreground bg-foreground text-background" : "bg-background"
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          智能分类
        </span>
        {(Object.keys(categoryLabels) as Array<PhotoCategory | "all">).map((key) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-2 text-xs font-medium transition",
              category === key ? "border-primary bg-primary text-primary-foreground" : "bg-background"
            )}
          >
            {categoryLabels[key]}
          </button>
        ))}
      </div>
    </div>
  );
}

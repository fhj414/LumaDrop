"use client";

import Image from "next/image";
import { RotateCcw, ShieldAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatBytes, formatDate } from "@/lib/utils";
import { useLumaStore } from "@/store/luma-store";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export default function TrashPage() {
  const { photos, user, restorePhotos, hardDelete, emptyTrash } = useLumaStore();
  const trashed = photos.filter((photo) => (!user || photo.userId === user.id) && photo.deletedAt).sort((a, b) => {
    return new Date(b.deletedAt ?? 0).getTime() - new Date(a.deletedAt ?? 0).getTime();
  });

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Trash</p>
          <h1 className="text-3xl font-semibold tracking-normal">回收站</h1>
        </div>
        <Button variant="destructive" size="sm" onClick={emptyTrash} disabled={trashed.length === 0}>
          清空
        </Button>
      </div>

      <div className="rounded-3xl border bg-card p-4 text-sm leading-6 text-muted-foreground shadow-soft">
        <div className="flex gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>删除的照片会保留 7 天。打开应用时会自动清理超过 7 天的项目；你也可以在这里恢复或永久删除。</p>
        </div>
      </div>

      <div className="grid gap-3">
        {trashed.map((photo) => {
          const deletedAt = new Date(photo.deletedAt ?? Date.now()).getTime();
          const daysLeft = Math.max(0, Math.ceil((SEVEN_DAYS - (Date.now() - deletedAt)) / (24 * 60 * 60 * 1000)));
          return (
            <Card key={photo.id} className="overflow-hidden">
              <CardContent className="flex gap-3 p-3">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted">
                  <Image src={photo.url} alt={photo.title} fill sizes="96px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{photo.title}</p>
                      <p className="text-xs text-muted-foreground">
                        删除于 {formatDate(photo.deletedAt ?? new Date())} · 剩余 {daysLeft} 天
                      </p>
                    </div>
                    <p className="shrink-0 text-xs text-muted-foreground">{formatBytes(photo.size)}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => restorePhotos([photo.id])}>
                      <RotateCcw className="h-4 w-4" />
                      恢复
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => hardDelete([photo.id])}>
                      <Trash2 className="h-4 w-4" />
                      永久删除
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {trashed.length === 0 && (
        <div className="rounded-3xl border border-dashed bg-card p-10 text-center">
          <Trash2 className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-medium">回收站是空的</p>
          <p className="text-sm text-muted-foreground">从照片页删除的文件会先来到这里。</p>
        </div>
      )}
    </div>
  );
}

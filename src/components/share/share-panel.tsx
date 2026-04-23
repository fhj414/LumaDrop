"use client";

import { useState } from "react";
import { Copy, Eye, Lock, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useLumaStore } from "@/store/luma-store";
import type { Album } from "@/types/lumadrop";

export function SharePanel({ album }: { album: Album }) {
  const createShare = useLumaStore((state) => state.createShare);
  const updateAlbum = useLumaStore((state) => state.updateAlbum);
  const [allowDownload, setAllowDownload] = useState(true);
  const [isPublic, setIsPublic] = useState(!album.isPrivate);
  const [password, setPassword] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  function create() {
    const share = createShare({
      albumId: album.id,
      title: album.title,
      isPublic,
      password: password || undefined,
      allowDownload,
      theme: album.theme
    });
    setShareUrl(`${location.origin}/share/${share.token}`);
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>分享设置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <label className="text-sm font-medium">相册标题</label>
          <Input value={album.title} onChange={(event) => updateAlbum(album.id, { title: event.target.value })} />
          <label className="text-sm font-medium">相册描述</label>
          <Textarea value={album.description} onChange={(event) => updateAlbum(album.id, { description: event.target.value })} />
        </div>

        <div className="grid gap-3 rounded-2xl bg-muted/60 p-4">
          <SettingRow icon={<Eye className="h-4 w-4" />} label="公开访问" checked={isPublic} onChange={setIsPublic} />
          <SettingRow icon={<Lock className="h-4 w-4" />} label="允许下载" checked={allowDownload} onChange={setAllowDownload} />
          {!isPublic && <Input placeholder="访问密码，可选" value={password} onChange={(event) => setPassword(event.target.value)} />}
        </div>

        <Button className="w-full" onClick={create}>
          <WandSparkles className="h-4 w-4" />
          生成作品集分享页
        </Button>
        {shareUrl && (
          <button
            className="flex w-full items-center justify-between rounded-2xl border bg-background p-3 text-left text-sm"
            onClick={() => navigator.clipboard.writeText(shareUrl)}
          >
            <span className="truncate">{shareUrl}</span>
            <Copy className="ml-2 h-4 w-4 shrink-0" />
          </button>
        )}
      </CardContent>
    </Card>
  );
}

function SettingRow({
  icon,
  label,
  checked,
  onChange
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-sm">
        {icon}
        {label}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

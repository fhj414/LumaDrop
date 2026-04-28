"use client";

import Link from "next/link";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLumaStore } from "@/store/luma-store";

export default function UploadPage() {
  const user = useLumaStore((state) => state.user);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-muted-foreground">Upload</p>
        <h1 className="text-3xl font-semibold tracking-normal">上传照片</h1>
      </div>
      {user ? (
        <UploadDropzone />
      ) : (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold">先登录，再上传到你的照片库</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              登录后上传的照片会记录在当前账号下，并自动生成属于你的相册。
            </p>
            <Button asChild className="mt-5">
              <Link href="/login">去登录</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

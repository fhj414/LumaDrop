import { NextResponse } from "next/server";
import { putObject } from "@/lib/storage";
import type { Photo } from "@/types/lumadrop";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files").filter((file): file is File => file instanceof File);

  const photos: Photo[] = await Promise.all(
    files.map(async (file) => {
      const object = await putObject(file);
      return {
        id: `p-${crypto.randomUUID()}`,
        title: file.name.replace(/\.[^.]+$/, ""),
        url: object.url,
        width: 1600,
        height: 1200,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        takenAt: new Date().toISOString(),
        favorite: false,
        dominantColor: "#8fb0a0",
        category: "other",
        tags: [],
        exif: {}
      };
    })
  );

  return NextResponse.json({ photos });
}

import { NextResponse } from "next/server";
import { openRouterChat } from "@/lib/ai/openrouter";

function buildFallbackDescription(photoTitles: string[]) {
  const cleaned = photoTitles
    .map((title) => title.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (cleaned.length === 0) {
    return "这组照片保留了刚刚上传时的光线、节奏与情绪，适合继续整理成一页精致的分享相册。";
  }

  if (cleaned.length === 1) {
    return `这组照片围绕「${cleaned[0]}」展开，保留了清晰的视觉重点与轻盈的浏览节奏。`;
  }

  return `这组照片从「${cleaned.join("、")}」慢慢铺开，适合整理成一页有呼吸感、适合分享的精致相册。`;
}

export async function POST(request: Request) {
  const fallbackDescription =
    "这组照片保留了刚刚上传时的光线、节奏与情绪，适合继续整理成一页精致的分享相册。";

  try {
    const body = (await request.json()) as { photoTitles?: string[] };
    const titles = body.photoTitles?.filter(Boolean).slice(0, 20) ?? [];

    try {
      const content = await openRouterChat({
        temperature: 0.6,
        messages: [
          {
            role: "system",
            content:
              "You are a product copywriter for a premium photo delivery app. Write one short Chinese album description (1-2 sentences). Avoid emojis. Keep it warm and concise."
          },
          {
            role: "user",
            content: `Photo titles:\n${titles.map((t) => `- ${t}`).join("\n") || "- (untitled)"}`
          }
        ]
      });

      return NextResponse.json({ ok: true, description: content, source: "openrouter" });
    } catch (error) {
      return NextResponse.json({
        ok: true,
        description: buildFallbackDescription(titles),
        source: "fallback",
        warning: error instanceof Error ? error.message : "AI request failed."
      });
    }
  } catch (error) {
    return NextResponse.json({
      ok: true,
      description: fallbackDescription,
      source: "fallback",
      warning: error instanceof Error ? error.message : "AI request failed."
    });
  }
}

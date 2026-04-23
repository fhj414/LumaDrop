import { NextResponse } from "next/server";
import { openRouterChat } from "@/lib/ai/openrouter";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { photoTitles?: string[] };
    const titles = body.photoTitles?.filter(Boolean).slice(0, 20) ?? [];

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

    return NextResponse.json({ ok: true, description: content });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI request failed." },
      { status: 500 }
    );
  }
}


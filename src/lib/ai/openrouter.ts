type OpenRouterChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OpenRouterChatResponse = {
  choices?: Array<{
    message?: { content?: string };
  }>;
  error?: { message?: string };
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

export async function openRouterChat({
  messages,
  model = process.env.OPENROUTER_MODEL ?? "openrouter/auto",
  temperature = 0.7
}: {
  messages: OpenRouterChatMessage[];
  model?: string;
  temperature?: number;
}) {
  const apiKey = getRequiredEnv("OPENROUTER_API_KEY");
  const baseUrl = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";
  const referer = process.env.OPENROUTER_HTTP_REFERER ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const title = process.env.OPENROUTER_APP_TITLE ?? "LumaDrop";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": referer,
      "X-Title": title
    },
    body: JSON.stringify({
      model,
      temperature,
      messages
    })
  });

  const payload = (await response.json()) as OpenRouterChatResponse;
  if (!response.ok) {
    throw new Error(payload.error?.message ?? `OpenRouter request failed: ${response.status}`);
  }

  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenRouter returned empty response.");
  }
  return content;
}


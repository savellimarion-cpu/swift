const API_URL = "https://api.anthropic.com/v1/messages";

const MODEL_IDS = {
  opus: "claude-opus-4-6",
  sonnet: "claude-sonnet-4-6",
} as const;

export interface ClaudeCallOptions {
  model: keyof typeof MODEL_IDS;
  system: string;
  user: string;
  maxTokens?: number;
}

interface AnthropicContentBlock {
  type: string;
  text?: string;
}

interface AnthropicResponse {
  content: AnthropicContentBlock[];
}

export async function callClaude({
  model,
  system,
  user,
  maxTokens = 4096,
}: ClaudeCallOptions): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY n'est pas configurée. Ajoute-la dans .env (voir .env.example)."
    );
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL_IDS[model],
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API Anthropic (${res.status}) : ${text}`);
  }

  const data: AnthropicResponse = await res.json();
  return data.content
    .filter((b) => b.type === "text" && typeof b.text === "string")
    .map((b) => b.text as string)
    .join("\n")
    .trim();
}

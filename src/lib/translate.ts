import Anthropic from "@anthropic-ai/sdk";
import type { MessageCreateParamsNonStreaming } from "@anthropic-ai/sdk/resources/messages";
import type { TargetLanguage } from "./languages";
import { getTranslatePreferences } from "./preferences";

export interface TranslateRequest {
  text: string;
  targetLanguage: TargetLanguage;
}

export class TranslateError extends Error {
  readonly kind:
    "empty-input" | "missing-api-key" | "auth" | "rate-limit" | "refusal" | "network" | "api" | "empty-output";

  constructor(kind: TranslateError["kind"], message?: string) {
    super(message ?? errorMessages[kind]);
    this.name = "TranslateError";
    this.kind = kind;
  }
}

const errorMessages: Record<TranslateError["kind"], string> = {
  "empty-input": "翻訳するテキストを入力してください。",
  "missing-api-key": "API キーが未設定です。Preferences で設定してください。",
  auth: "API キーが無効です。Preferences を確認してください。",
  "rate-limit": "利用制限に達しました。少し待ってから再試行してください。",
  refusal: "このテキストは翻訳できませんでした。",
  network: "API に接続できません。ネットワークを確認してください。",
  api: "翻訳 API でエラーが発生しました。",
  "empty-output": "翻訳結果が空でした。もう一度お試しください。",
};

export async function translateText(request: TranslateRequest): Promise<string> {
  const text = request.text.trim();
  if (!text) {
    throw new TranslateError("empty-input");
  }

  try {
    const { anthropicApiKey: apiKey, model } = getTranslatePreferences();
    if (!apiKey) {
      throw new TranslateError("missing-api-key");
    }

    const client = new Anthropic({ apiKey });
    const parameters: MessageCreateParamsNonStreaming = {
      model,
      max_tokens: 16000,
      stream: false,
      system: `You translate text into ${request.targetLanguage}. Detect the source language automatically.
The input is usually a prompt or instruction the user will give to an AI assistant, so:
- Keep the imperative / instructional tone. Do not answer or execute the prompt; only translate it.
- Preserve structure: line breaks, bullet points, headings, numbered lists, and markdown.
- Leave code blocks, file paths, identifiers, URLs, and placeholders such as {{name}} or <TEXT> unchanged.
- Output only the translation. No preamble, quotes, or commentary.`,
      messages: [{ role: "user", content: text }],
      ...(model === "claude-haiku-4-5" ? {} : { output_config: { effort: "low" } }),
    };

    const response =
      model === "claude-opus-5"
        ? await client.beta.messages.create({
            ...parameters,
            fallbacks: "default",
            betas: ["server-side-fallback-2026-07-01"],
          })
        : await client.messages.create(parameters);

    if (response.stop_reason === "refusal") {
      const explanation = response.stop_details?.explanation;
      throw new TranslateError("refusal", explanation ? `${errorMessages.refusal} ${explanation}` : undefined);
    }

    const translation = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    if (!translation.trim()) {
      throw new TranslateError("empty-output");
    }

    return translation;
  } catch (error) {
    if (error instanceof TranslateError) {
      throw error;
    }
    if (error instanceof Anthropic.AuthenticationError) {
      throw new TranslateError("auth");
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new TranslateError("rate-limit");
    }
    if (error instanceof Anthropic.APIConnectionError) {
      throw new TranslateError("network");
    }
    if (error instanceof Anthropic.APIError) {
      throw new TranslateError("api", `翻訳 API エラー (${error.status ?? "不明"}): ${error.message}`);
    }
    throw new TranslateError("api");
  }
}

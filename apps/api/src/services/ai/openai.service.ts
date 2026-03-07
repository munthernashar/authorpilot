import OpenAI from 'openai';
import { HttpError } from '../../common/http-error.js';
import { env } from '../../config/env.js';

type TextInput = { prompt: string; model?: string; temperature?: number; maxTokens?: number };
type ImageInput = { prompt: string; size?: '1024x1024' | '1536x1024' | '1024x1536'; model?: string };

const openaiClient = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

const ensureOpenAIClient = () => {
  if (!openaiClient) {
    throw new HttpError(500, 'OpenAI is not configured. Set OPENAI_API_KEY or switch AI_PROVIDER=ollama.');
  }

  return openaiClient;
};

const generateWithOpenAI = async (input: TextInput) => {
  const response = await ensureOpenAIClient().chat.completions.create({
    model: input.model ?? env.OPENAI_MODEL_TEXT,
    temperature: input.temperature ?? 0.7,
    max_tokens: input.maxTokens ?? 1200,
    messages: [{ role: 'user', content: input.prompt }]
  });

  return response.choices[0]?.message?.content?.trim() ?? '';
};

const generateWithOllama = async (input: TextInput) => {
  const response = await fetch(`${env.OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: input.model ?? env.OLLAMA_MODEL_TEXT,
      prompt: input.prompt,
      stream: false,
      options: {
        temperature: input.temperature ?? 0.7,
        num_predict: input.maxTokens ?? 1200
      }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new HttpError(502, `Ollama request failed (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as { response?: string; error?: string };
  if (!payload.response) {
    throw new HttpError(502, payload.error ?? 'Ollama returned no response');
  }

  return payload.response.trim();
};

export const aiTextService = {
  async generateText(input: TextInput) {
    if (env.AI_PROVIDER === 'ollama') {
      return generateWithOllama(input);
    }

    return generateWithOpenAI(input);
  },

  async generateJson<T>(input: { prompt: string; model?: string; temperature?: number }): Promise<T> {
    const raw = await aiTextService.generateText({
      prompt: `${input.prompt}\n\nReturn ONLY valid JSON.`,
      model: input.model,
      temperature: input.temperature ?? 0.3,
      maxTokens: 1600
    });

    try {
      return JSON.parse(raw) as T;
    } catch {
      throw new HttpError(502, 'Model returned invalid JSON');
    }
  }
};

export const aiImageService = {
  async generateImage(input: ImageInput) {
    if (env.AI_PROVIDER === 'ollama') {
      throw new HttpError(501, 'Image generation is currently only supported with AI_PROVIDER=openai.');
    }

    const response = await ensureOpenAIClient().images.generate({
      model: input.model ?? env.OPENAI_MODEL_IMAGE,
      prompt: input.prompt,
      size: input.size ?? '1024x1024'
    });

    const base64 = response.data?.[0]?.b64_json;
    if (!base64) {
      throw new HttpError(502, 'Image generation returned empty result');
    }

    return base64;
  }
};

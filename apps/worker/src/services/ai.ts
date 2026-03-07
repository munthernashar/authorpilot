import OpenAI from 'openai';
import { env } from '../config/env.js';

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export const generateText = async (prompt: string, maxTokens = 1200, temperature = 0.7) => {
  if (env.AI_PROVIDER === 'ollama') {
    const response = await fetch(`${env.OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: env.OLLAMA_MODEL_TEXT,
        prompt,
        stream: false,
        options: { num_predict: maxTokens, temperature }
      })
    });
    const payload = (await response.json()) as { response?: string; error?: string };
    if (!response.ok || !payload.response) {
      throw new Error(payload.error ?? 'ollama text generation failed');
    }
    return payload.response;
  }

  if (!openai) {
    throw new Error('OPENAI_API_KEY is missing and AI_PROVIDER is openai');
  }

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL_TEXT,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature
  });

  return response.choices[0]?.message?.content?.trim() ?? '';
};

export const generateImageBase64 = async (prompt: string, size: '1024x1024' | '1536x1024' | '1024x1536' = '1024x1024') => {
  if (env.AI_PROVIDER === 'ollama') {
    throw new Error('image generation not supported in ollama provider');
  }

  if (!openai) {
    throw new Error('OPENAI_API_KEY is missing and AI_PROVIDER is openai');
  }

  const response = await openai.images.generate({
    model: env.OPENAI_MODEL_IMAGE,
    prompt,
    size
  });

  const base64 = response.data?.[0]?.b64_json;
  if (!base64) {
    throw new Error('image generation returned no data');
  }

  return base64;
};

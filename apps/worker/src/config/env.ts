import 'dotenv/config';

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  REDIS_HOST: process.env.REDIS_HOST ?? '127.0.0.1',
  REDIS_PORT: Number(process.env.REDIS_PORT ?? 6379),
  AI_PROVIDER: process.env.AI_PROVIDER ?? 'openai',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL_TEXT: process.env.OPENAI_MODEL_TEXT ?? 'gpt-4o-mini',
  OPENAI_MODEL_IMAGE: process.env.OPENAI_MODEL_IMAGE ?? 'gpt-image-1',
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
  OLLAMA_MODEL_TEXT: process.env.OLLAMA_MODEL_TEXT ?? 'llama3.1:8b'
};

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

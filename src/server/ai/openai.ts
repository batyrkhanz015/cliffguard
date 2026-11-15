import 'server-only';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, Output, type ModelMessage } from 'ai';
import { z } from 'zod';
import { openAiModel } from './client';

/** Direct OpenAI requests: no Gateway account, tools, response storage, or content telemetry. */
export async function openAiObject<T>(schema: z.ZodType<T>, system: string, messages: ModelMessage[], signal: AbortSignal): Promise<T> {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    // Do not allow an inherited SDK/proxy URL to receive documents or credentials.
    baseURL: 'https://api.openai.com/v1',
  });
  // Provider warnings can contain response data. Never send them to the default logger.
  globalThis.AI_SDK_LOG_WARNINGS = false;
  const result = await generateText({
    model: openai.responses(openAiModel()),
    system,
    messages,
    output: Output.object({ schema }),
    maxOutputTokens: 4000,
    reasoning: 'low',
    maxRetries: 0,
    abortSignal: signal,
    providerOptions: { openai: { store: false, strictJsonSchema: true, reasoningSummary: null } },
    telemetry: { isEnabled: false, recordInputs: false, recordOutputs: false },
  });
  if (result.finishReason !== 'stop') throw new Error('AI response incomplete');
  return result.output;
}

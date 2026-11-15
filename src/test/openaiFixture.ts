/** Responses API wire format, consumed by the real OpenAI provider in transport tests. */
export function openAiReply(payload: unknown, incomplete = false, refusal = false): Response {
  return Response.json({
    id: 'resp_test', model: 'gpt-6.1-sol', created_at: 1794744000,
    output: [{ id: 'msg_test', type: 'message', role: 'assistant', content: [refusal
      ? { type: 'refusal', refusal: 'Unable to read this document.' }
      : { type: 'output_text', text: JSON.stringify(payload), annotations: [] }] }],
    incomplete_details: incomplete ? { reason: 'max_output_tokens' } : null,
    usage: { input_tokens: 100, output_tokens: 150, total_tokens: 250, output_tokens_details: { reasoning_tokens: 50 } },
  });
}

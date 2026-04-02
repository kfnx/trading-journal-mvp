import type { OpenRouterMessage } from '@/types/chat'

const DEFAULT_MODEL = 'anthropic/claude-3-haiku'

export async function chatWithOpenRouter(
  messages: OpenRouterMessage[],
  apiKey: string,
  model = DEFAULT_MODEL
): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Trading Journal',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.4,
      max_tokens: 1024,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenRouter error ${response.status}: ${err}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? '(no response)'
}

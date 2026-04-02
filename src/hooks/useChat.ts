import { useChatStore, useTradeStore } from '@/store'
import { chatWithOpenRouter } from '@/utils/openrouter'
import { computeStats, buildTradeContextBlock } from '@/utils/analytics'
import systemPromptRaw from '@/features/chat/analysis.md?raw'
import type { OpenRouterMessage } from '@/types/chat'

export function useChat() {
  const { messages, isLoading, apiKey, model, addMessage, setLoading } = useChatStore()
  const trades = useTradeStore((s) => s.trades)

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    addMessage('user', text.trim())
    setLoading(true)

    try {
      const stats = computeStats(trades)
      const contextBlock = buildTradeContextBlock(trades, stats)
      const fullSystemPrompt = `${systemPromptRaw}\n\n${contextBlock}`

      const history: OpenRouterMessage[] = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

      history.push({ role: 'user', content: text.trim() })

      const reply = await chatWithOpenRouter(
        [{ role: 'system', content: fullSystemPrompt }, ...history],
        apiKey,
        model
      )
      addMessage('assistant', reply)
    } catch (err) {
      addMessage('assistant', `Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return { messages, isLoading, sendMessage }
}

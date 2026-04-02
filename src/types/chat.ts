export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  timestamp: string
}

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

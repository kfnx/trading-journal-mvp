import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { ChatMessage } from '@/types/chat'

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  apiKey: string
  model: string
  addMessage: (role: ChatMessage['role'], content: string) => void
  setLoading: (v: boolean) => void
  setApiKey: (key: string) => void
  setModel: (model: string) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      apiKey: import.meta.env.VITE_OPENROUTER_API_KEY ?? '',
      model: import.meta.env.VITE_OPENROUTER_MODEL ?? 'anthropic/claude-3-haiku',
      addMessage: (role, content) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { id: uuidv4(), role, content, timestamp: new Date().toISOString() },
          ],
        })),
      setLoading: (isLoading) => set({ isLoading }),
      setApiKey: (apiKey) => set({ apiKey }),
      setModel: (model) => set({ model }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'tj-chat',
      partialize: (state) => ({
        messages: state.messages,
        apiKey: state.apiKey,
        model: state.model,
      }),
    }
  )
)

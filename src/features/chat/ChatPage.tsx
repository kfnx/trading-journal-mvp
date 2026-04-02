import { useEffect, useRef, useState } from 'react'
import { RiSendPlaneLine, RiSettings3Line, RiDeleteBinLine } from '@remixicon/react'
import { useChat } from '@/hooks/useChat'
import { useChatStore } from '@/store'
import { MessageBubble, TypingIndicator } from './MessageBubble'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'

export default function ChatPage() {
  const { messages, isLoading, sendMessage } = useChat()
  const { apiKey, model, setApiKey, setModel, clearMessages } = useChatStore()
  const [input, setInput] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [tempKey, setTempKey] = useState(apiKey)
  const [tempModel, setTempModel] = useState(model)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const noApiKey = !apiKey

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">{model}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => clearMessages()} title="Clear chat">
            <RiDeleteBinLine className="size-4" />
          </Button>
          <Button variant="stroke" size="sm" onClick={() => { setTempKey(apiKey); setTempModel(model); setSettingsOpen(true) }}>
            <RiSettings3Line className="size-4" /> Settings
          </Button>
        </div>
      </div>

      {/* API key warning */}
      {noApiKey && (
        <div className="mb-4 border border-warning-600 bg-neutral-900 px-4 py-3 font-mono text-xs text-warning-500">
          No API key set. <button className="font-semibold underline" onClick={() => setSettingsOpen(true)}>Add your OpenRouter key</button> to enable the AI chat.
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto border border-neutral-800 bg-neutral-900 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-neutral-500">Ask me anything about your trades</p>
            <p className="text-xs text-neutral-400 max-w-xs">Try: "What's my win rate?" or "Which symbol is most profitable?"</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-3 flex items-end gap-2">
        <Textarea
          className="min-h-[48px] max-h-32 resize-none flex-1"
          placeholder="Ask about your trades… (Enter to send, Shift+Enter for newline)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || noApiKey}
        />
        <Button
          size="md"
          onClick={handleSend}
          disabled={isLoading || !input.trim() || noApiKey}
          className="h-12 px-4"
        >
          <RiSendPlaneLine className="size-4" />
        </Button>
      </div>

      {/* Settings dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Chat Settings</DialogTitle>
            <DialogDescription>
              Configure your OpenRouter API key and model. Get a free key at openrouter.ai.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="api-key">OpenRouter API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="sk-or-…"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="anthropic/claude-3-haiku"
                value={tempModel}
                onChange={(e) => setTempModel(e.target.value)}
              />
              <p className="text-xs text-neutral-400">
                Any OpenRouter model ID. E.g. openai/gpt-4o-mini, google/gemini-flash-1.5
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="stroke" size="sm" onClick={() => setSettingsOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { setApiKey(tempKey); setModel(tempModel); setSettingsOpen(false) }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

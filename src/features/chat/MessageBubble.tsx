import { RiUserLine, RiRobot2Line } from '@remixicon/react'
import { cn } from '@/utils/cn'
import type { ChatMessage } from '@/types/chat'

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex items-start gap-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-full text-white',
        isUser ? 'bg-primary-600' : 'bg-neutral-700 dark:bg-neutral-600'
      )}>
        {isUser
          ? <RiUserLine className="size-3.5" />
          : <RiRobot2Line className="size-3.5" />
        }
      </div>

      {/* Bubble */}
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
        isUser
          ? 'bg-primary-600 text-white rounded-tr-sm'
          : 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 rounded-tl-sm'
      )}>
        {message.content}
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-700 dark:bg-neutral-600 text-white">
        <RiRobot2Line className="size-3.5" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-neutral-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

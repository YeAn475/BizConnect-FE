import { MessageSquare } from 'lucide-react'

export function ChatEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-slate-400">
      <MessageSquare className="h-10 w-10" strokeWidth={1.5} />
      <p className="text-sm">친구를 선택해 메시지를 보내거나, 채팅방을 선택해주세요.</p>
    </div>
  )
}

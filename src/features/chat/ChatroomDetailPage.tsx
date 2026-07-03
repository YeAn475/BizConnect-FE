import { type FormEvent, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import type { IMessage } from '@stomp/stompjs'
import { chatApi } from '@/api/chatApi'
import { chatroomApi } from '@/api/chatroomApi'
import { createStompClient, sendChatMessage } from '@/ws/stompClient'
import type { LiveChatMessage, MessageHistoryItem } from '@/types/chat'
import { useAuthStore } from '@/stores/useAuthStore'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { formatDateTime } from '@/lib/date'
import { getErrorMessage } from '@/lib/errorMessage'

type DisplayMessage = MessageHistoryItem | LiveChatMessage

export function ChatroomDetailPage() {
  const { chatroomNo } = useParams<{ chatroomNo: string }>()
  const navigate = useNavigate()
  const currentUserName = useAuthStore((s) => s.user?.name)
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const clientRef = useRef<ReturnType<typeof createStompClient> | null>(null)

  useEffect(() => {
    if (!chatroomNo) return
    function load() {
      setLoading(true)
      chatApi
        .history(Number(chatroomNo), { page: 0, size: 50 })
        .then(setMessages)
        .catch((error) => toast.error(getErrorMessage(error)))
        .finally(() => setLoading(false))
    }
    load()
  }, [chatroomNo])

  useEffect(() => {
    if (!chatroomNo) return
    const client = createStompClient()
    clientRef.current = client

    client.onConnect = () => {
      setConnected(true)
      client.subscribe(`/topic/chatroom/${chatroomNo}`, (msg: IMessage) => {
        const body: LiveChatMessage = JSON.parse(msg.body)
        setMessages((prev) => [...prev, body])
      })
      client.subscribe('/user/queue/errors', (msg: IMessage) => toast.error(msg.body))
    }
    client.onDisconnect = () => setConnected(false)
    client.activate()

    return () => {
      client.deactivate()
    }
  }, [chatroomNo])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(e: FormEvent) {
    e.preventDefault()
    if (!input.trim() || !clientRef.current || !chatroomNo) return
    sendChatMessage(clientRef.current, Number(chatroomNo), input.trim())
    setInput('')
  }

  async function handleLeave() {
    if (!chatroomNo) return
    try {
      await chatroomApi.leave(Number(chatroomNo))
      navigate('/chat', { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-2xl flex-col">
      <PageHeader
        title={`채팅방 #${chatroomNo}`}
        description={connected ? '실시간 연결됨' : '연결 중...'}
        action={
          <Button variant="secondary" size="sm" onClick={handleLeave}>
            나가기
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-4">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((m) => {
              const mine = m.userName === currentUserName
              return (
                <div key={m.messageNo} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-slate-400">{m.userName}</span>
                  <div
                    className={`max-w-xs rounded-lg px-3 py-2 text-sm ${mine ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800'}`}
                  >
                    {m.content}
                  </div>
                  <span className="text-[10px] text-slate-300">{formatDateTime(m.createdAt)}</span>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        <Button type="submit" disabled={!connected}>
          전송
        </Button>
      </form>
    </div>
  )
}

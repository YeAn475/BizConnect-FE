import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAuthStore } from '@/stores/useAuthStore'

export function createStompClient(): Client {
  const client = new Client({
    webSocketFactory: () => new SockJS('/ws'),
    reconnectDelay: 5000,
    // Re-read the token on every (re)connect attempt rather than capturing it once,
    // since the access token can change (refresh) across the socket's lifetime.
    beforeConnect: () => {
      const token = useAuthStore.getState().accessToken
      client.connectHeaders = token ? { Authorization: `Bearer ${token}` } : {}
    },
  })
  return client
}

export function sendChatMessage(client: Client, chatroomNo: number, content: string) {
  client.publish({
    destination: '/app/chat.send',
    body: JSON.stringify({ chatroomNo, content }),
  })
}

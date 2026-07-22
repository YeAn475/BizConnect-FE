import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { MessageSquarePlus, Search, Users } from 'lucide-react'
import { friendApi } from '@/api/friendApi'
import { chatroomApi } from '@/api/chatroomApi'
import type { FriendListItem } from '@/types/friend'
import type { ChatroomListItem } from '@/types/chat'
import { Spinner } from '@/components/common/Spinner'
import { getErrorMessage } from '@/lib/errorMessage'
import clsx from 'clsx'
import { GroupChatModal } from './GroupChatModal'

export function ChatLayout() {
  const navigate = useNavigate()
  const [friends, setFriends] = useState<FriendListItem[]>([])
  const [loadingFriends, setLoadingFriends] = useState(true)
  const [keyword, setKeyword] = useState('')

  const [rooms, setRooms] = useState<ChatroomListItem[]>([])
  const [loadingRooms, setLoadingRooms] = useState(true)

  const [menuForUserNo, setMenuForUserNo] = useState<number | null>(null)
  const [messagingUserNo, setMessagingUserNo] = useState<number | null>(null)
  const [groupModalOpen, setGroupModalOpen] = useState(false)

  function loadFriends() {
    setLoadingFriends(true)
    friendApi
      .list({ page: 0, size: 100 })
      .then(setFriends)
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoadingFriends(false))
  }

  function loadRooms() {
    setLoadingRooms(true)
    chatroomApi
      .joined({ page: 0, size: 100 })
      .then(setRooms)
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoadingRooms(false))
  }

  useEffect(loadFriends, [])
  useEffect(loadRooms, [])

  const filteredFriends = friends.filter((f) => f.name.includes(keyword) || f.companyName.includes(keyword))

  // 친구와의 1:1 대화방을 찾는 기준: 이 앱은 채팅방 멤버 목록을 조회하는 API가 없어서,
  // "내가 참여중인 방 중 이름이 그 친구 이름과 완전히 같은 방"을 1:1 대화방으로 간주하는
  // 방식으로 근사한다 (완벽하지는 않지만 동명이인/그룹방 이름 충돌이 드문 소규모 조직용으로는 충분).
  async function handleMessageFriend(friend: FriendListItem) {
    setMenuForUserNo(null)
    setMessagingUserNo(friend.userNo)
    try {
      const existing = rooms.find((r) => r.name === friend.name)
      if (existing) {
        navigate(`/chat/${existing.chatroomNo}`)
        return
      }
      const res = await chatroomApi.create(friend.name, [friend.userNo])
      toast.success(res.message || '대화방이 생성되었습니다.')
      loadRooms()
      navigate(`/chat/${res.chatroomNo}`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setMessagingUserNo(null)
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200">
        <div className="border-b border-slate-100 p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="친구 검색"
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-2 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-3 pt-3">
            <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              친구 {friends.length > 0 && `· ${friends.length}`}
            </p>
            {loadingFriends ? (
              <Spinner label="" />
            ) : filteredFriends.length === 0 ? (
              <p className="px-1 py-3 text-xs text-slate-400">친구가 없습니다.</p>
            ) : (
              <ul className="flex flex-col">
                {filteredFriends.map((friend) => (
                  <li key={friend.userNo} className="relative">
                    <button
                      onClick={() => setMenuForUserNo(friend.userNo)}
                      className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left hover:bg-slate-50"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-600 text-xs font-semibold text-white">
                        {friend.imageUrl ? (
                          <img src={friend.imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          friend.name.slice(0, 1)
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-slate-800">{friend.name}</span>
                        <span className="block truncate text-xs text-slate-400">{friend.companyName}</span>
                      </span>
                      {messagingUserNo === friend.userNo && (
                        <span className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                      )}
                    </button>

                    {menuForUserNo === friend.userNo && (
                      <>
                        <button
                          aria-label="닫기"
                          className="fixed inset-0 z-40 cursor-default"
                          onClick={() => setMenuForUserNo(null)}
                        />
                        <div className="absolute left-2 top-full z-50 mt-0.5 w-40 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                          <button
                            onClick={() => handleMessageFriend(friend)}
                            className="w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                          >
                            메시지 보내기
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-2 px-3 pb-3 pt-2">
            <div className="mb-1.5 flex items-center justify-between px-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">채팅방</p>
              <button
                onClick={() => setGroupModalOpen(true)}
                aria-label="단체 채팅 만들기"
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <MessageSquarePlus className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            {loadingRooms ? (
              <Spinner label="" />
            ) : rooms.length === 0 ? (
              <p className="px-1 py-3 text-xs text-slate-400">참여중인 채팅방이 없습니다.</p>
            ) : (
              <ul className="flex flex-col">
                {rooms.map((room) => (
                  <li key={room.chatroomNo}>
                    <NavLink
                      to={`/chat/${room.chatroomNo}`}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm',
                          isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50',
                        )
                      }
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                        <Users className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <span className="truncate font-medium">{room.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>

      <GroupChatModal
        open={groupModalOpen}
        friends={friends}
        onClose={() => setGroupModalOpen(false)}
        onCreated={(chatroomNo) => {
          setGroupModalOpen(false)
          loadRooms()
          navigate(`/chat/${chatroomNo}`)
        }}
      />
    </div>
  )
}

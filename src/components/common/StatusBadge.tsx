import clsx from 'clsx'

const TONE_MAP: Record<string, string> = {
  // 공통 긍정/완료
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  ACCEPTED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  ANSWERED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  // 대기
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  // 부정/거절/종료
  REJECTED: 'bg-red-50 text-red-700 ring-red-600/20',
  CLOSED: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  CLOSE: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  DELETED: 'bg-slate-100 text-slate-500 ring-slate-500/20',
  INACTIVE: 'bg-slate-100 text-slate-500 ring-slate-500/20',
  SUSPENDED: 'bg-red-50 text-red-700 ring-red-600/20',
}

const LABEL_MAP: Record<string, string> = {
  APPROVED: '승인됨',
  ACCEPTED: '수락됨',
  ACTIVE: '진행중',
  ANSWERED: '답변완료',
  PENDING: '대기중',
  REJECTED: '거절됨',
  CLOSED: '종료됨',
  CLOSE: '종료됨',
  DELETED: '삭제됨',
  INACTIVE: '비활성',
  SUSPENDED: '보류',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        TONE_MAP[status] ?? 'bg-slate-100 text-slate-600 ring-slate-500/20',
      )}
    >
      {LABEL_MAP[status] ?? status}
    </span>
  )
}

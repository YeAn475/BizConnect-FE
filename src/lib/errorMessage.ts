import { isAxiosError } from 'axios'

interface SpringErrorBody {
  message?: string
  error?: string
  errors?: { defaultMessage?: string }[]
}

export function getErrorMessage(error: unknown, fallback = '요청 처리 중 오류가 발생했습니다.'): string {
  if (isAxiosError<SpringErrorBody>(error)) {
    const body = error.response?.data
    if (body?.errors?.length) {
      return body.errors.map((e) => e.defaultMessage).filter(Boolean).join('\n') || fallback
    }
    if (body?.message) return body.message
    if (body?.error) return body.error
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return fallback
}

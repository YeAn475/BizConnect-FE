import { useCallback, useState } from 'react'

/**
 * List endpoints in this backend return plain arrays with no total-count metadata,
 * so "has next page" is inferred heuristically: a full page (length === size) implies
 * there might be more; a short page implies this is the last one.
 */
export function usePagination(size = 10) {
  const [page, setPage] = useState(0)
  const [hasNext, setHasNext] = useState(false)

  const applyResultLength = useCallback(
    (length: number) => {
      setHasNext(length === size)
    },
    [size],
  )

  const nextPage = useCallback(() => setPage((p) => (hasNext ? p + 1 : p)), [hasNext])
  const prevPage = useCallback(() => setPage((p) => Math.max(0, p - 1)), [])
  const reset = useCallback(() => setPage(0), [])

  return { page, size, hasNext, applyResultLength, nextPage, prevPage, reset }
}

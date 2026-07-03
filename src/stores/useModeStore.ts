import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CompanyMode = 'BUYER' | 'SUPPLIER'

interface ModeState {
  mode: CompanyMode
  setMode: (mode: CompanyMode) => void
  reset: () => void
}

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      mode: 'BUYER',
      setMode: (mode) => set({ mode }),
      reset: () => set({ mode: 'BUYER' }),
    }),
    { name: 'bizconnect-mode' },
  ),
)

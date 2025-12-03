import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ColumnSizingState, Updater } from '@tanstack/react-table'

interface TableState {
  columnSizing: ColumnSizingState
  setColumnSizing: (updater: Updater<ColumnSizingState>) => void
}

export const useTableStore = create<TableState>()(
  persist(
    (set, get) => ({
      columnSizing: {},
      setColumnSizing: (updater) => {
        const newState =
          typeof updater === 'function' ? updater(get().columnSizing) : updater
        set({ columnSizing: newState })
      },
    }),
    {
      name: 'table-settings',
      partialize: (state) => ({ columnSizing: state.columnSizing }),
    }
  )
)


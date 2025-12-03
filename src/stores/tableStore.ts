import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ColumnSizingState, VisibilityState, Updater } from '@tanstack/react-table'

interface TableState {
  columnSizing: ColumnSizingState
  columnVisibility: VisibilityState
  setColumnSizing: (updater: Updater<ColumnSizingState>) => void
  setColumnVisibility: (updater: Updater<VisibilityState>) => void
}

export const useTableStore = create<TableState>()(
  persist(
    (set, get) => ({
      columnSizing: {},
      columnVisibility: {},
      setColumnSizing: (updater) => {
        const newState =
          typeof updater === 'function' ? updater(get().columnSizing) : updater
        set({ columnSizing: newState })
      },
      setColumnVisibility: (updater) => {
        const newState =
          typeof updater === 'function' ? updater(get().columnVisibility) : updater
        set({ columnVisibility: newState })
      },
    }),
    {
      name: 'table-settings',
      partialize: (state) => ({
        columnSizing: state.columnSizing,
        columnVisibility: state.columnVisibility,
      }),
    }
  )
)


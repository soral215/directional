import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ChartItemConfig {
  key: string
  label: string
  color: string
  visible: boolean
}

interface ChartSettingsState {
  settings: Record<string, ChartItemConfig[]>
  getSettings: (chartId: string) => ChartItemConfig[] | undefined
  setSettings: (chartId: string, items: ChartItemConfig[]) => void
  resetSettings: (chartId: string) => void
}

export const useChartSettingsStore = create<ChartSettingsState>()(
  persist(
    (set, get) => ({
      settings: {},
      getSettings: (chartId: string) => get().settings[chartId],
      setSettings: (chartId: string, items: ChartItemConfig[]) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [chartId]: items,
          },
        }))
      },
      resetSettings: (chartId: string) => {
        set((state) => {
          const { [chartId]: _, ...rest } = state.settings
          return { settings: rest }
        })
      },
    }),
    {
      name: 'chart-settings',
    }
  )
)


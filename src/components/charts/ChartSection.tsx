import type { ReactNode } from 'react'

interface ChartSectionProps {
  title: string
  children: ReactNode
}

export const ChartSection = ({ title, children }: ChartSectionProps) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {children}
      </div>
    </section>
  )
}

interface ChartCardProps {
  title: string
  isLoading?: boolean
  error?: Error | null
  onSettingsClick?: () => void
  children: ReactNode
}

export const ChartCard = ({ title, isLoading, error, onSettingsClick, children }: ChartCardProps) => {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className="text-gray-500 hover:text-gray-300 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>로딩중...</span>
          </div>
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-red-400">데이터를 불러오는데 실패했습니다.</p>
        </div>
      ) : (
        children
      )}
    </div>
  )
}

interface ChartPlaceholderProps {
  label: string
  height?: string
}

export const ChartPlaceholder = ({ label, height = 'h-64' }: ChartPlaceholderProps) => {
  return (
    <div className={`${height} bg-gray-900/50 rounded-lg flex items-center justify-center text-gray-600`}>
      {label}
    </div>
  )
}

import type { ReactNode } from 'react'

interface ChartSectionProps {
  title: string
  children: ReactNode
}

export const ChartSection = ({ title, children }: ChartSectionProps) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-6">
        {children}
      </div>
    </section>
  )
}

interface ChartCardProps {
  title: string
  children: ReactNode
}

export const ChartCard = ({ title, children }: ChartCardProps) => {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
      <h3 className="text-sm font-medium text-gray-400 mb-4">{title}</h3>
      {children}
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


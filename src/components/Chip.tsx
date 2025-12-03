import type { ReactNode } from 'react'

type ChipVariant = 'default' | 'red' | 'yellow' | 'green' | 'blue'

interface ChipProps {
  variant?: ChipVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<ChipVariant, string> = {
  default: 'bg-gray-500/20 text-gray-400',
  red: 'bg-red-500/20 text-red-400',
  yellow: 'bg-yellow-500/20 text-yellow-400',
  green: 'bg-green-500/20 text-green-400',
  blue: 'bg-blue-500/20 text-blue-400',
}

export const Chip = ({ variant = 'default', children, className = '' }: ChipProps) => {
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}


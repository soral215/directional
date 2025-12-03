import type { Category } from '../api/posts'

export const categoryVariant: Record<Category, 'red' | 'yellow' | 'green'> = {
  NOTICE: 'red',
  QNA: 'yellow',
  FREE: 'green',
}

export const categoryStyles: Record<Category, { active: string; inactive: string }> = {
  NOTICE: {
    active: 'bg-red-500/30 text-red-400 border-red-500/50',
    inactive: 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-red-500/10 hover:text-red-400',
  },
  QNA: {
    active: 'bg-yellow-500/30 text-yellow-400 border-yellow-500/50',
    inactive: 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-yellow-500/10 hover:text-yellow-400',
  },
  FREE: {
    active: 'bg-green-500/30 text-green-400 border-green-500/50',
    inactive: 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-green-500/10 hover:text-green-400',
  },
}

export const categories: Category[] = ['NOTICE', 'QNA', 'FREE']

